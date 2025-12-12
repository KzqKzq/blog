import { Card, Tag, Button, Progress } from '@kzqkzq/tactile-ui'
import './About.css'

const skills = [
  { name: 'React / UI 工程', level: 90 },
  { name: 'TypeScript', level: 88 },
  { name: 'Design Systems', level: 85 },
  { name: 'Node.js / Python', level: 78 },
]

const experiences = [
  {
    period: '2023 - 现在',
    title: '前端工程师 · 数字体验',
    detail: '负责组件库与设计系统，落地新拟物风格的交互与主题。',
  },
  {
    period: '2021 - 2023',
    title: '全栈开发 · 创业团队',
    detail: '从零搭建产品原型、后端 API 与前端界面，保持快速迭代。',
  },
]

const contacts = [
  { label: 'GitHub', value: '@kzqkzq', href: 'https://github.com/kzqkzq' },
  { label: 'Email', value: 'hello@example.com', href: 'mailto:hello@example.com' },
  { label: 'Twitter', value: '@kzq_dev', href: 'https://twitter.com' },
]

export default function About() {
  return (
    <div className="about-page">
      <header className="page-header">
        <div className="page-eyebrow">About</div>
        <h1 className="page-title">关于 KZQ</h1>
        <p className="page-desc">
          热爱把技术与设计揉到一起，偏爱触感、柔和光影的界面，同时坚持严谨的类型与工程质量。
        </p>
      </header>

      <div className="about-grid">
        <Card className="soft-card glass-card about-profile">
          <div className="about-avatar">👋</div>
          <h3>前端 / 全栈开发者</h3>
          <p className="muted">
            关注 TypeScript、React 生态和设计系统，擅长把抽象的系统语言转化为可触摸的 UI。
          </p>
          <div className="about-tags">
            <Tag variant="solid">New Neumorphism</Tag>
            <Tag variant="solid">Type Safety</Tag>
            <Tag variant="solid">Design Systems</Tag>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => {
              window.location.href = 'mailto:hello@example.com'
            }}
          >
            开始交流
          </Button>
        </Card>

        <Card className="soft-card about-skills">
          <h3>技能与偏好</h3>
          <div className="skills-list">
            {skills.map((skill) => (
              <div key={skill.name} className="skill-row">
                <div className="skill-header">
                  <span>{skill.name}</span>
                  <span className="muted">{skill.level}%</span>
                </div>
                <Progress value={skill.level} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="soft-card about-experience">
          <h3>经历</h3>
          <div className="timeline">
            {experiences.map((item) => (
              <div key={item.title} className="timeline-item">
                <div className="timeline-dot" />
                <div>
                  <div className="timeline-period mono">{item.period}</div>
                  <div className="timeline-title">{item.title}</div>
                  <p className="muted">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="soft-card about-contact">
          <h3>联系我</h3>
          <div className="contact-list">
            {contacts.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-item"
              >
                <span className="contact-label">{item.label}</span>
                <span className="contact-value">{item.value}</span>
              </a>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
