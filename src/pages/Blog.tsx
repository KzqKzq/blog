import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase, Post } from '../lib/supabase'
import { parseArticleContent } from '../utils/articleContent'
import { CalendarDays, Clock, Tag as TagIcon } from 'lucide-react'
import { LoadingSpinner, PageLoadingSkeleton } from '@/components/ui/loading-spinner'

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
    <div className="container max-w-4xl py-10 space-y-12">
      <div className="space-y-4 text-center md:text-left">
        <Badge variant="secondary" className="mb-2">Writing</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          技术写作与模式实验
        </h1>
        <p className="text-xl text-muted-foreground max-w-[700px]">
          记录 React 模式、TypeScript 工程实践与新用户的落地过程。
        </p>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Link key={post.id} to={`/blog/${post.slug}`}>
            <Card className="group hover:shadow-lg transition-all duration-300 border-border/60 hover:border-primary/50">
              <CardHeader>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.content ? calculateReadingTime(post.content) : '1 分钟'}</span>
                  </div>
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags && post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-secondary/50 group-hover:bg-secondary transition-colors">
                      <TagIcon className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
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
