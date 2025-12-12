import type { Article, Project } from '../types/content'

export const posts: Article[] = [
  {
    id: 'post-react-patterns',
    slug: 'react-patterns',
    title: 'React 设计模式最佳实践',
    description:
      '从 Compound Components、Render Props 到自定义 Hooks，拆解如何让组件体系既柔韧又易维护。',
    date: '2024-12-10',
    readingTime: '8 min',
    tags: ['React', '模式', '前端架构'],
    category: 'tech',
    accent: 'brand',
    featured: true,
    body: `
## 为什么还要谈设计模式
UI 复杂度增长的第一信号是 props 四处漂移。约束数据流、约束边界，组件才有“质感”。

### 关键模式
- Compound Components：用 Context 打包状态与意图，避免 props drilling。
- State Reducer：让父组件控制状态机，解耦可视化与业务决策。
- Render Props & Slot：把“要渲染什么”交还调用方，保持组件的抽象性。
- Custom Hooks：把副作用与跨组件逻辑提炼出来，和 UI 组件保持松耦合。

### 实战建议
1. 先画状态机，再决定 props；避免“猜测式” API。
2. 多用不可变数据与 memo，保留组件的可预测性。
3. 给每个模式写 1 条使用准则，团队评审时对照执行。`,
  },
  {
    id: 'post-css-neumorphism',
    slug: 'css-neumorphism',
    title: 'CSS Neumorphism 的现代实现',
    description:
      '基于双层光影、玻璃拟态与噪声纹理，构建轻量而不油腻的触感界面。',
    date: '2024-12-08',
    readingTime: '6 min',
    tags: ['CSS', 'Neumorphism', 'UI'],
    category: 'tech',
    accent: 'amber',
    body: `
## 现代新拟物的 3 个核心
- **光影对冲**：左上高光 + 右下阴影，透明度控制在 0.08~0.16 之间。
- **玻璃雾化**：使用 \`backdrop-filter: blur(16px)\` + 半透明边框，避免强烈的玻璃边缘。
- **柔软半径**：12px-24px 的圆角让元素“浑然一体”，搭配 0.2s 的过渡。

### 实现清单
1. 统一背景色：#eeeeee 基调，上铺微弱噪声 SVG 纹理。
2. 定义 token：\`--shadow-raised\`、\`--shadow-pressed\`、\`--shadow-glass\`。
3. 微交互：hover 上浮 2~4px，active 轻微按压 + inset 阴影。
4. 可读性：标题用装饰性字体，正文坚持几何无衬线，避免“花哨即视感”。`,
  },
  {
    id: 'post-typescript-tips',
    slug: 'typescript-tips',
    title: 'TypeScript 深度心法',
    description:
      '从类型编排到 API 设计的落地策略，让 TS 成为守护质量的“静态防护网”。',
    date: '2024-12-05',
    readingTime: '7 min',
    tags: ['TypeScript', 'DX', '工程'],
    category: 'tech',
    accent: 'cool',
    body: `
## 三个实践切口
- 声明数据契约：先写 interface，再写实现，保持领域词汇一致。
- 类型收敛：公共 API 尽量输出只读、精简的类型，内部再扩展。
- 工具类型：利用 \`satisfies\`、\`ReturnType\`、\`Extract\` 做安全推导。

### 工程落地
1. 开启 \`strict\`，并用 \`tsc --noEmit\` 作为 CI 的“第二道保险”。
2. 公共模块导出类型别名，避免外部依赖内部实现细节。
3. 用 ESLint 的 unused-vars 规则约束“无意的 any”与“悬空的 props”。`,
  },
]

export const essays: Article[] = [
  {
    id: 'essay-year-review-2024',
    slug: 'year-review-2024',
    title: '2024 年度回顾：松弛与锋利',
    description:
      '记录这一年的聚焦与取舍：从产品重构到生活节奏的调频。',
    date: '2024-12-01',
    readingTime: '5 min',
    tags: ['年度复盘', '思考'],
    category: 'essay',
    accent: 'neutral',
    featured: true,
    body: `
这一年刻意放慢了产出频率，把时间留给打磨与休息。

- 技术：做了两次从 0 到 1 的组件库重构，最大的收获是“命名即权衡”。
- 身体：学会在工作日中午散步 20 分钟，效率反而提升。
- 关系：减少无效会议，把深度讨论留给能量高的时段。

> 生活和产品一样，需要留出呼吸的空白。`,
  },
  {
    id: 'essay-reading-notes',
    slug: 'reading-notes',
    title: '《原则》阅读摘记',
    description:
      '从桥水的“极度透明”里，摘出最适合个人习惯的三个行动点。',
    date: '2024-11-15',
    readingTime: '4 min',
    tags: ['阅读', '习惯'],
    category: 'essay',
    accent: 'amber',
    body: `
瑞·达利欧把“独立思考 + 激烈辩论”视作决策前置条件。

1. 把问题抽象成可复用的规则，而不是一次性的决策。
2. 记录推理过程，复盘时对照事实校正认知偏差。
3. 保持松弛：在高压决策前，给自己 30 分钟的离屏时间。`,
  },
]

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
