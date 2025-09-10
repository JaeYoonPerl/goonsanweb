/**
 * 동문 커뮤니티 게시판 컴포넌트
 * - 홈페이지에 표시될 커뮤니티 게시글 목록을 렌더링
 * - 최신 순 정렬 및 최대 4개 표시
 * - 전체 커뮤니티 보기 버튼 포함
 */
import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { PostItem } from "./post-item"
import { Post } from "@/lib/data"

interface CommunityBoardProps {
  posts: Post[]
}

export const CommunityBoard = memo(function CommunityBoard({ posts }: CommunityBoardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-3xl">
          <MessageSquare className="h-8 w-8 text-primary" />
          동문 커뮤니티
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <div className="space-y-4 flex-1">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
        <Button variant="outline" size="lg" className="w-full mt-6 bg-transparent text-2xl py-4" asChild>
          <a href="/community">전체 커뮤니티 보기</a>
        </Button>
      </CardContent>
    </Card>
  )
})
