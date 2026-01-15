import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SEO } from '@/components/SEO'
import { Breadcrumb } from '@/components/Breadcrumb'
import { supabase, Post } from '../lib/supabase'
import { parseArticleContent } from '../utils/articleContent'
import { CalendarDays, Clock, Tag as TagIcon, Search, X } from 'lucide-react'
import { BlogPostSkeleton } from '@/components/ui/loading-spinner'
import { cn, getTagColor } from '@/lib/utils'

// 使用 Unsplash 的随机图片作为默认封面
const getRandomImage = (seed: string) => {
  return `https://picsum.photos/seed/${seed}/800/600`
}

const POSTS_PER_PAGE = 6

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

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

  // Get all unique tags from posts
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    posts.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [posts])

  // Filter posts based on search and selected tag
  const filteredPosts = useMemo(() => {
    let filtered = posts

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Filter by selected tag
    if (selectedTag) {
      filtered = filtered.filter(post =>
        post.tags?.includes(selectedTag)
      )
    }

    return filtered
  }, [posts, searchQuery, selectedTag])

  // Paginate filtered posts
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE
    const endIndex = startIndex + POSTS_PER_PAGE
    return filteredPosts.slice(startIndex, endIndex)
  }, [filteredPosts, currentPage])

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedTag])

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedTag(null)
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="container max-w-5xl py-10 space-y-8">
        <BlogPostSkeleton count={6} />
      </div>
    )
  }

  return (
    <>
      <SEO
        title="博客"
        description="技术写作与模式实验 - 记录 React 模式、TypeScript 工程实践与新用户的落地过程"
        keywords={['React', 'TypeScript', '前端开发', '技术博客', '编程']}
      />
      <div className="container max-w-5xl py-10 space-y-8">
        <Breadcrumb />
        {/* Header */}

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="搜索文章标题、摘要或标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground self-center">标签筛选：</span>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all hover:scale-105",
                    selectedTag === tag ? "" : getTagColor(tag)
                  )}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                >
                  <TagIcon className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {(searchQuery || selectedTag) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-7 text-xs"
                >
                  <X className="w-3 h-3 mr-1" />
                  清除筛选
                </Button>
              )}
            </div>
          )}

          {/* Results count */}
          {(searchQuery || selectedTag) && (
            <p className="text-sm text-muted-foreground">
              找到 {filteredPosts.length} 篇文章
            </p>
          )}
        </div>

        {/* Blog Cards */}
        <div className="grid gap-6">
          {paginatedPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`}>
              <Card className="group overflow-hidden glass-card transition-all duration-300 hover:shadow-2xl">
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
                            "transition-all duration-200 hover:scale-105 cursor-pointer bg-secondary/50",
                            getTagColor(tag)
                          )}
                          onClick={(e) => {
                            e.preventDefault()
                            setSelectedTag(tag)
                          }}
                        >
                          <TagIcon className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Right: Image */}
                  <div className="md:w-72 lg:w-80 h-48 md:h-auto relative overflow-hidden bg-muted/50">
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

          {paginatedPosts.length === 0 && (
            <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-white/20">
              {searchQuery || selectedTag ? '没有找到匹配的文章' : '暂无文章'}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              上一页
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                const showPage =
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)

                if (!showPage) {
                  // Show ellipsis
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2 text-muted-foreground">...</span>
                  }
                  return null
                }

                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="min-w-[2.5rem]"
                  >
                    {page}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              下一页
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
