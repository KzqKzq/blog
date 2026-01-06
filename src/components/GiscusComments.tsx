import { useEffect, useRef } from 'react'

interface GiscusCommentsProps {
    slug: string
}

export function GiscusComments({ slug }: GiscusCommentsProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return

        // Clear existing giscus if any
        containerRef.current.innerHTML = ''

        const script = document.createElement('script')
        script.src = 'https://giscus.app/client.js'
        script.setAttribute('data-repo', 'KzqKzq/blog') // TODO: Replace with your repo
        script.setAttribute('data-repo-id', 'R_kgDOQnZX6w') // TODO: Get from giscus.app
        script.setAttribute('data-category', 'Announcements') // TODO: Replace with your category
        script.setAttribute('data-category-id', 'DIC_kwDOQnZX684C0o5m') // TODO: Get from giscus.app
        script.setAttribute('data-mapping', 'pathname')
        script.setAttribute('data-strict', '0')
        script.setAttribute('data-reactions-enabled', '1')
        script.setAttribute('data-emit-metadata', '0')
        script.setAttribute('data-input-position', 'top')
        script.setAttribute('data-theme', 'preferred_color_scheme')
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

    return (
        <div className="mt-16 pt-8 border-t border-border">
            <h3 className="text-xl font-semibold mb-6">评论</h3>
            <div ref={containerRef} className="giscus-container" />
        </div>
    )
}
