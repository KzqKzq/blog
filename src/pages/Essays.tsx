import { Link } from 'react-router-dom'
import { Card } from '@kzqkzq/tactile-ui'
import { essays } from '../data/content'
import './Essays.css'

export default function Essays() {
  const sortedEssays = [...essays].sort((a, b) => (a.date > b.date ? -1 : 1))

  return (
    <div className="essays-page">
      <header className="page-header">
        <div className="page-eyebrow">Essays</div>
        <h1 className="page-title">松弛与思考</h1>
        <p className="page-desc">一些关于节奏、阅读与个人习惯的随笔。</p>
      </header>

      <div className="essays-list">
        {sortedEssays.map((essay) => (
          <Link key={essay.id} to={`/essays/${essay.slug}`}>
            <Card className="soft-card essay-card">
              <div className="essay-meta mono">
                <span className="badge">{essay.date}</span>
                <span className="badge">{essay.readingTime}</span>
              </div>
              <h3 className="essay-title">{essay.title}</h3>
              <p className="muted">{essay.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
