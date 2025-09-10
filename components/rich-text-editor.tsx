"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Link, 
  Image, 
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo
} from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isImageUploading, setIsImageUploading] = useState(false)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    updateContent()
  }

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB 제한
      alert('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    setIsImageUploading(true)
    
    // 실제 환경에서는 서버에 업로드하지만, 여기서는 Data URL로 처리
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = document.createElement('img')
      img.src = e.target?.result as string
      img.style.maxWidth = '100%'
      img.style.height = 'auto'
      img.style.margin = '10px 0'
      
      // 현재 커서 위치에 이미지 삽입
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.insertNode(img)
        range.setStartAfter(img)
        range.setEndAfter(img)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        // 커서가 없으면 에디터 끝에 추가
        editorRef.current?.appendChild(img)
      }
      
      updateContent()
      setIsImageUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const insertLink = () => {
    const url = prompt('링크 URL을 입력하세요:')
    if (url) {
      execCommand('createLink', url)
    }
  }

  const formatText = (command: string) => {
    execCommand(command)
  }

  const insertList = (ordered: boolean = false) => {
    execCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList')
  }

  const insertQuote = () => {
    execCommand('formatBlock', 'blockquote')
  }

  const setAlignment = (align: string) => {
    execCommand('justify' + align)
  }

  const setFontSize = (size: string) => {
    execCommand('fontSize', '7') // 기본값
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const span = document.createElement('span')
      span.style.fontSize = size
      try {
        range.surroundContents(span)
      } catch (e) {
        // 선택된 내용이 span으로 감쌀 수 없는 경우
        const contents = range.extractContents()
        span.appendChild(contents)
        range.insertNode(span)
      }
      updateContent()
    }
  }

  const undo = () => {
    execCommand('undo')
  }

  const redo = () => {
    execCommand('redo')
  }

  return (
    <div className={`border border-border rounded-lg ${className}`}>
      {/* 툴바 */}
      <div className="border-b border-border p-2 flex flex-wrap gap-1 bg-muted/50">
        {/* 실행 취소/다시 실행 */}
        <div className="flex gap-1 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={undo}
            className="h-8 w-8 p-0"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={redo}
            className="h-8 w-8 p-0"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {/* 텍스트 스타일 */}
        <div className="flex gap-1 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatText('bold')}
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatText('italic')}
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => formatText('underline')}
            className="h-8 w-8 p-0"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        {/* 폰트 크기 */}
        <div className="flex gap-1 mr-2">
          <select
            onChange={(e) => setFontSize(e.target.value)}
            className="h-8 px-2 text-sm border border-border rounded bg-background"
            defaultValue="16px"
          >
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
            <option value="28px">28px</option>
            <option value="32px">32px</option>
          </select>
        </div>

        {/* 정렬 */}
        <div className="flex gap-1 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setAlignment('Left')}
            className="h-8 w-8 p-0"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setAlignment('Center')}
            className="h-8 w-8 p-0"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setAlignment('Right')}
            className="h-8 w-8 p-0"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        {/* 목록 */}
        <div className="flex gap-1 mr-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertList(false)}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertList(true)}
            className="h-8 w-8 p-0"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        {/* 인용구 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertQuote}
          className="h-8 w-8 p-0 mr-2"
        >
          <Quote className="h-4 w-4" />
        </Button>

        {/* 링크 */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertLink}
          className="h-8 w-8 p-0 mr-2"
        >
          <Link className="h-4 w-4" />
        </Button>

        {/* 이미지 업로드 */}
        <div className="relative group">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={isImageUploading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-3 group-hover:cursor-pointer"
            disabled={isImageUploading}
          >
            <Image className="h-4 w-4 mr-1" />
            이미지
          </Button>
        </div>
      </div>

      {/* 에디터 영역 */}
      <div
        ref={editorRef}
        contentEditable
        onInput={updateContent}
        onBlur={updateContent}
        className="min-h-[300px] p-4 focus:outline-none prose prose-sm max-w-none"
        style={{
          fontSize: '16px',
          lineHeight: '1.6'
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      {/* 이미지 업로드 중 표시 */}
      {isImageUploading && (
        <div className="p-2 text-center text-sm text-muted-foreground bg-muted/50">
          이미지 업로드 중...
        </div>
      )}
    </div>
  )
}
