/**
 * 커뮤니티 게시글 개별 아이템 컴포넌트
 * - 게시글의 제목, 내용, 작성자, 기수, 날짜, 조회수, 좋아요 수를 표시
 * - 카테고리별 색상 구분된 배지 표시
 * - 클릭 시 상세 페이지로 이동
 */
import { memo } from "react"
import { Heart, Eye, Pin, Star, Bookmark } from "lucide-react"
import Link from "next/link"
import { stripHtml } from "@/lib/utils"
import { Post } from "@/lib/data"

interface PostItemProps {
  post: Post
}

export const PostItem = memo(function PostItem({ post }: PostItemProps) {
  return (
    <div className="border-b border-border pb-4 last:border-b-0 last:pb-0">
      <Link href={`/community/${post.id}`}>
        <h4 className="text-2xl font-medium text-foreground mb-2 hover:text-primary cursor-pointer flex items-center gap-2">
          {post.title}
          {post.isPinned && (
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
              <Star className="h-4 w-4 text-primary fill-primary" />
              <span className="text-xs font-medium text-primary">고정</span>
            </div>
          )}
        </h4>
      </Link>
      <p className="text-xl text-muted-foreground mb-3">
        {stripHtml(post.content)}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-lg text-muted-foreground">{post.author} ({post.grade})</span>
        <div className="flex items-center gap-3 text-lg text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-5 w-5" />
            <span>{post.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-5 w-5" />
            <span>{post.likes}</span>
          </div>
          <span>{post.date}</span>
        </div>
      </div>
    </div>
  )
})
