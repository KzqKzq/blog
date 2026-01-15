import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft } from 'lucide-react'
import { SEO } from '@/components/SEO'

import { supabase, Post } from '../lib/supabase'
import { fetchDailyImage } from '../utils/bingImageUtils'
import { ArticleView } from '../components/ArticleView'
import { parseArticleContent } from '../utils/articleContent'

import '@/styles/markdown.css'

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [article, setArticle] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [contentMarkdown, setContentMarkdown] = useState('')
  const [prevArticle, setPrevArticle] = useState<Partial<Post> | null>(null)
  const [nextArticle, setNextArticle] = useState<Partial<Post> | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Partial<Post>[]>([])

  // Determine the back path based on current location
  const backPath = location.pathname.startsWith('/essays') ? '/essays' : '/blog'

  useEffect(() => {
    if (slug) {
      fetchArticle(slug)
    }
  }, [slug])

  const fetchArticle = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (error) throw error
      setArticle(data)

      const payload = parseArticleContent(data.content)
      setContentMarkdown(payload?.markdown || data.content || '')

      if (data.cover_image) {
        setCoverImage(data.cover_image)
      } else {
        fetchDailyImage().then((url) => {
          if (url) setCoverImage(url)
        })
      }

      // Fetch adjacent articles (prev and next)
      const { data: allPosts } = await supabase
        .from('posts')
        .select('id, title, slug, created_at, tags, excerpt')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (allPosts) {
        const currentIndex = allPosts.findIndex(p => p.id === data.id)
        if (currentIndex > 0) {
          setNextArticle(allPosts[currentIndex - 1]) // Newer article
        }
        if (currentIndex < allPosts.length - 1) {
          setPrevArticle(allPosts[currentIndex + 1]) // Older article
        }

        // Find related articles based on shared tags
        if (data.tags && data.tags.length > 0) {
          const related = allPosts
            .filter(p => p.id !== data.id) // Exclude current article
            .map(p => {
              const sharedTags = p.tags?.filter((tag: string) => data.tags?.includes(tag)) || []
              return { post: p, score: sharedTags.length }
            })
            .filter(item => item.score > 0) // Only articles with shared tags
            .sort((a, b) => b.score - a.score) // Sort by number of shared tags
            .slice(0, 3) // Get top 3
            .map(item => item.post)

          setRelatedArticles(related)
        }
      }

    } catch (error) {
      console.error('Error fetching article:', error)
      setArticle(null)
    } finally {
      setLoading(false)
    }
  }



  if (loading) {
    return (
        <div className="container py-20 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
    )
  }

  if (!article) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">内容未找到</h2>
        <p className="text-muted-foreground mb-6">可能尚未发布或链接已失效。</p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> 返回首页
        </Button>
      </div>
    )
  }

  return (
    <>
      <SEO
        title={article.title}
        description={article.excerpt || undefined}
        keywords={article.tags || undefined}
        image={coverImage || article.cover_image || undefined}
        type="article"
        publishedTime={article.created_at}
        modifiedTime={article.updated_at}
      />
      <ArticleView
        article={article}
        content={contentMarkdown}
        coverImage={coverImage || undefined}
        onBack={() => navigate(backPath)}
        prevArticle={prevArticle}
        nextArticle={nextArticle}
        relatedArticles={relatedArticles}
      />
    </>
  )
}
