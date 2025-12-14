import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Tag, Toggle, Select, SelectTrigger, SelectContent, SelectItem, SelectValue, Input } from '@kzqkzq/tactile-ui'
import { supabase, Article } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { parseArticleContent } from '../../utils/articleContent'
import './Admin.css'

type StatusFilter = 'all' | 'published' | 'draft'
type SortKey = 'created_at' | 'updated_at' | 'title'

export default function AdminDashboard() {
    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [sortBy, setSortBy] = useState<SortKey>('created_at')
    const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc')
    const [refreshing, setRefreshing] = useState(false)
    const [actionId, setActionId] = useState<string | null>(null)

    const { signOut } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        fetchArticles()
    }, [])

    const fetchArticles = async (options?: { silent?: boolean }) => {
        const silent = options?.silent
        if (!silent) {
            setLoading(true)
        }

        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setArticles(data || [])
        } catch (error) {
            console.error('Error fetching articles:', error)
        } finally {
            if (silent) {
                setRefreshing(false)
            } else {
                setLoading(false)
            }
        }
    }

    const categories = useMemo(
        () => Array.from(new Set(articles.map((a) => a.category).filter(Boolean))),
        [articles]
    )

    const tagCount = useMemo(() => {
        const tags = new Set<string>()
        articles.forEach((article) => {
            ; (article.tags || []).forEach((tag) => tags.add(tag))
        })
        return tags.size
    }, [articles])

    const filteredArticles = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        const filtered = articles.filter((article) => {
            const matchesSearch =
                !term ||
                article.title.toLowerCase().includes(term) ||
                article.slug.toLowerCase().includes(term) ||
                (article.description || '').toLowerCase().includes(term) ||
                (article.tags || []).some((tag) => tag.toLowerCase().includes(term))

            const matchesStatus =
                statusFilter === 'all'
                    ? true
                    : statusFilter === 'published'
                        ? article.published
                        : !article.published

            const matchesCategory =
                categoryFilter === 'all' ? true : article.category === categoryFilter

            return matchesSearch && matchesStatus && matchesCategory
        })

        return filtered.sort((a, b) => {
            if (sortBy === 'title') {
                return sortDirection === 'asc'
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title)
            }

            const dateA = new Date(
                sortBy === 'updated_at' && a.updated_at ? a.updated_at : a.created_at
            ).getTime()
            const dateB = new Date(
                sortBy === 'updated_at' && b.updated_at ? b.updated_at : b.created_at
            ).getTime()

            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
        })
    }, [articles, searchTerm, statusFilter, categoryFilter, sortBy, sortDirection])

    const publishedCount = useMemo(
        () => articles.filter((article) => article.published).length,
        [articles]
    )
    const lastUpdated = useMemo(() => {
        if (!articles.length) return null
        const latest = articles.reduce((latestTime, article) => {
            const time = new Date(article.updated_at || article.created_at).getTime()
            return Math.max(latestTime, time)
        }, 0)
        return new Date(latest)
    }, [articles])

    const handleDelete = async (id: string) => {
        if (!confirm('确定删除这篇文章吗？')) return

        setActionId(id)
        try {
            const { error } = await supabase
                .from('articles')
                .delete()
                .eq('id', id)

            if (error) throw error
            setArticles((prev) => prev.filter((a) => a.id !== id))
        } catch (error) {
            console.error('删除文章失败:', error)
            alert('删除失败，请稍后再试')
        } finally {
            setActionId(null)
        }
    }

    const handleTogglePublish = async (article: Article) => {
        setActionId(article.id)
        try {
            const { error } = await supabase
                .from('articles')
                .update({ published: !article.published })
                .eq('id', article.id)

            if (error) throw error
            setArticles((prev) =>
                prev.map((item) =>
                    item.id === article.id ? { ...item, published: !item.published } : item
                )
            )
        } catch (error) {
            console.error('更新发布状态失败:', error)
            alert('更新发布状态失败')
        } finally {
            setActionId(null)
        }
    }

    const handleRefresh = async () => {
        setRefreshing(true)
        await fetchArticles({ silent: true })
    }

    const handleSignOut = async () => {
        await signOut()
        navigate('/admin/login')
    }

    const formatDate = (value: string) =>
        new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })

    return (
        <div className="admin-shell">
            <div className="admin-hero">
                <div>
                    <div className="pill">内容控制台</div>
                    <h1 className="admin-hero__title">后台管理</h1>
                    <p className="admin-hero__desc">
                        快速筛选、搜索、发布或撤销发布文章，与博客同一套柔和的质感风格保持一致。
                    </p>
                </div>
                <div className="admin-actions">
                    <Button type="button" variant="primary" onClick={() => navigate('/admin/articles/new')}>
                        新建文章
                    </Button>
                    <Button type="button" onClick={handleRefresh} disabled={loading || refreshing}>
                        {refreshing ? '刷新中...' : '刷新列表'}
                    </Button>
                    <Button type="button" onClick={handleSignOut}>
                        退出登录
                    </Button>
                </div>
            </div>

            <div className="admin-stats">
                <Card className="stat-card admin-card">
                    <div className="stat-card__label">已发布</div>
                    <div className="stat-card__value">{publishedCount}</div>
                    <div className="stat-card__hint">线上可见</div>
                </Card>
                <Card className="stat-card admin-card">
                    <div className="stat-card__label">草稿</div>
                    <div className="stat-card__value">{articles.length - publishedCount}</div>
                    <div className="stat-card__hint">等待发布</div>
                </Card>
                <Card className="stat-card admin-card">
                    <div className="stat-card__label">分类</div>
                    <div className="stat-card__value">{categories.length}</div>
                    <div className="stat-card__hint">内容覆盖面</div>
                </Card>
                <Card className="stat-card admin-card">
                    <div className="stat-card__label">标签</div>
                    <div className="stat-card__value">{tagCount}</div>
                    <div className="stat-card__hint">
                        {lastUpdated ? `最近更新 ${lastUpdated.toLocaleDateString()}` : '暂无活动'}
                    </div>
                </Card>
            </div>

            <Card className="admin-card admin-filter-bar">
                <div className="filter-row">
                    <div className="search-field">
                        <Input
                            type="search"
                            placeholder="搜索标题、链接或标签"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        {(['all', 'published', 'draft'] as StatusFilter[]).map((status) => (
                            <Toggle
                                key={status}
                                pressed={statusFilter === status}
                                onPressedChange={() => setStatusFilter(status)}
                                className="pill-toggle"
                            >
                                {status === 'all' ? '全部' : status === 'published' ? '已发布' : '草稿'}
                            </Toggle>
                        ))}
                    </div>
                </div>

                <div className="filter-row">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="select-field">
                            <SelectValue placeholder="全部分类" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">全部分类</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category || '未分类'}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
                        <SelectTrigger className="select-field">
                            <SelectValue placeholder="排序方式" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="created_at">按创建时间</SelectItem>
                            <SelectItem value="updated_at">按更新时间</SelectItem>
                            <SelectItem value="title">按标题</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sortDirection} onValueChange={(v) => setSortDirection(v as 'asc' | 'desc')}>
                        <SelectTrigger className="select-field">
                            <SelectValue placeholder="排序顺序" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="desc">最新在前</SelectItem>
                            <SelectItem value="asc">最旧在前</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            <Card className="admin-card admin-table-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>文章</th>
                            <th>状态</th>
                            <th>分类与标签</th>
                            <th>时间</th>
                            <th style={{ textAlign: 'right' }}>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="admin-empty">
                                    正在加载文章...
                                </td>
                            </tr>
                        ) : filteredArticles.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="admin-empty">
                                    没有匹配的结果，试试清空搜索或调整筛选。
                                </td>
                            </tr>
                        ) : (
                            filteredArticles.map((article) => (
                                <tr key={article.id}>
                                    <td>
                                        <div className="article-title">{article.title}</div>
                                        <div className="article-slug">/{article.slug}</div>
                                        {article.description && (
                                            <div className="meta-row" style={{ marginTop: '6px' }}>
                                                <span>{article.description}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <Tag variant="solid">
                                            {article.published ? '已发布' : '草稿'}
                                        </Tag>
                                    </td>
                                    <td>
                                        <div className="meta-row">
                                            <span className="chip chip--brand">
                                                {article.category || '未分类'}
                                            </span>
                                            {parseArticleContent(article.content)?.meta?.sticky && (
                                                <span className="chip">置顶</span>
                                            )}
                                        </div>
                                        {article.tags && article.tags.length > 0 && (
                                            <div className="tag-row">
                                                {article.tags.map((tag) => (
                                                    <span key={tag} className="chip">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <div className="meta-row">
                                            <span>创建 {formatDate(article.created_at)}</span>
                                            {article.updated_at && (
                                                <span>更新 {formatDate(article.updated_at)}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="article-actions">
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => navigate(`/admin/articles/${article.id}`)}
                                            >
                                                编辑
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => handleTogglePublish(article)}
                                                disabled={actionId === article.id}
                                            >
                                                {article.published ? '撤回发布' : '发布上线'}
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => window.open(`/blog/${article.slug}`, '_blank')}
                                            >
                                                预览
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => handleDelete(article.id)}
                                                disabled={actionId === article.id}
                                            >
                                                删除
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    )
}
