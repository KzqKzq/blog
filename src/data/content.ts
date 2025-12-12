import type { Article, Project } from '../types/content'
import { parseMarkdownFile } from '../utils/markdown'

const postFiles = import.meta.glob('../content/posts/*.md', { query: '?raw', import: 'default', eager: true })
const essayFiles = import.meta.glob('../content/essays/*.md', { query: '?raw', import: 'default', eager: true })

function loadArticles(files: Record<string, unknown>): Article[] {
  return Object.entries(files).map(([path, content]) => {
    const fileName = path.split('/').pop() || ''
    const { frontmatter, body } = parseMarkdownFile(fileName, content as string)

    return {
      ...frontmatter,
      body,
    } as Article
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const posts: Article[] = loadArticles(postFiles)
export const essays: Article[] = loadArticles(essayFiles)

export const projects: Project[] = [
  {
    id: 'project-tactile-ui',
    name: 'Tactile UI',
    summary:
      '一个主打触感与新拟物风格的 React 组件库，覆盖按钮、卡片、表单与弹窗等 30+ 组件。',
    tech: ['React', 'TypeScript', 'Radix UI'],
    link: 'https://github.com/kzqkzq/tactile-ui',
    demo: 'https://kzqkzq.github.io/tactile-ui',
    stars: 128,
    accent: 'brand',
    highlights: [
      '双层光影 + 玻璃化背景的主题系统',
      '严格的类型定义，开箱即用的 DX',
      '含 Skeleton、ArticleCard、Toast 等高阶组件',
    ],
  },
  {
    id: 'project-voice-copilot',
    name: 'Voice Copilot',
    summary:
      '基于 WebSocket 的语音助手，支持多轮对话与快捷命令面板。',
    tech: ['Python', 'WebSocket', 'AI'],
    link: 'https://github.com/kzqkzq/voice-copilot',
    stars: 56,
    accent: 'cool',
    highlights: ['低延迟语音识别', '可插拔的意图识别管线'],
  },
  {
    id: 'project-smart-esp32',
    name: 'Smart ESP32',
    summary:
      '智能家居物联网侧服务，涵盖设备编排、自动化脚本与监控面板。',
    tech: ['Python', 'ESP32', 'IoT'],
    link: 'https://github.com/kzqkzq/xiaozhi-esp32-server',
    stars: 234,
    accent: 'amber',
    highlights: ['边缘计算 + 云端同步', 'Matter 生态适配'],
  },
]

export const allArticles: Article[] = [...posts, ...essays]

export function findArticleBySlug(slug: string): Article | undefined {
  return allArticles.find((article) => article.slug === slug)
}
