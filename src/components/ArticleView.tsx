// import { motion, useScroll, useTransform } from 'framer-motion' 
// Framer motion unused in this new layout
import MDEditor from '@uiw/react-md-editor'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, ArrowLeft } from 'lucide-react'
import { cn, getTagColor } from '@/lib/utils'
import { TableOfContents } from './TableOfContents'
import { extractHeadings } from '@/utils/markdownUtils'
import '@/styles/markdown.css'

interface ArticleViewProps {
    article: {
        title: string
        created_at: string
        tags?: string[]
        excerpt?: string
        cover_image?: string | null
    }
    content: string
    coverImage?: string 
    onBack?: () => void
    previewMode?: boolean
}

export function ArticleView({ article, content, coverImage, onBack, previewMode = false }: ArticleViewProps) {
    const activeCover = coverImage || article.cover_image

    const headings = extractHeadings(content)

    return (
        <div className="min-h-screen pb-20 bg-background font-sans">
             <div className="container mx-auto max-w-5xl pt-10 px-6">
                 {onBack && (
                    <Button variant="ghost" size="sm" className="mb-6 text-muted-foreground hover:text-foreground pl-0" onClick={onBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> 返回列表
                    </Button>
                )}
                 
                 {/* Title Section placed separate from image */}
                 <div className="space-y-6 mb-8 text-center md:text-left">
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {article.tags && article.tags.map(tag => (
                            <Badge 
                                key={tag} 
                                variant="secondary" 
                                className={cn("px-3 py-1 text-sm border-none shadow-sm", getTagColor(tag))}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
                        {article.title}
                    </h1>
                    
                    {article.excerpt && (
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto md:mx-0 leading-relaxed font-light">
                            {article.excerpt}
                        </p>
                    )}

                     <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground border-b pb-8">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {article.created_at ? new Date(article.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                        <span>·</span>
                        <span>{Math.ceil(content.length / 400)} 分钟阅读</span>
                    </div>
                </div>

                {/* Independent Cover Image */}
                {activeCover && (
                    <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-sm mb-12 bg-muted">
                        <img 
                            src={activeCover} 
                            alt={article.title} 
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                    </div>
                )}
            </div>

            <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12 px-4 md:px-6">
                <article className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                     <div data-color-mode="light">
                        <MDEditor.Markdown
                          source={content}
                          style={{ background: 'transparent', color: 'inherit', fontSize: '1.125rem', lineHeight: '1.8' }}
                        />
                     </div>
                </article>

                <aside className="hidden lg:block relative">
                    <div className="sticky top-24">
                        <TableOfContents headings={headings} />
                    </div>
                </aside>
            </div>
        </div>
    )
}
