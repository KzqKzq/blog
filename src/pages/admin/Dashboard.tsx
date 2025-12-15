import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, Post } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { parseArticleContent } from '../../utils/articleContent'
import { formatDate } from '../../utils/dateUtils' // Assuming exists or will inline

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Search, RefreshCw, LogOut, Edit3, Eye, Trash2, Send } from 'lucide-react'
import { TableLoadingSkeleton } from '@/components/ui/loading-spinner'

type StatusFilter = 'all' | 'published' | 'draft'
type SortKey = 'created_at' | 'updated_at' | 'title'

export default function AdminDashboard() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
    const [sortBy, setSortBy] = useState<SortKey>('created_at')
    const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc')
    const [refreshing, setRefreshing] = useState(false)
    const [actionId, setActionId] = useState<string | null>(null)

    const { signOut } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async (options?: { silent?: boolean }) => {
        const silent = options?.silent
        if (!silent) setLoading(true)

        try {
            const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
            if (error) throw error
            setPosts(data || [])
        } catch (error) {
            console.error('Error fetching posts:', error)
        } finally {
            if (silent) {
                setRefreshing(false)
            } else {
                setLoading(false)
            }
        }
    }

    const filteredPosts = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        const filtered = posts.filter((post) => {
            const matchesSearch = !term || post.title.toLowerCase().includes(term) || post.slug.toLowerCase().includes(term)
            const matchesStatus = statusFilter === 'all' || post.status === statusFilter
            return matchesSearch && matchesStatus
        })

        return filtered.sort((a, b) => {
            if (sortBy === 'title') return sortDirection === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
            const dateA = new Date(sortBy === 'updated_at' && a.updated_at ? a.updated_at : a.created_at).getTime()
            const dateB = new Date(sortBy === 'updated_at' && b.updated_at ? b.updated_at : b.created_at).getTime()
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
        })
    }, [posts, searchTerm, statusFilter, sortBy, sortDirection])

    const handleDelete = async (id: string) => {
        if (!confirm('确定删除这篇文章吗？')) return
        setActionId(id)
        try {
            const { error } = await supabase.from('posts').delete().eq('id', id)
            if (error) throw error
            setPosts((prev) => prev.filter((p) => p.id !== id))
        } catch (error) {
            console.error('删除文章失败:', error)
        } finally {
            setActionId(null)
        }
    }

    const handleTogglePublish = async (post: Post) => {
        setActionId(post.id)
        const newStatus = post.status === 'published' ? 'draft' : 'published'
        try {
            const { error } = await supabase.from('posts').update({ status: newStatus }).eq('id', post.id)
            if (error) throw error
            setPosts((prev) => prev.map((item) => item.id === post.id ? { ...item, status: newStatus } : item))
        } catch (error) {
            console.error('更新失败:', error)
        } finally {
            setActionId(null)
        }
    }

    const handleRefresh = async () => {
        setRefreshing(true)
        await fetchPosts({ silent: true })
    }

    const publishedCount = posts.filter(p => p.status === 'published').length

    return (
        <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">管理您的博客内容与发布状态</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleRefresh} variant="outline" size="sm" disabled={refreshing}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                        刷新
                    </Button>
                    <Button onClick={() => navigate('/admin/posts/new')} size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        新建文章
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">总文章</CardTitle>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{posts.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">已发布</CardTitle>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">草稿</CardTitle>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-500">{posts.length - publishedCount}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>文章列表</CardTitle>
                    <CardDescription>
                        查看、搜索和编辑所有文章。
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                         <Tabs defaultValue="all" className="w-[400px]" onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                             <TabsList>
                                 <TabsTrigger value="all">全部</TabsTrigger>
                                 <TabsTrigger value="published">已发布</TabsTrigger>
                                 <TabsTrigger value="draft">草稿</TabsTrigger>
                             </TabsList>
                         </Tabs>
                         <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative w-full md:w-[300px]">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="搜索..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="排序" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="created_at">创建时间</SelectItem>
                                    <SelectItem value="updated_at">更新时间</SelectItem>
                                    <SelectItem value="title">标题</SelectItem>
                                </SelectContent>
                            </Select>
                         </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[400px]">标题</TableHead>
                                    <TableHead>状态</TableHead>
                                    <TableHead>标签</TableHead>
                                    <TableHead>日期</TableHead>
                                    <TableHead className="text-right">操作</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableLoadingSkeleton rows={5} cols={5} />
                                ) : filteredPosts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">无数据</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPosts.map((post) => (
                                        <TableRow key={post.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span className="truncate max-w-[300px]">{post.title}</span>
                                                    <span className="text-xs text-muted-foreground font-mono">/{post.slug}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className={post.status === 'published' ? 'bg-green-600 hover:bg-green-700' : ''}>
                                                    {post.status === 'published' ? '已发布' : '草稿'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {post.tags?.slice(0, 3).map(tag => (
                                                        <Badge key={tag} variant="outline" className="text-xs font-normal">{tag}</Badge>
                                                    ))}
                                                    {(post.tags?.length || 0) > 3 && <span className="text-xs text-muted-foreground">+{post.tags!.length - 3}</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/posts/edit/${post.id}`)} title="编辑">
                                                        <Edit3 className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleTogglePublish(post)} title={post.status === 'published' ? '撤回' : '发布'}>
                                                        <Send className={`h-4 w-4 ${post.status === 'published' ? 'text-amber-500' : 'text-green-500'}`} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => handleDelete(post.id)} title="删除">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
