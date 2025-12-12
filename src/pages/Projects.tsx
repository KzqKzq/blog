import { Card, Tag, Button } from '@kzqkzq/tactile-ui'
import { projects } from '../data/content'
import './Projects.css'

export default function Projects() {
  return (
    <div className="projects-page">
      <header className="page-header">
        <div className="page-eyebrow">Projects</div>
        <h1 className="page-title">作品与实验室</h1>
        <p className="page-desc">精选开源项目与个人实验，兼顾触感设计与工程可靠性。</p>
      </header>

      <div className="projects-grid">
        {projects.map((project) => (
          <Card key={project.id} className={`soft-card project-card project-card--${project.accent || 'brand'}`}>
            <div className="project-head">
              <div>
                <h3 className="project-name">{project.name}</h3>
                <p className="muted">{project.summary}</p>
              </div>
              {project.stars && <div className="project-stars">⭐ {project.stars}</div>}
            </div>

            <div className="project-tags">
              {project.tech.map((tech) => (
                <Tag key={tech} variant="solid">
                  {tech}
                </Tag>
              ))}
            </div>

            {project.highlights && (
              <ul className="project-highlights">
                {project.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}

            <div className="project-actions">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => window.open(project.link, '_blank', 'noopener,noreferrer')}
              >
                Source
              </Button>
              {project.demo && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(project.demo!, '_blank', 'noopener,noreferrer')}
                >
                  Demo
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
