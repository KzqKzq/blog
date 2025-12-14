import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import MDEditor from '@uiw/react-md-editor'
import { Button, Card, Tag } from '@kzqkzq/tactile-ui'

import { supabase, Article } from '../lib/supabase'
import { extractHeadings } from '../utils/markdownUtils'
import { fetchDailyImage } from '../utils/bingImageUtils'
import { TableOfContents } from '../components/TableOfContents'
import { parseArticleContent, fallbackMarkdownPayload } from '../utils/articleContent'

// Use the same markdown styles for consistency
import '@/styles/markdown.css'
import './ArticlePage.css'

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [contentMarkdown, setContentMarkdown] = useState('')

  useEffect(() => {
    if (slug) {
      fetchArticle(slug)
    }
  }, [slug])

  const fetchArticle = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      setArticle(data)

      // Parse content
      const payload = parseArticleContent(data.content)
      setContentMarkdown(payload?.markdown || data.content || '')

      // Cover Image Logic
      if (data.cover_image) {
        setCoverImage(data.cover_image)
        setImageLoaded(true)
      } else {
        fetchDailyImage().then((url) => {
          if (url) {
            setCoverImage(url)
            setImageLoaded(true)
          }
        })
      }

    } catch (error) {
      console.error('Error fetching article:', error)
      setArticle(null)
    } finally {
      setLoading(false)
    }
  }

  const headings = extractHeadings(contentMarkdown)

  if (loading) {
    return <div className="article-page container" style={{ paddingTop: '4rem', textAlign: 'center' }}>Loading...</div>
  }

  if (!article) {
    return (
      <div className="article-page container">
        <Card className="soft-card article-shell">
          <h2>内容未找到</h2>
          <p className="muted">可能尚未发布或链接已失效。</p>
          <Button type="button" variant="primary" onClick={() => navigate('/')}>
            返回首页
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="article-page container">
      <motion.header
        className="page-header"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <div className="article-cover-wrapper">
          {!imageLoaded && (
            <div className="article-cover article-cover--skeleton" />
          )}
          {coverImage && (
            <motion.img
              src={coverImage}
              alt="Cover"
              className="article-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              onLoad={() => setImageLoaded(true)}
            />
          )}
        </div>
        <div className="page-eyebrow">{article.category}</div>
        <h1 className="page-title">{article.title}</h1>
        <p className="page-desc">{article.description}</p>
        <div className="article-meta">
          <span className="badge">{new Date(article.created_at).toLocaleDateString()}</span>
          {article.tags && article.tags.map((tag) => (
            <Tag key={tag} variant="primary" className="tag-brand">
              {tag}
            </Tag>
          ))}
        </div>
      </motion.header>

      <div className="article-layout">
        <motion.div
          className="article-main"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut', delay: 0.05 }}
        >
          <Card className="soft-card glass-card article-shell">
            <div className="article-body">
              <div data-color-mode="light">
                <MDEditor.Markdown
                  source={contentMarkdown}
                  style={{ whiteSpace: 'pre-wrap' }}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        <aside>
          <TableOfContents headings={headings} />
          {/* Add more widgets here if needed */}
        </aside>
      </div>
    </div>
  )
}
