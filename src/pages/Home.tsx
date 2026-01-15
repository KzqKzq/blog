import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Github, Twitter, Mail, Code2, Terminal, Cpu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SEO } from '@/components/SEO'
import { useEffect, useState } from 'react'
import { supabase, Post } from '../lib/supabase'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Clock } from 'lucide-react'

// Monochrome / Frosted Glass Style
const FEATURED_PROJECTS = [
  {
    title: 'React 设计系统',
    description: '基于 Radix UI 和 Tailwind CSS 构建的现代、无障碍组件库。支持暗黑模式、动画和全键盘导航。',
    tags: ['React', 'TypeScript', 'Tailwind'],
    icon: <Code2 className="w-6 h-6" />,
  },
  {
    title: '开发者仪表盘',
    description: '一个综合性的开发者仪表盘，用于追踪 GitHub 活动、阅读列表和编码指标。',
    tags: ['Next.js', 'Recharts', 'Supabase'],
    icon: <Terminal className="w-6 h-6" />,
  },
  {
    title: '智能家居中枢',
    description: '用于管理智能设备的 IoT 控制中心。使用 ESP32 和 React Native 构建，支持跨平台控制。',
    tags: ['IoT', 'C++', 'React Native'],
    icon: <Cpu className="w-6 h-6" />,
  }
]

const getRandomImage = (seed: string) => {
  return `https://picsum.photos/seed/${seed}/800/600`
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(3)
        
        if (error) throw error
        if (data) setPosts(data)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <>
      <SEO />
      
      {/* Decorative background blobs for frosted effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-24 space-y-32">
        
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto"
        >
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-background/50 shadow-2xl ring-1 ring-foreground/10 backdrop-blur-sm">
               <img 
                 src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent" 
                 alt="Avatar" 
                 className="w-full h-full object-cover bg-muted/50"
               />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-foreground text-background font-medium text-xs px-3 py-1 rounded-full shadow-lg border-2 border-background">
              寻求机会
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground drop-shadow-sm">
              构建数字世界的 <br className="hidden md:block"/>
              <span className="text-foreground/80">
                艺术杰作
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
              你好，我是 <span className="text-foreground font-medium underline decoration-foreground/20 underline-offset-4">全栈工程师</span>，
              致力于打造极简且高性能的 Web 体验。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg hover:shadow-xl transition-all bg-foreground text-background hover:bg-foreground/90" asChild>
              <Link to="/projects">
                查看作品 <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base glass-button" asChild>
              <Link to="/about">关于我</Link>
            </Button>
          </div>

          <div className="flex items-center gap-8 pt-8 text-muted-foreground/80">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground hover:scale-110 transition-all">
              <Github className="w-6 h-6" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-foreground hover:scale-110 transition-all">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="mailto:hello@example.com" className="hover:text-foreground hover:scale-110 transition-all">
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </motion.section>

        {/* Featured Writing */}
        <motion.section 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-12"
        >
          <div className="flex items-end justify-between border-b border-foreground/10 pb-6">
            <h2 className="text-3xl font-bold tracking-tight">精选文章</h2>
            <Link to="/blog" className="text-muted-foreground hover:text-foreground flex items-center gap-1 group transition-colors">
              阅读所有文章 <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Loading State */}
            {loading && Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-4">
                 <div className="aspect-[16/10] bg-muted/50 rounded-2xl animate-pulse" />
                 <div className="h-6 bg-muted/50 rounded w-3/4 animate-pulse" />
                 <div className="h-4 bg-muted/50 rounded w-full animate-pulse" />
              </div>
            ))}

            {/* Content */}
            {!loading && posts.map((post) => (
              <motion.div 
                key={post.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Link to={`/blog/${post.slug}`} className="group block h-full">
                  <div className="flex flex-col h-full space-y-4">
                    <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-muted/50 border border-foreground/5 relative shadow-sm group-hover:shadow-md transition-all duration-500">
                      <img 
                        src={post.cover_image || getRandomImage(post.slug || post.id)} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                      />
                    </div>
                    
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground/80">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          5 分钟阅读
                        </span>
                      </div>
                      <h3 className="text-xl font-bold leading-tight group-hover:underline decoration-foreground/30 underline-offset-4 transition-all">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2 text-sm font-light">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            
            {/* Empty State */}
            {!loading && posts.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted-foreground/50 border-2 border-dashed border-foreground/5 rounded-3xl">
                <p className="text-lg font-light">写作进行中...</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Featured Projects - Frosted Glass Cards */}
        <motion.section 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-12"
        >
          <div className="flex items-end justify-between border-b border-foreground/10 pb-6">
            <h2 className="text-3xl font-bold tracking-tight">精选项目</h2>
            <Link to="/projects" className="text-muted-foreground hover:text-foreground flex items-center gap-1 group transition-colors">
              查看所有作品 <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_PROJECTS.map((project, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full p-6 flex flex-col glass-card group relative overflow-hidden">
                   <div className="relative z-10">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-foreground/5 text-foreground mb-6 group-hover:scale-110 transition-transform duration-300`}>
                       {project.icon}
                     </div>
                     
                     <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                     <p className="text-muted-foreground mb-6 line-clamp-3 text-sm leading-relaxed font-light">
                       {project.description}
                     </p>
                     
                     <div className="flex flex-wrap gap-2 mt-auto">
                       {project.tags.map(tag => (
                         <Badge key={tag} variant="secondary" className="font-normal bg-foreground/5 hover:bg-foreground/10 text-foreground/80 border-transparent">
                           {tag}
                         </Badge>
                       ))}
                     </div>
                   </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Newsletter / Footer CTA - Minimalist */}
        <section className="py-16 border-y border-foreground/5 bg-gradient-to-b from-transparent to-muted/20 text-center space-y-8 relative overflow-hidden">
           <div className="relative z-10">
             <h2 className="text-3xl md:text-4xl font-bold tracking-tight">保持关注</h2>
             <p className="text-muted-foreground max-w-lg mx-auto font-light">
               我会分享关于 Web 开发、设计系统和软件工程的文章。
               订阅即时获取每月更新。
             </p>
             <div className="flex max-w-sm mx-auto gap-2 pt-4">
               <input 
                 type="email" 
                 placeholder="输入你的邮箱" 
                 className="flex h-10 w-full rounded-md glass-input px-3 py-2 text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
               />
               <Button variant="default">订阅</Button>
             </div>
           </div>
        </section>

      </div>
    </>
  )
}