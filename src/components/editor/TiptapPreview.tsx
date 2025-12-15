import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { Markdown } from 'tiptap-markdown'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

interface TiptapPreviewProps {
    content: string
    className?: string
}

export function TiptapPreview({ content, className }: TiptapPreviewProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: true,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer',
                },
            }),
            Image.configure({
                inline: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Markdown.configure({
                html: false,
                transformPastedText: true,
            }),
        ],
        content,
        editable: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none',
            },
        },
    })

    // Update content when it changes
    useEffect(() => {
        if (editor && content !== editor.storage.markdown?.getMarkdown()) {
            editor.commands.setContent(content)
        }
    }, [content, editor])

    if (!editor) {
        return null
    }

    return (
        <div className={cn("min-h-[200px]", className)}>
            <EditorContent editor={editor} />
        </div>
    )
}
