"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Heart, Image } from "lucide-react"
import Link from "next/link"
import { stripHtml, hasImage } from "@/lib/utils"

interface PostListItemProps {
  id: number
  title: string
  content: string
  author: string
  date: string
  views: number
  likes: number
  category?: string
  grade?: string
  type?: string
  isImportant?: boolean
  href: string
}

export function PostListItem({
  id,
  title,
  content,
  author,
  date,
  views,
  likes,
  category,
  grade,
  type,
  isImportant,
  href,
}: PostListItemProps) {
  const displayContent = stripHtml(content)
  const hasImageContent = hasImage(content)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-xl leading-tight flex-1">
            <Link href={href} className="hover:text-primary transition-colors">
              <div className="flex items-center gap-2">
                {hasImageContent && (
                  <Image className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <span className="line-clamp-2">{title}</span>
              </div>
            </Link>
          </CardTitle>
          <div className="flex gap-2 flex-shrink-0">
            {isImportant && (
              <Badge variant="destructive" className="text-sm">
                중요
              </Badge>
            )}
            {(category || type) && (
              <Badge variant="secondary" className="text-sm">
                {category || type}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-base text-muted-foreground mb-4 line-clamp-2">
          {displayContent}
        </p>
        <div className="flex items-center justify-between text-lg text-muted-foreground">
          <div className="flex items-center gap-6">
            <span>
              작성자: {author}
              {grade && ` (${grade})`}
            </span>
            <span>작성일: {date}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <span>{views}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              <span>{likes || 0}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
