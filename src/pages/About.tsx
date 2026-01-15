import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SEO } from '@/components/SEO'
import { cn } from '@/lib/utils'

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

// Custom Progress Component since install failed
function ProgressBar({ value, className }: { value: number, className?: string }) {
    return (
        <div className={cn("h-2 w-full bg-secondary overflow-hidden rounded-full", className)}>
            <div 
                className="h-full bg-primary transition-all duration-500 ease-in-out" 
                style={{ width: `${value}%` }} 
            />
        </div>
    )
}

export default function About() {
  return (
    <>
      <SEO
        title="关于"
        description="前端/全栈开发者 - 热爱把技术与设计揉到一起，偏爱触感、柔和光影的界面"
        keywords={['前端开发', '全栈开发', 'React', 'TypeScript', '设计系统']}
      />
      <div className="container mx-auto max-w-4xl py-10 space-y-8">
      <header className="space-y-4 text-center md:text-left">
        <Badge variant="secondary" className="mb-2">About</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">关于 KZQ</h1>
        <p className="text-xl text-muted-foreground max-w-[700px]">
          热爱把技术与设计揉到一起，偏爱触感、柔和光影的界面，同时坚持严谨的类型与工程质量。
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <Card className="flex flex-col glass-card md:col-span-1">
            <CardHeader className="text-center pb-2">
                <div className="text-6xl mb-4">👋</div>
                <CardTitle>前端 / 全栈开发者</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
                <p className="text-muted-foreground">
                    关注 TypeScript、React 生态和设计系统，擅长把抽象的系统语言转化为可触摸的 UI。
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="outline">新拟态</Badge>
                    <Badge variant="outline">类型安全</Badge>
                    <Badge variant="outline">设计系统</Badge>
                </div>
                <Button 
                    className="w-full"
                    onClick={() => window.location.href = 'mailto:hello@example.com'}
                >
                    开始交流
                </Button>
            </CardContent>
        </Card>

        {/* Skills Card */}
        <Card className="glass-card md:col-span-1">
            <CardHeader>
                <CardTitle>技能与偏好</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-muted-foreground">{skill.level}%</span>
                        </div>
                        <ProgressBar value={skill.level} />
                    </div>
                ))}
            </CardContent>
        </Card>

        {/* Experience Card */}
        <Card className="glass-card md:col-span-1">
            <CardHeader>
                <CardTitle>经历</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8 border-l-2 border-muted ml-3 pl-6 py-2">
                    {experiences.map((item) => (
                        <div key={item.title} className="relative">
                            <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-background bg-primary ring-2 ring-border" />
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-mono text-muted-foreground">{item.period}</span>
                                <span className="font-semibold">{item.title}</span>
                                <p className="text-sm text-muted-foreground">{item.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        {/* Contact Card */}
        <Card className="glass-card md:col-span-1">
            <CardHeader>
                <CardTitle>联系我</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {contacts.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg border border-transparent hover:bg-muted/50 transition-colors group"
                    >
                        <span className="font-medium">{item.label}</span>
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">{item.value}</span>
                    </a>
                ))}
            </CardContent>
        </Card>
      </div>
    </div>
    </>
  )
}
