import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, Post } from '../../lib/supabase'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { 
    Plus, 
    Search, 
    MoreHorizontal, 
    FileEdit, 
    Trash2, 
    Eye, 
    EyeOff
} from 'lucide-react'
import { TableLoadingSkeleton } from '@/components/ui/loading-spinner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

type StatusFilter = 'all' | 'published' | 'draft'
type SortKey = 'created_at' | 'updated_at' | 'title'

export default function PostsList() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
    const [sortBy, setSortBy] = useState<SortKey>('created_at')
    const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc')
    const [actionId, setActionId] = useState<string | null>(null)

    const navigate = useNavigate()

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setPosts(data || [])
        } catch (error) {
            console.error('Error fetching posts:', error)
            toast.error('无法加载文章列表')
        } finally {
            setLoading(false)
        }
    }

    const filteredPosts = useMemo(() => {
        const term = searchTerm.trim().toLowerCase()
        const filtered = posts.filter((post) => {
            const matchesSearch =
                !term ||
                post.title.toLowerCase().includes(term) ||
                post.slug.toLowerCase().includes(term) ||
                (post.excerpt || '').toLowerCase().includes(term) ||
                (post.tags || []).some((tag) => tag.toLowerCase().includes(term))

            const matchesStatus =
                statusFilter === 'all'
                    ? true
                    : statusFilter === 'published'
                        ? post.status === 'published'
                        : post.status === 'draft'

            return matchesSearch && matchesStatus
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
    }, [posts, searchTerm, statusFilter, sortBy, sortDirection])

    const handleDelete = async (id: string) => {
        if (!confirm('确定删除这篇文章吗？')) return

        setActionId(id)
        try {
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', id)

            if (error) throw error
            setPosts((prev) => prev.filter((p) => p.id !== id))
            toast.success('文章已删除')
        } catch (error) {
            console.error('删除文章失败:', error)
            toast.error('删除失败，请稍后再试')
        } finally {
            setActionId(null)
        }
    }

    const handleTogglePublish = async (post: Post) => {
        setActionId(post.id)
        const newStatus = post.status === 'published' ? 'draft' : 'published'
        
        try {
            const { error } = await supabase
                .from('posts')
                .update({ status: newStatus })
                .eq('id', post.id)

            if (error) throw error
            setPosts((prev) =>
                prev.map((item) =>
                    item.id === post.id ? { ...item, status: newStatus } : item
                )
            )
            toast.success(newStatus === 'published' ? '文章已发布' : '文章已转为草稿')
        } catch (error) {
            console.error('更新发布状态失败:', error)
            toast.error('更新发布状态失败')
        } finally {
            setActionId(null)
        }
    }

    return (
        <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">文章列表</h1>
                    <p className="text-muted-foreground mt-1">
                        查看和管理所有文章内容。
                    </p>
                </div>
                <div className="flex items-center">
                    <Button onClick={() => navigate('/admin/posts/new')}>
                        <Plus className="mr-2 h-4 w-4" /> 新建文章
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>筛选与排序</CardTitle>
                    <CardDescription>管理 {posts.length} 篇文章</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="搜索标题、链接或标签..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="flex gap-2">
                             <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                                <SelectTrigger className="w-[130px]">
                                    <SelectValue placeholder="状态" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">全部状态</SelectItem>
                                    <SelectItem value="published">已发布</SelectItem>
                                    <SelectItem value="draft">草稿</SelectItem>
                                </SelectContent>
                            </Select>

                             <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="排序方式" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="created_at">创建时间</SelectItem>
                                    <SelectItem value="updated_at">更新时间</SelectItem>
                                    <SelectItem value="title">标题</SelectItem>
                                </SelectContent>
                            </Select>
                            
                             <Select value={sortDirection} onValueChange={(v) => setSortDirection(v as 'asc' | 'desc')}>
                                <SelectTrigger className="w-[110px]">
                                    <SelectValue placeholder="顺序" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="desc">降序</SelectItem>
                                    <SelectItem value="asc">升序</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[400px]">文章信息</TableHead>
                                    <TableHead>状态</TableHead>
                                    <TableHead>标签</TableHead>
                                    <TableHead className="text-right">创建时间</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableLoadingSkeleton rows={5} cols={5} />
                                ) : filteredPosts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            没有找到匹配的文章
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPosts.map((post) => (
                                        <TableRow key={post.id} className="group">
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-medium truncate max-w-[380px]" title={post.title}>{post.title}</span>
                                                    <span className="text-xs text-muted-foreground font-mono truncate max-w-[380px]">/{post.slug}</span>
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
                                                        <Badge key={tag} variant="outline" className="text-xs py-0 h-5">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                    {post.tags && post.tags.length > 3 && (
                                                        <span className="text-xs text-muted-foreground">+{post.tags.length - 3}</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground font-mono text-xs">
                                                {format(new Date(post.created_at), 'yyyy-MM-dd')}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">打开菜单</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>操作</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => navigate(`/admin/posts/edit/${post.id}`)}>
                                                            <FileEdit className="mr-2 h-4 w-4" /> 编辑
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleTogglePublish(post)}>
                                                            {post.status === 'published' ? 
                                                                <><EyeOff className="mr-2 h-4 w-4" /> 撤回发布</> : 
                                                                <><Eye className="mr-2 h-4 w-4" /> 发布文章</>
                                                            }
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem 
                                                            onClick={() => handleDelete(post.id)}
                                                            className="text-destructive focus:text-destructive"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> 删除
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
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
