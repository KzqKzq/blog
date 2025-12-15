import { useEffect, useState } from 'react'
import { supabase, Comment } from '../../lib/supabase'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Check, X, AlertTriangle, Trash2, MessageSquare, Undo, RefreshCw } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function CommentsList() {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'spam'>('pending')
    const [actionId, setActionId] = useState<string | null>(null)

    useEffect(() => {
        fetchComments()
    }, [filter])

    const fetchComments = async () => {
        setLoading(true)
        try {
            let query = supabase
                .from('comments')
                .select('*')
                .order('created_at', { ascending: false })

            if (filter !== 'all') {
                query = query.eq('status', filter)
            }

            const { data, error } = await query

            if (error) throw error
            setComments(data || [])
        } catch (error) {
            console.error('Error fetching comments:', error)
            toast.error('无法加载评论')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (id: string, newStatus: Comment['status']) => {
        setActionId(id)
        try {
            const { error } = await supabase
                .from('comments')
                .update({ status: newStatus })
                .eq('id', id)

            if (error) throw error

            setComments((prev) =>
                prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
            )
            toast.success('评论状态已更新')
            
            // If we are filtering by status, remove it from list
            if (filter !== 'all' && filter !== newStatus) {
                setComments(prev => prev.filter(c => c.id !== id))
            }

        } catch (error) {
            console.error('Error updating comment:', error)
            toast.error('更新失败')
        } finally {
            setActionId(null)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('确定删除这条评论吗？')) return

        setActionId(id)
        try {
            const { error } = await supabase.from('comments').delete().eq('id', id)
            if (error) throw error

            setComments((prev) => prev.filter((c) => c.id !== id))
            toast.success('评论已删除')
        } catch (error) {
            console.error('Error deleting comment:', error)
            toast.error('删除失败')
        } finally {
            setActionId(null)
        }
    }

    const getStatusInfo = (status: Comment['status']) => {
        switch (status) {
            case 'approved': return { label: '已批准', color: 'bg-green-600' }
            case 'pending': return { label: '待审核', color: 'bg-yellow-500' }
            case 'spam': return { label: '垃圾评论', color: 'bg-red-500' }
            default: return { label: status, color: 'bg-gray-500' }
        }
    }

    return (
        <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                 <div>
                    <h1 className="text-3xl font-bold tracking-tight">评论审核</h1>
                    <p className="text-muted-foreground mt-1">
                        管理访客留言，过滤垃圾信息，保持讨论区的健康与活力。
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex gap-4 items-center w-full">
                        <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="筛选状态" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">全部评论</SelectItem>
                                <SelectItem value="pending">待审核</SelectItem>
                                <SelectItem value="approved">已批准</SelectItem>
                                <SelectItem value="spam">垃圾评论</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="ghost" onClick={fetchComments} disabled={loading} size="sm">
                            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> 刷新
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                     {loading ? (
                        <LoadingSpinner className="py-20" text="加载评论中..." />
                    ) : comments.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center gap-2 text-muted-foreground bg-muted/20 rounded-lg border border-dashed m-4">
                            <MessageSquare className="w-10 h-10 opacity-20" />
                            <p>没有找到相关评论</p>
                        </div>
                    ) : (
                        <div className="space-y-4 mt-4">
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex flex-col gap-4 p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback className="bg-primary/10 text-primary">{comment.author_name.charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="text-sm font-semibold">{comment.author_name}</div>
                                                <div className="text-xs text-muted-foreground">{comment.author_email}</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <Badge className={getStatusInfo(comment.status).color}>
                                                {getStatusInfo(comment.status).label}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {format(new Date(comment.created_at), 'yyyy-MM-dd HH:mm')}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="text-sm pl-12 text-foreground/90 leading-relaxed">
                                        {comment.content}
                                    </div>

                                    <div className="flex justify-end gap-2 pl-12 pt-2 border-t mt-2">
                                        {comment.status === 'pending' && (
                                            <>
                                                <Button size="sm" variant="default" onClick={() => handleUpdateStatus(comment.id, 'approved')} disabled={!!actionId}>
                                                    <Check className="mr-1 h-3 w-3" /> 批准
                                                </Button>
                                                <Button size="sm" variant="secondary" onClick={() => handleUpdateStatus(comment.id, 'spam')} disabled={!!actionId}>
                                                    <AlertTriangle className="mr-1 h-3 w-3" /> 标记垃圾
                                                </Button>
                                            </>
                                        )}
                                        {comment.status === 'approved' && (
                                            <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(comment.id, 'pending')} disabled={!!actionId}>
                                                <Undo className="mr-1 h-3 w-3" /> 撤回审核
                                            </Button>
                                        )}
                                        {comment.status === 'spam' && (
                                            <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(comment.id, 'pending')} disabled={!!actionId}>
                                                <Undo className="mr-1 h-3 w-3" /> 并非垃圾
                                            </Button>
                                        )}
                                        
                                        <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(comment.id)} disabled={!!actionId}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
