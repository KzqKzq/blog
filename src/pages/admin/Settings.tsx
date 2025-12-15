import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'
import { Save, RefreshCw, Settings as SettingsIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function Settings() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    
    // Settings State
    const [siteInfo, setSiteInfo] = useState({
        title: '',
        description: '',
        logo_url: ''
    })
    
    const [commentSettings, setCommentSettings] = useState({
        enabled: true,
        require_moderation: true
    })

    const [seoDefaults, setSeoDefaults] = useState({
        meta_description: '',
        keywords: ''
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')

            if (error) throw error

            const settingsMap = (data || []).reduce((acc, curr) => {
                acc[curr.key] = curr.value
                return acc
            }, {} as Record<string, any>)

            if (settingsMap.site_info) setSiteInfo(settingsMap.site_info)
            if (settingsMap.comment_settings) setCommentSettings(settingsMap.comment_settings)
            if (settingsMap.seo_defaults) setSeoDefaults(settingsMap.seo_defaults)

        } catch (error) {
            console.error('Error fetching settings:', error)
            toast.error('无法加载设置')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const updates = [
                { key: 'site_info', value: siteInfo },
                { key: 'comment_settings', value: commentSettings },
                { key: 'seo_defaults', value: seoDefaults }
            ]

            const { error } = await supabase
                .from('site_settings')
                .upsert(updates)

            if (error) throw error
            toast.success('设置已保存')
        } catch (error) {
            console.error('Error saving settings:', error)
            toast.error('保存失败')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <LoadingSpinner fullPage size="lg" text="加载设置中..." />
    }

    return (
        <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                     <div className="flex items-center gap-2 mb-1">
                        <SettingsIcon className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Configuration</span>
                     </div>
                    <h1 className="text-3xl font-bold tracking-tight">站点设置</h1>
                    <p className="text-muted-foreground mt-1">
                        配置网站的基本信息、功能开关与 SEO 默认值。
                    </p>
                </div>
                <div className="flex items-center">
                     <Button onClick={handleSave} disabled={saving}>
                        {saving ? <RefreshCw className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                        {saving ? '保存中...' : '保存更改'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>基本信息</CardTitle>
                        <CardDescription>网站的全局显示设置</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label>网站标题</Label>
                            <Input 
                                value={siteInfo.title} 
                                onChange={(e) => setSiteInfo({...siteInfo, title: e.target.value})}
                                placeholder="我的博客"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>网站描述</Label>
                            <Input 
                                value={siteInfo.description} 
                                onChange={(e) => setSiteInfo({...siteInfo, description: e.target.value})}
                                placeholder="一句话描述..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Logo URL</Label>
                            <Input 
                                value={siteInfo.logo_url} 
                                onChange={(e) => setSiteInfo({...siteInfo, logo_url: e.target.value})}
                                placeholder="https://..."
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>评论功能</CardTitle>
                        <CardDescription>控制全站评论系统的行为</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <Label className="text-base">启用评论</Label>
                                <p className="text-xs text-muted-foreground">关闭后所有文章将隐藏评论区</p>
                            </div>
                            <Switch 
                                checked={commentSettings.enabled} 
                                onCheckedChange={(v) => setCommentSettings({...commentSettings, enabled: v})}
                            />
                        </div>
                        
                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <Label className="text-base">必须审核</Label>
                                <p className="text-xs text-muted-foreground">新评论需管理员批准后才显示</p>
                            </div>
                            <Switch 
                                checked={commentSettings.require_moderation} 
                                onCheckedChange={(v) => setCommentSettings({...commentSettings, require_moderation: v})}
                            />
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>SEO 默认设置</CardTitle>
                        <CardDescription>搜索引擎优化的默认值</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="grid gap-2">
                            <Label>默认 Meta Description</Label>
                            <Textarea 
                                value={seoDefaults.meta_description}
                                onChange={(e) => setSeoDefaults({...seoDefaults, meta_description: e.target.value})}
                                placeholder="默认的页面描述..."
                                rows={3}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>默认 Keywords</Label>
                            <Input 
                                value={seoDefaults.keywords} 
                                onChange={(e) => setSeoDefaults({...seoDefaults, keywords: e.target.value})}
                                placeholder="博客, 技术, 生活..."
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
