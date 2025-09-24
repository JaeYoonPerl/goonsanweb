import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import "./globals.css"
import AuthProvider from "@/components/auth-provider"
import { PerformanceMonitor } from "@/components/common"

export const metadata: Metadata = {
  title: "군산중고등학교 총동창회",
  description: "군산중고등학교 총동창회 공식 웹사이트 - 동문들의 소통과 정보 공유 공간",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="font-sans min-h-screen bg-background">
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <PerformanceMonitor />
        </AuthProvider>
      </body>
    </html>
  )
}
