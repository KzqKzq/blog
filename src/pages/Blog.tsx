import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase, Post } from '../lib/supabase'
import { parseArticleContent } from '../utils/articleContent'
import { CalendarDays, Clock, Tag as TagIcon } from 'lucide-react'
import { PageLoadingSkeleton } from '@/components/ui/loading-spinner'
import { cn, getTagColor } from '@/lib/utils'

// 使用 Unsplash 的随机图片作为默认封面
const getRandomImage = (seed: string) => {
  return `https://picsum.photos/seed/${seed}/800/600`
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) throw error

      const withSticky = (data || []).map((post) => {
        const parsed = parseArticleContent(post.content)
        return { post, sticky: parsed?.meta?.sticky || false }
      })
      withSticky.sort((a, b) => Number(b.sticky) - Number(a.sticky))
      setPosts(withSticky.map((item) => item.post))
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    const time = Math.ceil(words / wordsPerMinute)
    return `${time} 分钟阅读`
  }

  if (loading) {
    return (
      <div className="container py-10 space-y-8">
        <div className="space-y-4">
           <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Writing</h1>
           <p className="text-xl text-muted-foreground">技术写作与模式实验</p>
        </div>
        <PageLoadingSkeleton count={6} />
      </div>
    )
  }

  return (
    <div className="container max-w-5xl py-10 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center md:text-left">
        <Badge variant="secondary" className="mb-2">Writing</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          技术写作与模式实验
        </h1>
        <p className="text-xl text-muted-foreground max-w-[700px]">
          记录 React 模式、TypeScript 工程实践与新用户的落地过程。
        </p>
      </div>

      {/* Blog Cards */}
      <div className="grid gap-6">
        {posts.map((post) => (
          <Link key={post.id} to={`/blog/${post.slug}`}>
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/60 hover:border-primary/30">
              <div className="flex flex-col md:flex-row">
                {/* Left: Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  {/* Meta info */}
                  <div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>{new Date(post.created_at).toLocaleDateString('zh-CN')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.content ? calculateReadingTime(post.content) : '1 分钟'}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags && post.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className={cn(
                          "transition-all duration-200 hover:scale-105",
                          getTagColor(tag)
                        )}
                      >
                        <TagIcon className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Right: Image */}
                <div className="md:w-72 lg:w-80 h-48 md:h-auto relative overflow-hidden bg-muted">
                  <img
                    src={post.cover_image || getRandomImage(post.slug || post.id)}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent to-background/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </Card>
          </Link>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
            暂无文章
          </div>
        )}
      </div>
    </div>
  )
}
