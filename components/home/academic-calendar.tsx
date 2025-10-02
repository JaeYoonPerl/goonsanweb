import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"

export function AcademicCalendar() {
  const renderCalendarDates = () => {
    return Array.from({ length: 35 }, (_, i) => {
      const date = i - 6 // Starting from Nov 25 (Sunday)
      const isCurrentMonth = date >= 1 && date <= 31
      const isToday = date === 3 // December 3rd as today
      const hasEvent = [15, 25].includes(date) // Events on 15th and 25th

      return (
        <div
          key={i}
          className={`
            p-2 text-center text-base min-h-[60px] border border-border/50 relative
            ${!isCurrentMonth ? "text-muted-foreground/50" : "text-foreground"}
            ${isToday ? "bg-primary text-primary-foreground font-semibold" : ""}
            ${hasEvent ? "bg-accent" : ""}
          `}
        >
          <div className="font-medium">{isCurrentMonth ? date : date <= 0 ? 30 + date : date - 31}</div>
          
          {/* 테스트 경고 표시 - 모든 날짜에 표시 */}
          {isCurrentMonth && (
            <div className="absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center">
              <div className="bg-red-500 text-black text-xs font-bold px-1 py-0.5 rounded rotate-12 transform scale-75 opacity-80">
                테스트
              </div>
            </div>
          )}
          
          {hasEvent && isCurrentMonth && (
            <div className="text-sm mt-1 relative z-10">
              {date === 15 && (
                <div className="bg-destructive text-destructive-foreground px-2 rounded text-xs">
                  총회
                </div>
              )}
              {date === 25 && (
                <div className="bg-secondary text-secondary-foreground px-2 rounded text-xs">
                  송년회
                </div>
              )}
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Calendar className="h-6 w-6 text-primary" />
          학사일정
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="lg">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h3 className="text-xl font-semibold">2024년 12월</h3>
            <Button variant="ghost" size="lg">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Days of week header */}
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <div key={day} className="p-3 text-center text-base font-medium text-muted-foreground">
                {day}
              </div>
            ))}

            {/* Calendar dates */}
            {renderCalendarDates()}
          </div>

          {/* Upcoming Events */}
          <div className="mt-6">
            <h4 className="font-medium mb-4 text-lg">이번 달 주요 일정</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-accent/50 rounded">
                <Badge variant="destructive" className="text-sm">
                  12.15
                </Badge>
                <span className="text-base">2024년 정기 총회 (오후 2시, 모교 강당)</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-accent/50 rounded">
                <Badge variant="secondary" className="text-sm">
                  12.25
                </Badge>
                <span className="text-base">송년회 (군산 롯데호텔 2층 연회장)</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
