import { useEffect, useState } from 'react'
import type { TocItem } from '../utils/markdownUtils'
import './TableOfContents.css'

interface TableOfContentsProps {
  headings: TocItem[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  // Scroll spy effect
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
    <nav className="toc" aria-label="Table of contents">
      <div className="toc-title">目录</div>
      <ul className="toc-list">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`toc-item toc-item--h${heading.level}`}
          >
            <a
              href={`#${heading.id}`}
              className={`toc-link ${activeId === heading.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                const element = document.getElementById(heading.id)
                if (element) {
                   // Offset for fixed header
                   const headerOffset = 100
                   const elementPosition = element.getBoundingClientRect().top
                   const offsetPosition = elementPosition + window.pageYOffset - headerOffset
  
                   window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                   })
                   setActiveId(heading.id)
                }
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
      
      <div className="toc-footer">
        <button 
          className="toc-back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑ 返回顶部
        </button>
      </div>
    </nav>
  )
}
