import { Link, useNavigate } from 'react-router-dom'
import { Button, Card, Tag } from '@kzqkzq/tactile-ui'
import { essays, posts, projects } from '../data/content'
import type { Article } from '../types/content'
import './Home.css'

const navShortcuts = [
  {
    path: '/blog',
    title: '博客',
    description: '技术文章与模式拆解',
    icon: '📓',
    accent: 'brand',
  },
  {
    path: '/projects',
    title: '作品集',
    description: '开源作品与实验室',
    icon: '🚀',
    accent: 'brand',
  },
  {
    path: '/essays',
    title: '随笔',
    description: '随笔与生活感悟',
    icon: '🧊',
    accent: 'cool',
  },
  {
    path: '/about',
    title: '关于我',
    description: '个人档案与履历',
    icon: '👋',
    accent: 'neutral',
  },
]

const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/kzqkzq', icon: '🐙' },
  { name: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
  { name: 'Email', url: 'mailto:hello@example.com', icon: '✉️' },
]

const featuredPosts: Article[] = posts.slice(0, 2)
const featuredEssays: Article[] = essays.slice(0, 1)
const heroProject = projects[0]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home">
      <section className="hero-grid">
        <Card className="soft-card glass-card hero-card">
          <div className="pill">New Neumorphism · 精致触感</div>
          <h1 className="hero-title">在数字空间里，雕刻可触摸的体验</h1>
          <p className="hero-desc">
            我是 KZQ，一名偏爱 TypeScript、Skeuomorphic 设计的前端工程师。
            专注构建具有温度感的界面与稳定的工程体系。
          </p>

          <div className="hero-actions">
            <div className="hero-social">
              {socialLinks.map((link) => (
                <Button
                  key={link.name}
                  type="button"
                  variant="secondary"
                  size="sm"
                  iconOnly
                  aria-label={link.name}
                  onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
                >
                  {link.icon}
                </Button>
              ))}
            </div>
            <Button type="button" variant="primary" size="md" onClick={() => navigate('/about')}>
              关于我
            </Button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">{posts.length + essays.length}</span>
              <span className="stat-label">篇写作</span>
            </div>
            <div className="stat">
              <span className="stat-value">{projects.length}</span>
              <span className="stat-label">个项目</span>
            </div>
            <div className="stat">
              <span className="stat-value">2024</span>
              <span className="stat-label">年度复盘</span>
            </div>
          </div>
        </Card>

        <Card className="soft-card board-card">
          <div className="board-head">
            <div>
              <div className="pill">Workspace</div>
              <h3>今日灵感板</h3>
              <p className="muted">把想法留存在柔软的界面里。</p>
            </div>
            <Button type="button" size="sm" variant="ghost" onClick={() => navigate('/blog')}>
              浏览博客
            </Button>
          </div>
          <div className="board-items">
            <div className="board-item">
              <span className="board-dot board-dot--brand" />
              <div>
                <div className="board-title">新拟物设计词典</div>
                <p className="muted">收录光影、玻璃化、噪声的 token 组合</p>
              </div>
            </div>
            <div className="board-item">
              <span className="board-dot board-dot--amber" />
              <div>
                <div className="board-title">Type Safety 清单</div>
                <p className="muted">严格模式 + tsc --noEmit + ESLint 静态护栏</p>
              </div>
            </div>
            <div className="board-item">
              <span className="board-dot board-dot--cool" />
              <div>
                <div className="board-title">组件库雕刻</div>
                <p className="muted">Tactile UI：让按钮、卡片具备“触感”</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="nav-section">
        <div className="section-heading">
          <div>
            <div className="pill">导航</div>
            <h2 className="section-title">通往不同空间的入口</h2>
          </div>
        </div>
        <div className="grid two nav-grid">
          {navShortcuts.map((card) => (
            <Link key={card.path} to={card.path}>
              <Card className={`soft-card nav-card nav-card--${card.accent}`}>
                <div className="nav-icon">{card.icon}</div>
                <div className="nav-text">
                  <h3>{card.title}</h3>
                  <p className="muted">{card.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-articles">
        <div className="section-heading">
          <div>
            <div className="pill">Writing</div>
            <h2 className="section-title">最新写作</h2>
            <p className="muted">精选技术文章，兼顾架构思考与视觉细节。</p>
          </div>
          <Button type="button" variant="primary" size="sm" onClick={() => navigate('/blog')}>
            全部文章
          </Button>
        </div>

        <div className="grid two">
          {featuredPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`}>
              <Card className="soft-card article-teaser">
                <div className="article-meta">
                  <span className="article-date mono">{post.date}</span>
                  <span className="article-reading mono">{post.readingTime}</span>
                </div>
                <h3 className="article-title">{post.title}</h3>
                <p className="muted">{post.description}</p>
                <div className="article-tags">
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
      </section>

      <section className="home-essays">
        <div className="section-heading">
          <div>
            <div className="pill">Essays</div>
            <h2 className="section-title">松弛与思考</h2>
            <p className="muted">记录生活留白，兼顾理性与感性。</p>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={() => navigate('/essays')}>
            所有随笔
          </Button>
        </div>

        <div className="grid two">
          {featuredEssays.map((essay) => (
            <Link key={essay.id} to={`/essays/${essay.slug}`}>
              <Card className="soft-card essay-teaser">
                <div className="essay-meta">
                  <span className="badge">{essay.date}</span>
                  <span className="badge">{essay.readingTime}</span>
                </div>
                <h3>{essay.title}</h3>
                <p className="muted">{essay.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-project">
        <Card className="soft-card glass-card project-hero">
          <div className="project-hero-text">
            <div className="pill">Project</div>
            <h2 className="section-title">{heroProject.name}</h2>
            <p className="muted">{heroProject.summary}</p>
            <div className="project-chips">
              {heroProject.tech.map((tech) => (
                <Tag key={tech} variant="solid">
                  {tech}
                </Tag>
              ))}
            </div>
            <div className="project-links">
              <Button
                type="button"
                variant="primary"
                onClick={() => window.open(heroProject.link, '_blank', 'noopener,noreferrer')}
              >
                Source
              </Button>
              {heroProject.demo && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => window.open(heroProject.demo, '_blank', 'noopener,noreferrer')}
                >
                  Demo
                </Button>
              )}
              <Button type="button" variant="ghost" onClick={() => navigate('/projects')}>
                查看所有项目
              </Button>
            </div>
          </div>
          <div className="project-hero-meta soft-card">
            <div className="board-item">
              <span className="board-dot board-dot--brand" />
              <div>
                <div className="board-title">Highlights</div>
                <ul>
                  {heroProject.highlights?.map((item) => (
                    <li key={item} className="muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="board-item">
              <span className="board-dot board-dot--cool" />
              <div>
                <div className="board-title">GitHub Stars</div>
                <p className="muted">{heroProject.stars}+ stars</p>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
