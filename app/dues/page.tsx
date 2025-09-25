"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Banknote, Smartphone, Calendar, User, AlertCircle, CheckCircle, Info, X } from "lucide-react"
import Link from "next/link"
import { useState, useCallback, useMemo, memo } from "react"
import { useAuth } from "@/hooks"
import Header from "@/components/home/header"
import { Footer } from "@/components/home/footer"
import { BackgroundDecorations } from "@/components/common/background-decorations"

function DuesPaymentPage() {
  // 지역 선택 (재경/군산)
  const [selectedRegion, setSelectedRegion] = useState("재경")
  
  // 회비 금액 선택
  const [selectedAmount, setSelectedAmount] = useState("50000")
  
  // 결제 방식 선택 (일회성/정기결제)
  const [paymentType, setPaymentType] = useState("일회성")
  
  // 현재 결제 상태 (모바일 앱에서 보여진 것처럼)
  const [currentPayment, setCurrentPayment] = useState({
    region: "재경",
    amount: "100000",
    type: "매월 정기결제",
    isActive: true
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  // 회비 금액 옵션 - 메모이제이션
  const amountOptions = useMemo(() => [
    { value: "50000", label: "5만원" },
    { value: "100000", label: "10만원" },
    { value: "150000", label: "15만원" },
    { value: "200000", label: "20만원" },
    { value: "300000", label: "30만원" },
  ], [])

  // 지역 옵션 - 메모이제이션
  const regionOptions = useMemo(() => [
    { value: "재경", label: "재경" },
    { value: "군산", label: "군산" },
  ], [])

  // 결제 방식 옵션 - 메모이제이션
  const paymentTypeOptions = useMemo(() => [
    { value: "일회성", label: "일회성 결제" },
    { value: "정기결제", label: "매월 정기결제" },
  ], [])

  const handleSubmit = useCallback(async () => {
    if (!selectedRegion || !selectedAmount || !paymentType) {
      alert("모든 필수 항목을 선택해주세요.")
      return
    }

    setIsLoading(true)
    
    // 임시 로딩 (실제로는 결제 API 호출)
    setTimeout(() => {
      alert(`${amountOptions.find(opt => opt.value === selectedAmount)?.label} 결제가 완료되었습니다.`)
      setIsLoading(false)
    }, 2000)
  }, [selectedRegion, selectedAmount, paymentType, amountOptions])

  const handleCancelPayment = useCallback(() => {
    if (confirm("정말로 결제를 해제하시겠습니까?")) {
      setCurrentPayment(prev => ({ ...prev, isActive: false }))
      alert("결제가 해제되었습니다.")
    }
  }, [])

  const selectedAmountInfo = useMemo(() => 
    amountOptions.find(opt => opt.value === selectedAmount),
    [amountOptions, selectedAmount]
  )

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 메인 배경 - 더 화려한 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 animate-gradient-shift"></div>
      
      {/* 추가 배경 레이어들 - 더 화려하게 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-100/60 via-transparent to-pink-100/60"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-emerald-100/40 via-transparent to-blue-100/40"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-violet-100/30 via-transparent to-teal-100/30"></div>
      
      {/* 미묘한 패턴 오버레이 */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url(\"data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M50 0L60 40L100 50L60 60L50 100L40 60L0 50L40 40Z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")`
      }}></div>
      
      <BackgroundDecorations />
      <div className="relative z-10">
        {/* Header */}
        <Header />

        <main className="container mx-auto px-6 py-12 max-w-6xl">
        {/* 상단 여백 */}
        <div className="h-16"></div>
        
        {/* 페이지 제목 */}
        <Card className="mb-8">
          <CardContent className="p-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">회비 납부</h1>
            <p className="text-xl text-muted-foreground">군산고등학교 동문회 회비 납부</p>
            <p className="text-base text-muted-foreground mt-2">지역과 금액을 선택해주세요.</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 현재 결제 상태 및 정보 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 현재 결제 상태 (활성 결제가 있을 때만 표시) */}
            {currentPayment.isActive && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Calendar className="h-5 w-5" />
                    현재 결제 중
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-blue-800 mb-4">
                    {currentPayment.region} 지역 · {amountOptions.find(opt => opt.value === currentPayment.amount)?.label} · {currentPayment.type}
                  </div>
                  <Button 
                    onClick={handleCancelPayment}
                    variant="destructive" 
                    size="sm"
                    className="w-full"
                  >
                    결제 해제하기
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* 결제 정보 요약 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">결제 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">지역</span>
                  <span className="font-semibold">{selectedRegion}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">금액</span>
                  <span className="font-semibold text-primary">{selectedAmountInfo?.label}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">결제 방식</span>
                  <span className="font-semibold">{paymentType === "일회성" ? "일회성 결제" : "매월 정기결제"}</span>
                </div>
              </CardContent>
            </Card>

            {/* 회원 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  회원 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">이름</span>
                  <span className="font-medium">{user?.name || "홍길동"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">기수</span>
                  <span className="font-medium">{user?.grade || "99기"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">회원상태</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    정회원
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 오른쪽: 선택 옵션들 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">회비 납부 옵션 선택</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* 지역 선택 */}
                <div className="space-y-4">
                  <Label className="text-xl font-semibold">지역 선택</Label>
                  <div className="grid grid-cols-2 gap-4 max-w-md">
                    {regionOptions.map((region) => (
                      <Button
                        key={region.value}
                        variant={selectedRegion === region.value ? "default" : "outline"}
                        size="lg"
                        className={`py-4 text-lg ${
                          selectedRegion === region.value 
                            ? "bg-primary hover:bg-primary/90" 
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedRegion(region.value)}
                      >
                        {region.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* 회비 금액 선택 */}
                <div className="space-y-4">
                  <Label className="text-xl font-semibold">회비 금액</Label>
                  <div className="grid grid-cols-3 gap-4 max-w-lg">
                    {amountOptions.map((amount) => (
                      <Button
                        key={amount.value}
                        variant={selectedAmount === amount.value ? "default" : "outline"}
                        size="lg"
                        className={`py-6 text-lg font-medium ${
                          selectedAmount === amount.value 
                            ? "bg-primary hover:bg-primary/90" 
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedAmount(amount.value)}
                      >
                        {amount.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* 결제 방식 선택 */}
                <div className="space-y-4">
                  <Label className="text-xl font-semibold">결제 방식</Label>
                  <div className="grid grid-cols-2 gap-4 max-w-md">
                    {paymentTypeOptions.map((type) => (
                      <Button
                        key={type.value}
                        variant={paymentType === type.value ? "default" : "outline"}
                        size="lg"
                        className={`py-4 text-lg ${
                          paymentType === type.value 
                            ? "bg-primary hover:bg-primary/90" 
                            : "hover:bg-muted"
                        }`}
                        onClick={() => setPaymentType(type.value)}
                      >
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* 결제 버튼 */}
                <div className="pt-4">
                  <Button 
                    onClick={handleSubmit}
                    disabled={isLoading}
                    size="lg"
                    className="w-full py-6 text-xl font-semibold"
                  >
                    {isLoading ? "결제 처리 중..." : `${selectedAmountInfo?.label} 결제하기`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* 하단 여백 */}
        <div className="h-16"></div>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default memo(DuesPaymentPage)
