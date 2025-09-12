/**
 * 에러 처리 유틸리티
 * - 일관된 에러 처리 로직 제공
 * - 사용자 친화적인 에러 메시지 생성
 * - 로깅 및 모니터링 지원
 */

export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: Date
}

export class CustomError extends Error {
  public code: string
  public details?: any
  public timestamp: Date

  constructor(code: string, message: string, details?: any) {
    super(message)
    this.name = 'CustomError'
    this.code = code
    this.details = details
    this.timestamp = new Date()
  }
}

// 에러 코드 상수
export const ERROR_CODES = {
  // 네트워크 에러
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // 인증 에러
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  
  // 데이터 에러
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  DUPLICATE_ERROR: 'DUPLICATE_ERROR',
  
  // 스토리지 에러
  STORAGE_ERROR: 'STORAGE_ERROR',
  STORAGE_QUOTA_EXCEEDED: 'STORAGE_QUOTA_EXCEEDED',
  
  // 일반 에러
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
} as const

// 사용자 친화적인 에러 메시지
export const ERROR_MESSAGES = {
  [ERROR_CODES.NETWORK_ERROR]: '네트워크 연결을 확인해주세요.',
  [ERROR_CODES.TIMEOUT_ERROR]: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
  [ERROR_CODES.UNAUTHORIZED]: '로그인이 필요합니다.',
  [ERROR_CODES.FORBIDDEN]: '접근 권한이 없습니다.',
  [ERROR_CODES.VALIDATION_ERROR]: '입력 정보를 확인해주세요.',
  [ERROR_CODES.NOT_FOUND]: '요청한 정보를 찾을 수 없습니다.',
  [ERROR_CODES.DUPLICATE_ERROR]: '이미 존재하는 정보입니다.',
  [ERROR_CODES.STORAGE_ERROR]: '데이터 저장에 실패했습니다.',
  [ERROR_CODES.STORAGE_QUOTA_EXCEEDED]: '저장 공간이 부족합니다.',
  [ERROR_CODES.UNKNOWN_ERROR]: '알 수 없는 오류가 발생했습니다.',
  [ERROR_CODES.INTERNAL_ERROR]: '서버 오류가 발생했습니다.'
} as const

/**
 * 에러를 AppError 형태로 변환
 */
export function createAppError(error: unknown): AppError {
  if (error instanceof CustomError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp: error.timestamp
    }
  }

  if (error instanceof Error) {
    return {
      code: ERROR_CODES.UNKNOWN_ERROR,
      message: error.message,
      details: error.stack,
      timestamp: new Date()
    }
  }

  return {
    code: ERROR_CODES.UNKNOWN_ERROR,
    message: '알 수 없는 오류가 발생했습니다.',
    details: error,
    timestamp: new Date()
  }
}

/**
 * 사용자 친화적인 에러 메시지 생성
 */
export function getUserFriendlyMessage(error: AppError): string {
  return ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES] || error.message
}

/**
 * 에러 로깅
 */
export function logError(error: AppError, context?: string) {
  const logData = {
    code: error.code,
    message: error.message,
    details: error.details,
    timestamp: error.timestamp,
    context,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
    url: typeof window !== 'undefined' ? window.location.href : 'SSR'
  }

  // 개발 환경에서는 콘솔에 출력
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', logData)
  }

  // 프로덕션에서는 외부 로깅 서비스로 전송
  // 예: Sentry, LogRocket 등
}

/**
 * 안전한 함수 실행 래퍼
 */
export async function safeExecute<T>(
  fn: () => Promise<T>,
  context?: string
): Promise<{ data?: T; error?: AppError }> {
  try {
    const data = await fn()
    return { data }
  } catch (error) {
    const appError = createAppError(error)
    logError(appError, context)
    return { error: appError }
  }
}

/**
 * 스토리지 에러 처리
 */
export function handleStorageError(error: unknown, operation: string): AppError {
  if (error instanceof DOMException) {
    switch (error.name) {
      case 'QuotaExceededError':
        return createAppError(new CustomError(
          ERROR_CODES.STORAGE_QUOTA_EXCEEDED,
          '저장 공간이 부족합니다.',
          { operation }
        ))
      case 'SecurityError':
        return createAppError(new CustomError(
          ERROR_CODES.STORAGE_ERROR,
          '보안 정책으로 인해 저장할 수 없습니다.',
          { operation }
        ))
      default:
        return createAppError(new CustomError(
          ERROR_CODES.STORAGE_ERROR,
          `데이터 ${operation}에 실패했습니다.`,
          { operation, originalError: error }
        ))
    }
  }

  return createAppError(new CustomError(
    ERROR_CODES.STORAGE_ERROR,
    `데이터 ${operation}에 실패했습니다.`,
    { operation, originalError: error }
  ))
}
