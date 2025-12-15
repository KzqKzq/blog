import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, useBlocker } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '../../lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from '@/components/ui/resizable'
import { 
    Save, 
    ArrowLeft, 
    Loader2, 
    X,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    Maximize2,
    Minimize2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getTagColor } from '@/lib/utils'
import { TiptapArticleView } from '@/components/editor/TiptapArticleView'

// --- Tiptap Official Simple Editor Components ---
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"
import { Markdown } from 'tiptap-markdown'

// --- Tiptap UI Primitives ---
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node Extensions ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI Components ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
} from "@/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

// --- Tiptap Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Tiptap Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

export default function ArticleEditor() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isDirty, setIsDirty] = useState(false)
    const isDirtyRef = useRef(false)
    const [settingsOpen, setSettingsOpen] = useState(true)
    
    // Panel visibility states
    const [showEditor, setShowEditor] = useState(true)
    const [showPreview, setShowPreview] = useState(true)

    // Form states
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [coverImage, setCoverImage] = useState('')
    const [published, setPublished] = useState(false)
    const [currentTag, setCurrentTag] = useState('')
    
    const [meta] = useState<Record<string, unknown>>({})
    const [previewContent, setPreviewContent] = useState<Record<string, unknown>>({})
    const [initialContent, setInitialContent] = useState<string>('')

    const isNew = id === undefined || id === 'new'

    // Editor instance
    const editor = useEditor({
        immediatelyRender: false,
        editorProps: {
            attributes: {
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
                class: "simple-editor min-h-[500px] px-6 py-4 focus:outline-none",
            },
        },
        extensions: [
            StarterKit.configure({
                horizontalRule: false,
                link: {
                    openOnClick: false,
                    enableClickSelection: true,
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
            Selection,
            ImageUploadNode.configure({
                accept: "image/*",
                maxSize: MAX_FILE_SIZE,
                limit: 3,
                upload: handleImageUpload,
                onError: (error) => console.error("上传失败:", error),
            }),
            Markdown.configure({
                html: false,
                transformPastedText: true,
                transformCopiedText: true,
            }),
        ],
        content: '',
        onUpdate: ({ editor }) => {
            if (!loading) setIsDirty(true)
            setPreviewContent(editor.getJSON())
        },
    })

    useEffect(() => {
        isDirtyRef.current = isDirty
    }, [isDirty])

    useEffect(() => {
        if (!isNew && id) {
            fetchArticle(id)
        } else {
            setLoading(false)
            setSlug(`post-${Date.now()}`)
        }
    }, [id, isNew])

    // Set content when editor is ready and we have initial content
    useEffect(() => {
        if (editor && initialContent && !loading) {
            editor.commands.setContent(initialContent)
            setPreviewContent(editor.getJSON())
            setInitialContent('') // Clear to prevent re-setting
        }
    }, [editor, initialContent, loading])

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault()
                e.returnValue = ''
            }
        }
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [isDirty])

    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            isDirty && currentLocation.pathname !== nextLocation.pathname
    );

    const fetchArticle = async (articleId: string) => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', articleId)
                .single()

            if (error) throw error

            setTitle(data.title)
            setSlug(data.slug)
            setDescription(data.excerpt || data.description || '')
            setTags(data.tags || [])
            setCoverImage(data.cover_image || '')
            setPublished(data.status === 'published' || data.published)
            
            const content = data.markdown || data.content || ''
            setInitialContent(content)
            
            setIsDirty(false)
        } catch (error) {
            console.error('Error fetching article:', error)
            toast.error('加载文章失败')
            navigate('/admin/posts')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!title.trim()) {
            toast.error('请输入标题')
            return
        }
        if (!slug.trim()) {
            toast.error('请输入链接别名')
            return
        }

        setSaving(true)
        try {
            const markdown = editor?.storage.markdown?.getMarkdown() || ''
            
            const articleData = {
                title,
                slug,
                excerpt: description,
                content: markdown,
                tags,
                cover_image: coverImage,
                status: published ? 'published' : 'draft',
                seo_description: description,
                updated_at: new Date().toISOString(),
            }

            let error

            if (isNew) {
                const { error: insertError } = await supabase
                    .from('posts')
                    .insert([articleData])
                error = insertError
            } else {
                const { error: updateError } = await supabase
                    .from('posts')
                    .update(articleData)
                    .eq('id', id)
                error = updateError
            }

            if (error) throw error

            toast.success('保存成功')
            setIsDirty(false)
            
            if (isNew) {
                setTimeout(() => navigate('/admin/posts'), 0)
            }
        } catch (error: unknown) {
            console.error('Error saving article:', error)
            toast.error((error as Error).message || '保存失败')
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (setter: (val: unknown) => void, val: unknown) => {
        setter(val)
        if (!loading) setIsDirty(true)
    }

    const handleAddTag = () => {
        if (currentTag && !tags.includes(currentTag)) {
            handleChange(setTags, [...tags, currentTag])
            setCurrentTag('')
        }
    }

    const removeTag = (tagToRemove: string) => {
        handleChange(setTags, tags.filter(tag => tag !== tagToRemove))
    }

    const toggleEditorOnly = () => {
        setShowEditor(true)
        setShowPreview(false)
    }

    const togglePreviewOnly = () => {
        setShowEditor(false)
        setShowPreview(true)
    }

    const toggleBoth = () => {
        setShowEditor(true)
        setShowPreview(true)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-background">
            {/* Header */}
            <div className="border-b px-4 py-3 flex items-center justify-between bg-white dark:bg-zinc-950 z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/admin/posts')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-lg font-semibold">
                        {isNew ? '新建文章' : '编辑文章'}
                    </h1>
                    {isDirty && <Badge variant="destructive" className="animate-pulse">未保存</Badge>}
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 mr-4 border-r pr-4">
                        <Label htmlFor="published-switch" className="text-sm text-muted-foreground">
                            {published ? '已发布' : '草稿'}
                        </Label>
                        <Switch 
                            id="published-switch"
                            checked={published}
                            onCheckedChange={(checked) => handleChange(setPublished, checked)}
                        />
                    </div>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        保存
                    </Button>
                </div>
            </div>

            {/* Settings Section */}
            <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen} className="border-b shrink-0">
                <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-muted/50 transition-colors">
                        <span className="text-sm font-medium text-muted-foreground">文章设置</span>
                        {settingsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">标题</Label>
                            <Input 
                                value={title} 
                                onChange={(e) => handleChange(setTitle, e.target.value)} 
                                placeholder="文章标题"
                            />
                        </div>
                        
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">链接别名</Label>
                            <Input 
                                value={slug} 
                                onChange={(e) => handleChange(setSlug, e.target.value)} 
                                placeholder="url-friendly-slug"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">封面图片</Label>
                            <Input 
                                value={coverImage} 
                                onChange={(e) => handleChange(setCoverImage, e.target.value)} 
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">标签</Label>
                            <div className="flex gap-2">
                                <Input 
                                    value={currentTag}
                                    onChange={(e) => setCurrentTag(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                    placeholder="添加标签..."
                                    className="flex-1"
                                />
                                <Button onClick={handleAddTag} size="sm" variant="secondary">添加</Button>
                            </div>
                        </div>

                        <div className="space-y-1 md:col-span-2 lg:col-span-3">
                            <Label className="text-xs text-muted-foreground">摘要描述</Label>
                            <Textarea 
                                value={description} 
                                onChange={(e) => handleChange(setDescription, e.target.value)} 
                                placeholder="SEO 描述和卡片预览..."
                                className="h-20 resize-none"
                            />
                        </div>

                        <div className="space-y-1 flex items-end">
                            <div className="flex flex-wrap gap-1">
                                {tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className={cn("gap-1 text-xs", getTagColor(tag))}>
                                        {tag}
                                        <X 
                                            className="h-3 w-3 cursor-pointer hover:text-destructive" 
                                            onClick={() => removeTag(tag)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>

            {/* Resizable Split View */}
            <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
                {/* Editor Panel */}
                {showEditor && (
                    <ResizablePanel defaultSize={50} minSize={20}>
                        <div className="h-full flex flex-col bg-muted/10">
                            <div className="p-2 border-b bg-muted/20 flex justify-between items-center text-xs text-muted-foreground uppercase tracking-wider font-medium shrink-0">
                                <span className="pl-2">编辑器</span>
                                <div className="flex gap-1">
                                    {showPreview && (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6" 
                                            onClick={toggleEditorOnly}
                                            title="仅显示编辑器"
                                        >
                                            <Maximize2 className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                                <EditorContext.Provider value={{ editor }}>
                                    <Toolbar className="shrink-0 border-b">
                                        <Spacer />
                                        <ToolbarGroup>
                                            <UndoRedoButton action="undo" />
                                            <UndoRedoButton action="redo" />
                                        </ToolbarGroup>
                                        <ToolbarSeparator />
                                        <ToolbarGroup>
                                            <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
                                            <ListDropdownMenu types={["bulletList", "orderedList", "taskList"]} />
                                            <BlockquoteButton />
                                            <CodeBlockButton />
                                        </ToolbarGroup>
                                        <ToolbarSeparator />
                                        <ToolbarGroup>
                                            <MarkButton type="bold" />
                                            <MarkButton type="italic" />
                                            <MarkButton type="strike" />
                                            <MarkButton type="code" />
                                            <MarkButton type="underline" />
                                            <ColorHighlightPopover />
                                            <LinkPopover />
                                        </ToolbarGroup>
                                        <ToolbarSeparator />
                                        <ToolbarGroup>
                                            <MarkButton type="superscript" />
                                            <MarkButton type="subscript" />
                                        </ToolbarGroup>
                                        <ToolbarSeparator />
                                        <ToolbarGroup>
                                            <TextAlignButton align="left" />
                                            <TextAlignButton align="center" />
                                            <TextAlignButton align="right" />
                                            <TextAlignButton align="justify" />
                                        </ToolbarGroup>
                                        <ToolbarSeparator />
                                        <ToolbarGroup>
                                            <ImageUploadButton text="添加" />
                                        </ToolbarGroup>
                                        <Spacer />
                                    </Toolbar>
                                    <ScrollArea className="flex-1">
                                        <EditorContent
                                            editor={editor}
                                            role="presentation"
                                            className="simple-editor-content"
                                        />
                                    </ScrollArea>
                                </EditorContext.Provider>
                            </div>
                        </div>
                    </ResizablePanel>
                )}

                {/* Resize Handle with Toggle Buttons */}
                {showEditor && showPreview && (
                    <ResizableHandle className="relative group">
                        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-border" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1 bg-background border rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6" 
                                onClick={toggleEditorOnly}
                                title="仅显示编辑器"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6" 
                                onClick={togglePreviewOnly}
                                title="仅显示预览"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </ResizableHandle>
                )}

                {/* Preview Panel */}
                {showPreview && (
                    <ResizablePanel defaultSize={50} minSize={20}>
                        <div className="h-full flex flex-col bg-white dark:bg-zinc-950">
                            <div className="p-2 border-b bg-muted/20 flex justify-between items-center text-xs text-muted-foreground uppercase tracking-wider font-medium shrink-0">
                                <span className="pl-2">预览</span>
                                <div className="flex gap-1">
                                    {showEditor && (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6" 
                                            onClick={togglePreviewOnly}
                                            title="仅显示预览"
                                        >
                                            <Maximize2 className="h-3 w-3" />
                                        </Button>
                                    )}
                                    {(!showEditor || !showPreview) && (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6" 
                                            onClick={toggleBoth}
                                            title="显示两栏"
                                        >
                                            <Minimize2 className="h-3 w-3" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <ScrollArea className="flex-1 h-full">
                                <TiptapArticleView
                                    title={title}
                                    excerpt={description}
                                    coverImage={coverImage}
                                    tags={tags}
                                    createdAt={new Date().toISOString()}
                                    editorJson={previewContent}
                                />
                            </ScrollArea>
                        </div>
                    </ResizablePanel>
                )}
            </ResizablePanelGroup>

            {/* Navigation Guard Dialog */}
            <AlertDialog open={blocker.state === "blocked"}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>未保存的更改</AlertDialogTitle>
                        <AlertDialogDescription>
                            您有未保存的更改，确定要离开吗？更改将会丢失。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => blocker.reset()}>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={() => blocker.proceed()}>确认离开</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
