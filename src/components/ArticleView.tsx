// import { motion, useScroll, useTransform } from 'framer-motion'
// Framer motion unused in this new layout
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MDEditor from '@uiw/react-md-editor'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Calendar, ArrowLeft, List, ArrowRight, ChevronLeft, ChevronRight, Lightbulb, Clock, FileText } from 'lucide-react'
import { cn, getTagColor } from '@/lib/utils'
import { TableOfContents } from './TableOfContents'
import { extractHeadings } from '@/utils/markdownUtils'
import { GiscusComments } from './GiscusComments'
import { ReadingProgress } from './ReadingProgress'
import { Breadcrumb } from './Breadcrumb'
import { ReadingSettings } from './ReadingSettings'
import { ShareButton } from './ShareButton'
import '@/styles/markdown.css'

interface Post {
    id?: string
    slug: string
    title: string
    excerpt?: string
    tags?: string[]
}

interface ArticleViewProps {
    article: {
        title: string
        slug?: string
        created_at: string
        tags?: string[]
        excerpt?: string
        cover_image?: string | null
    }
    content: string
    coverImage?: string
    onBack?: () => void
    previewMode?: boolean
    prevArticle?: { slug: string; title: string } | null
    nextArticle?: { slug: string; title: string } | null
    relatedArticles?: Post[]
}

export function ArticleView({ article, content, coverImage, onBack, previewMode = false, prevArticle, nextArticle, relatedArticles }: ArticleViewProps) {
    const activeCover = coverImage || article.cover_image

    const headings = extractHeadings(content)
    const [tocOpen, setTocOpen] = useState(false)
    const navigate = useNavigate()

    // Calculate reading stats
    const wordCount = content.trim().replace(/[#*`\[\]()]/g, '').replace(/\s+/g, ' ').length
    const readingMinutes = Math.ceil(wordCount / 400) // Chinese: ~400 characters per minute

    return (
        <div className="min-h-screen pb-20 bg-background font-sans">
             <ReadingProgress />
             <div className="container mx-auto max-w-5xl pt-10 px-6">
                 <Breadcrumb />
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
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {readingMinutes} 分钟阅读
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {wordCount.toLocaleString()} 字
                        </span>
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
                <div>
                    {/* Mobile TOC Button */}
                    {headings.length > 0 && (
                        <div className="lg:hidden mb-6 flex gap-2">
                            <Sheet open={tocOpen} onOpenChange={setTocOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" className="flex-1">
                                        <List className="mr-2 h-4 w-4" />
                                        查看目录 ({headings.length})
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-80">
                                    <SheetHeader>
                                        <SheetTitle>文章目录</SheetTitle>
                                    </SheetHeader>
                                    <div className="mt-4">
                                        <TableOfContents headings={headings} />
                                    </div>
                                </SheetContent>
                            </Sheet>
                            {!previewMode && (
                                <>
                                    <ReadingSettings />
                                    <ShareButton title={article.title} />
                                </>
                            )}
                        </div>
                    )}

                    {/* Desktop Reading Settings */}
                    {!previewMode && headings.length === 0 && (
                        <div className="lg:hidden mb-6 flex gap-2">
                            <ReadingSettings />
                            <ShareButton title={article.title} />
                        </div>
                    )}

                    <article className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                         <div data-color-mode="light">
                            <MDEditor.Markdown
                              source={content}
                              style={{ background: 'transparent', color: 'inherit' }}
                            />
                         </div>
                    </article>

                    {/* GitHub Comments */}
                    {!previewMode && article.slug && (
                        <GiscusComments slug={article.slug} />
                    )}

                    {/* Related Articles */}
                    {!previewMode && relatedArticles && relatedArticles.length > 0 && (
                        <div className="mt-12 pt-8 border-t">
                            <div className="flex items-center gap-2 mb-6">
                                <Lightbulb className="h-5 w-5 text-primary" />
                                <h2 className="text-2xl font-bold">相关推荐</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {relatedArticles.map((relatedPost) => (
                                    <Card
                                        key={relatedPost.id || relatedPost.slug}
                                        className="p-4 cursor-pointer hover:shadow-lg transition-shadow group"
                                        onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                                    >
                                        <div className="space-y-3">
                                            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                                                {relatedPost.title}
                                            </h3>
                                            {relatedPost.excerpt && (
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {relatedPost.excerpt}
                                                </p>
                                            )}
                                            {relatedPost.tags && relatedPost.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {relatedPost.tags.slice(0, 2).map((tag) => (
                                                        <Badge
                                                            key={tag}
                                                            variant="secondary"
                                                            className={cn("text-xs", getTagColor(tag))}
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Previous/Next Navigation */}
                    {!previewMode && (prevArticle || nextArticle) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 pt-8 border-t">
                            {prevArticle ? (
                                <Card
                                    className="p-4 cursor-pointer hover:shadow-lg transition-shadow group"
                                    onClick={() => navigate(`/blog/${prevArticle.slug}`)}
                                >
                                    <div className="flex items-start gap-3">
                                        <ChevronLeft className="h-5 w-5 text-muted-foreground mt-0.5 group-hover:text-primary transition-colors" />
                                        <div className="flex-1">
                                            <div className="text-xs text-muted-foreground mb-1">上一篇</div>
                                            <div className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                                                {prevArticle.title}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ) : (
                                <div />
                            )}

                            {nextArticle && (
                                <Card
                                    className="p-4 cursor-pointer hover:shadow-lg transition-shadow group"
                                    onClick={() => navigate(`/blog/${nextArticle.slug}`)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1 text-right">
                                            <div className="text-xs text-muted-foreground mb-1">下一篇</div>
                                            <div className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                                                {nextArticle.title}
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-muted-foreground mt-0.5 group-hover:text-primary transition-colors" />
                                    </div>
                                </Card>
                            )}
                        </div>
                    )}
                </div>

                <aside className="hidden lg:block relative">
                    <div className="sticky top-24 space-y-4">
                        {!previewMode && (
                            <div className="flex gap-2">
                                <ReadingSettings />
                                <ShareButton title={article.title} />
                            </div>
                        )}
                        {headings.length > 0 && <TableOfContents headings={headings} />}
                    </div>
                </aside>
            </div>
        </div>
    )
}
