/**
 * 유틸리티 함수 모음
 * - CSS 클래스 병합, HTML 처리, 날짜 포맷팅
 * - 로컬 스토리지 데이터 관리
 * - 이미지 URL 추출 및 HTML 태그 제거
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// HTML 유틸리티 함수들
export function stripHtml(html: string): string {
  if (!html) return ''
  
  const text = html.replace(/<[^>]*>/g, '')
  const decoded = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
  
  return decoded.trim()
}

export function extractFirstImageSrc(html: string): string | null {
  if (!html) return null
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i)
  return imgMatch ? imgMatch[1] : null
}

export function hasImage(html: string): boolean {
  return /<img[^>]*>/i.test(html)
}

// 날짜 유틸리티 함수
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// 로컬 스토리지 유틸리티 함수들
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Failed to save to localStorage: ${key}`, error)
  }
}
