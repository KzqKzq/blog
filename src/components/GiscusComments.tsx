import { useEffect, useRef, useCallback } from 'react'

interface GiscusCommentsProps {
    slug: string
}

function getGiscusTheme(): string {
    // Check if dark class is on document element (Tailwind dark mode)
    if (document.documentElement.classList.contains('dark')) {
        return 'dark'
    }
    return 'light'
}

export function GiscusComments({ slug }: GiscusCommentsProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    const updateGiscusTheme = useCallback((theme: string) => {
        const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
        if (iframe) {
            iframe.contentWindow?.postMessage(
                { giscus: { setConfig: { theme } } },
                'https://giscus.app'
            )
        }
    }, [])

    useEffect(() => {
        if (!containerRef.current) return

        // Clear existing giscus if any
        containerRef.current.innerHTML = ''

        const theme = getGiscusTheme()

        const script = document.createElement('script')
        script.src = 'https://giscus.app/client.js'
        script.setAttribute('data-repo', 'KzqKzq/blog')
        script.setAttribute('data-repo-id', 'R_kgDOQnZX6w')
        script.setAttribute('data-category', 'Announcements')
        script.setAttribute('data-category-id', 'DIC_kwDOQnZX684C0o5m')
        script.setAttribute('data-mapping', 'pathname')
        script.setAttribute('data-strict', '0')
        script.setAttribute('data-reactions-enabled', '1')
        script.setAttribute('data-emit-metadata', '0')
        script.setAttribute('data-input-position', 'top')
        script.setAttribute('data-theme', theme)
        script.setAttribute('data-lang', 'zh-CN')
        script.setAttribute('data-loading', 'lazy')
        script.crossOrigin = 'anonymous'
        script.async = true

        containerRef.current.appendChild(script)

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = ''
            }
        }
    }, [slug])

    // Listen for theme changes
    useEffect(() => {
        // Watch for class changes on document element (Tailwind dark mode toggle)
        const observer = new MutationObserver(() => {
            const theme = getGiscusTheme()
            updateGiscusTheme(theme)
        })

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        })

        // Also listen for system preference changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = () => {
            const theme = getGiscusTheme()
            updateGiscusTheme(theme)
        }
        mediaQuery.addEventListener('change', handleChange)

        return () => {
            observer.disconnect()
            mediaQuery.removeEventListener('change', handleChange)
        }
    }, [updateGiscusTheme])

    return (
        <div className="mt-16 pt-8 border-t border-border">
            <h3 className="text-xl font-semibold mb-6">评论</h3>
            <div ref={containerRef} className="giscus-container" />
        </div>
    )
}
