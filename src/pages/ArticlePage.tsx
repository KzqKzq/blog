import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Button, Card, Tag } from '@kzqkzq/tactile-ui'
import { findArticleBySlug } from '../data/content'
import { extractHeadings } from '../utils/markdownUtils'
import { TableOfContents } from '../components/TableOfContents'
import './ArticlePage.css'

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const article = slug ? findArticleBySlug(slug) : undefined
  const headings = article ? extractHeadings(article.body) : []

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
        <div className="page-eyebrow">{article.category}</div>
        <h1 className="page-title">{article.title}</h1>
        <p className="page-desc">{article.description}</p>
        <div className="article-meta">
          <span className="badge">{article.date}</span>
          <span className="badge">{article.readingTime}</span>
          {article.tags.map((tag) => (
            <Tag key={tag} variant="primary" className={`tag-${article.accent || 'brand'}`}>
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
            <ReactMarkdown
              className="prose article-body"
              components={{
                h2: ({ node: _node, children, ...props }) => {
                   const id = children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '')
                   return <h2 id={id} {...props}>{children}</h2>
                },
                h3: ({ node: _node, children, ...props }) => {
                   const id = children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '')
                   return <h3 id={id} {...props}>{children}</h3>
                }
              }}
            >
              {article.body}
            </ReactMarkdown>
          </Card>
        </motion.div>

        <aside>
           <TableOfContents headings={headings} />
        </aside>
      </div>
    </div>
  )
}
