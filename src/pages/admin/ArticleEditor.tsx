import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Button,
  Card,
  Input,
  Toggle,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Tag
} from '@kzqkzq/tactile-ui'
import MDEditor from '@uiw/react-md-editor'
import { toast } from 'sonner'
import {
  ArrowLeftIcon,
  SaveIcon,
  SettingsIcon,
  UploadIcon,
  FileTextIcon,
  GlobeIcon
} from 'lucide-react'

import { supabase } from '@/lib/supabase'
import { parseArticleContent, ArticleContentPayload, ArticleMeta } from '@/utils/articleContent'
import { cn } from '@/lib/utils'

import '@/styles/markdown.css'
import './Admin.css'

export default function ArticleEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Article State
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Tech')
  const [tags, setTags] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [published, setPublished] = useState(false)

  // Meta / SEO Config
  const [meta, setMeta] = useState<ArticleMeta>({
    displayPosition: 'blog',
    sticky: false
  })

  const [showSettings, setShowSettings] = useState(true)

  const isNew = id === 'new'

  useEffect(() => {
    if (!isNew && id) {
      fetchArticle(id)
    } else {
      setLoading(false)
    }
  }, [id, isNew])

  const fetchArticle = async (articleId: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single()

      if (error) throw error

      setTitle(data.title)
      setSlug(data.slug)
      setDescription(data.description || '')
      setCategory(data.category || 'Tech')
      setTags(data.tags ? data.tags.join(', ') : '')
      setCoverImage(data.cover_image || '')
      setPublished(data.published)

      const payload = parseArticleContent(data.content)
      if (payload) {
        setContent(payload.markdown || '')
        setMeta(payload.meta || {})
      } else {
        setContent(data.content || '')
      }

    } catch (error) {
      console.error('Error fetching article:', error)
      toast.error('无法加载文章')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!title || !slug) {
      toast.error('标题和 Slug 不能为空')
      return
    }

    setSaving(true)
    try {
      const payload: ArticleContentPayload = {
        markdown: content,
        meta: meta
      }
      const serializedContent = JSON.stringify(payload)

      const articleData = {
        title,
        slug,
        description,
        content: serializedContent,
        category,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        cover_image: coverImage,
        published,
        updated_at: new Date().toISOString()
      }

      if (isNew) {
        const { error } = await supabase.from('articles').insert([articleData])
        if (error) throw error
        toast.success('文章已创建')
        navigate('/admin/dashboard')
      } else {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', id)
        if (error) throw error
        toast.success('文章已保存')
      }
    } catch (error) {
      console.error('Error saving article:', error)
      toast.error('保存失败')
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `covers/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('blog-assets')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('blog-assets')
        .getPublicUrl(filePath)

      setCoverImage(data.publicUrl)
      toast.success('封面上传成功')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('上传失败')
    }
  }

  const handleEditorPaste = async (event: any) => {
    // Placeholder for paste handling
  }

  if (loading) {
    return <div className="p-8 text-center text-muted">Loading editor...</div>
  }

  return (
    <div className="admin-page article-editor-page">
      <header className="editor-header glass-card">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => navigate('/admin/dashboard')}>
            <ArrowLeftIcon size={18} />
          </Button>
          <h1 className="text-lg font-display font-semibold">
            {isNew ? '新建文章' : '编辑文章'}
          </h1>
          <span className={cn("status-indicator", published ? "bg-green-500" : "bg-amber-400")} />
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
            <SettingsIcon size={16} className="mr-2" />
            设置
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving}
            className="min-w-[100px]"
          >
            {saving ? '保存中...' : (
              <>
                <SaveIcon size={16} className="mr-2" />
                保存
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="editor-layout">
        <motion.div
          className="editor-main"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="editor-title-section mb-6">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入文章标题..."
              className="text-3xl font-display font-bold border-none bg-transparent shadow-none px-0 h-auto focus:ring-0 placeholder:text-muted/40"
            />
          </div>

          <div data-color-mode="light" className="md-editor-wrapper">
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || '')}
              height={650}
              visibleDragbar={false}
              preview="live"
              onPaste={handleEditorPaste}
              className="w-md-editor"
              textareaProps={{
                placeholder: '开始撰写精彩内容...'
              }}
            />
          </div>
        </motion.div>

        {showSettings && (
          <motion.aside
            className="editor-sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
          >
            <div className="sidebar-content stack">
              <div className="sidebar-section">
                <h3 className="sidebar-title"><GlobeIcon size={14} /> 基本信息</h3>
                <div className="stack gap-3">
                  <div className="form-group">
                    <label>URL Slug</label>
                    <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="article-slug" />
                  </div>
                  <div className="form-group">
                    <label>分类</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tech">Tech</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Life">Life</SelectItem>
                        <SelectItem value="Project">Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="form-group">
                    <label>标签 (逗号分隔)</label>
                    <Input value={tags} onChange={e => setTags(e.target.value)} placeholder="React, UI, Web" />
                  </div>
                </div>
              </div>

              <div className="sidebar-section">
                <h3 className="sidebar-title"><FileTextIcon size={14} /> 摘要 & 封面</h3>
                <div className="stack gap-3">
                  {/* Fallback to textarea since tactile-ui Textarea might duplicate Input or not exist clearly */}
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="简短的描述..."
                  />

                  <div className="cover-upload">
                    <div className="cover-preview" style={{ backgroundImage: `url(${coverImage})`, height: 120, borderRadius: 6, backgroundColor: '#f0f0f0', backgroundSize: 'cover' }}>
                      {!coverImage && <span className="text-xs text-muted">无封面</span>}
                    </div>
                    <div className="mt-2 text-right">
                      <label className="btn btn-sm btn-outline cursor-pointer inline-flex items-center gap-2 text-xs py-1 px-3 rounded border hover:bg-gray-50">
                        <UploadIcon size={12} /> 上传封面
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                      </label>
                      {coverImage && (
                        <button onClick={() => setCoverImage('')} className="text-xs text-red-500 ml-2 hover:underline">移除</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="sidebar-section">
                <h3 className="sidebar-title"><SettingsIcon size={14} /> 发布设置</h3>
                <div className="stack gap-3">
                  <div className="flex items-center justify-between">
                    <label>发布状态</label>
                    <Toggle pressed={published} onPressedChange={setPublished} className="data-[state=on]:bg-green-500/10 data-[state=on]:text-green-600">
                      {published ? '已发布' : '草稿'}
                    </Toggle>
                  </div>
                  <div className="flex items-center justify-between">
                    <label>置顶显示</label>
                    <Toggle pressed={meta.sticky || false} onPressedChange={v => setMeta({ ...meta, sticky: v })}>
                      {meta.sticky ? 'Top' : 'Off'}
                    </Toggle>
                  </div>
                  <div className="form-group mt-2">
                    <label>显示位置</label>
                    <Select
                      value={meta.displayPosition || 'blog'}
                      onValueChange={(v) => setMeta({ ...meta, displayPosition: v as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog">博客列表</SelectItem>
                        <SelectItem value="home">首页推荐</SelectItem>
                        <SelectItem value="none">仅链接</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </div>
    </div>
  )
}
