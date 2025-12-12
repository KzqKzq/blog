import { Link } from 'react-router-dom'
import { Card, Tag } from '@kzqkzq/tactile-ui'
import { posts } from '../data/content'
import './Blog.css'

const sortedPosts = [...posts].sort((a, b) => (a.date > b.date ? -1 : 1))

export default function Blog() {
  return (
    <div className="blog-page">
      <header className="page-header">
        <div className="page-eyebrow">Writing</div>
        <h1 className="page-title">技术写作与模式实验</h1>
        <p className="page-desc">
          记录 React 模式、TypeScript 工程实践与新拟物设计的落地过程。
        </p>
      </header>

      <div className="blog-list">
        {sortedPosts.map((post) => (
          <Link key={post.id} to={`/blog/${post.slug}`}>
            <Card className="soft-card blog-card">
              <div className="blog-meta">
                <span className="badge">{post.date}</span>
                <span className="badge">{post.readingTime}</span>
                <span className={`badge badge--${post.accent || 'brand'}`}>{post.category}</span>
              </div>
              <h3 className="blog-title">{post.title}</h3>
              <p className="blog-desc muted">{post.description}</p>
              <div className="blog-tags">
                {post.tags.map((tag) => (
                  <Tag key={tag} variant="primary" className={`tag-${post.accent || 'brand'}`}>
                    {tag}
                  </Tag>
                ))}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
