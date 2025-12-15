import { useEffect, useState } from 'react'
import type { TocItem } from '../utils/markdownUtils'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-react'

interface TableOfContentsProps {
  headings: TocItem[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66% 0px' }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className="p-4 bg-card rounded-lg border shadow-sm max-h-[calc(100vh-120px)] overflow-y-auto" aria-label="Table of contents">
      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 pb-3 border-b">
        目录
      </div>
      <ul className="space-y-1 m-0 list-none">
        {headings.map((heading) => (
          <li key={heading.id} style={{ marginLeft: (heading.level - 2) * 12 }}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "block text-sm py-1 px-2 rounded-md transition-all duration-200 no-underline",
                activeId === heading.id 
                  ? "bg-secondary text-primary font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              onClick={(e) => {
                e.preventDefault()
                const element = document.getElementById(heading.id)
                if (element) {
                  const headerOffset = 100
                  const elementPosition = element.getBoundingClientRect().top
                  const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
                  setActiveId(heading.id)
                }
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-4 pt-3 border-t">
        <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start text-xs text-muted-foreground hover:text-primary"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp className="mr-2 h-3 w-3" /> 返回顶部
        </Button>
      </div>
    </nav>
  )
}
