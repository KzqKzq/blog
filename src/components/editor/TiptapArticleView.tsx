import { EditorContent, useEditor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import { Link } from "@tiptap/extension-link"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableCell } from "@tiptap/extension-table-cell"
import { TableHeader } from "@tiptap/extension-table-header"
import { Markdown } from 'tiptap-markdown'
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock } from 'lucide-react'
import { cn, getTagColor } from '@/lib/utils'
import { useEffect, useMemo } from 'react'

// Import Tiptap node styles
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"
import "@/components/tiptap-node/table-node/table-node.scss"
import "@/components/tiptap-templates/simple/simple-editor.scss"
import { AICritique } from '@/components/AICritique'
import { MindMapNode } from '@/lib/ai'

interface TiptapArticleViewProps {
    title: string
    excerpt?: string
    coverImage?: string
    tags?: string[]
    createdAt?: string
    editorJson: Record<string, unknown>
    aiCritique?: { summary: string, mindmap: MindMapNode } | null
}

export function TiptapArticleView({
    title,
    excerpt,
    coverImage,
    tags = [],
    createdAt,
    editorJson,
    aiCritique
}: TiptapArticleViewProps) {
    // Preview editor (read-only)
    const editor = useEditor({
        immediatelyRender: false,
        editable: false,
        editorProps: {
            attributes: {
                class: "simple-editor focus:outline-none",
            },
        },
        extensions: [
            StarterKit.configure({ horizontalRule: false }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline hover:text-blue-800 dark:text-blue-400',
                },
            }),
            Table.configure({
                resizable: false,
                HTMLAttributes: {
                    class: 'border-collapse table-auto w-full',
                },
            }),
            TableRow,
            TableHeader.configure({
                HTMLAttributes: {
                    class: 'border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-bold',
                },
            }),
            TableCell.configure({
                HTMLAttributes: {
                    class: 'border border-gray-300 dark:border-gray-600 px-4 py-2',
                },
            }),
            HorizontalRule,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            Image,
            Typography,
            Superscript,
            Subscript,
            Markdown.configure({
                html: false,
                transformPastedText: true,
                transformCopiedText: true,
                breaks: true,
            }),
        ],
        content: editorJson,
    })

    // Update content when editorJson changes
    useEffect(() => {
        if (editor && editorJson) {
            editor.commands.setContent(editorJson)
        }
    }, [editorJson, editor])

    // Calculate reading time
    const readingTime = useMemo(() => {
        if (!editor) return 1
        const text = editor.state.doc.textContent
        return Math.max(1, Math.ceil(text.length / 400))
    }, [editor?.state.doc])

    if (!editor) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">加载预览中...</p>
            </div>
        )
    }

    return (
        <div className="min-h-full pb-20 bg-background font-sans">
            <div className="container mx-auto max-w-5xl pt-10 px-6">
                {/* Title Section */}
                <div className="space-y-6 mb-8 text-center md:text-left">
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            {tags.map(tag => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className={cn("px-3 py-1 text-sm border-none shadow-sm", getTagColor(tag))}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
                        {title || '无标题'}
                    </h1>

                    {excerpt && (
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto md:mx-0 leading-relaxed font-light">
                            {excerpt}
                        </p>
                    )}

                    <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground border-b pb-8">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {createdAt ? new Date(createdAt).toLocaleDateString('zh-CN') : new Date().toLocaleDateString('zh-CN')}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {readingTime} 分钟阅读
                        </span>
                    </div>
                </div>

                {/* Cover Image */}
                {coverImage && (
                    <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-sm mb-12 bg-muted">
                        <img
                            src={coverImage}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                    </div>
                )}
            </div>

            <div className="container mx-auto max-w-4xl px-4 md:px-6">
                {aiCritique && (
                    <AICritique data={aiCritique} />
                )}

                {/* Article Content */}
                <article className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                    <EditorContent editor={editor} />
                </article>
            </div>
        </div>
    )
}
