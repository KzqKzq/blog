import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Tag } from '@kzqkzq/tactile-ui'
import { supabase, Article } from '../lib/supabase'
import { parseArticleContent } from '../utils/articleContent'
import './Blog.css'

const TECH_CATEGORIES = ['技术博客', '室宝鴬人', 'æŠ€æœ¯åšå®?']

export default function Blog() {
  const [posts, setPosts] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      const filtered = (data || []).filter((post) => TECH_CATEGORIES.includes(post.category))
      // 置顶文章排在前面
      const withSticky = filtered.map((post) => {
        const parsed = parseArticleContent(post.content)
        return { post, sticky: parsed?.meta?.sticky || false }
      })
      withSticky.sort((a, b) => Number(b.sticky) - Number(a.sticky))
      setPosts(withSticky.map((item) => item.post))
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    const time = Math.ceil(words / wordsPerMinute)
    return `${time} 分钟阅读`
  }

  if (loading) {
    return (
      <div className="blog-page">
        <header className="page-header">
          <div className="page-eyebrow">Writing</div>
          <h1 className="page-title">技术写作与模式实验</h1>
        </header>
        <div className="blog-list">
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-muted)' }}>加载中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-page">
      <header className="page-header">
        <div className="page-eyebrow">Writing</div>
        <h1 className="page-title">技术写作与模式实验</h1>
        <p className="page-desc">
          记录 React 模式、TypeScript 工程实践与新拟态设计的落地过程。
        </p>
      </header>

      <div className="blog-list">
        {posts.map((post) => (
          <Link key={post.id} to={`/blog/${post.slug}`}>
            <Card className="soft-card blog-card">
              <div className="blog-meta">
                <span className="badge">{new Date(post.created_at).toLocaleDateString()}</span>
                <span className="badge">{post.content ? calculateReadingTime(post.content) : '1 分钟'}</span>
                <span className="badge badge--brand">{post.category}</span>
              </div>
              <h3 className="blog-title">{post.title}</h3>
              <p className="blog-desc muted">{post.description}</p>
              <div className="blog-tags">
                {post.tags && post.tags.map((tag) => (
                  <Tag key={tag} variant="primary" className="tag-brand">
                    {tag}
                  </Tag>
                ))}
              </div>
            </Card>
          </Link>
        ))}
        {posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-muted)' }}>
            暂无文章
          </div>
        )}
      </div>
    </div>
  )
}
