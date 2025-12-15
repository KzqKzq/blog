import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'
import { Save, RefreshCw, Home as HomeIcon, Layout, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Badge } from '@/components/ui/badge'

interface WidgetConfig {
    id: string
    name: string
    enabled: boolean
    order: number
    span: {
        col: number
        row: number
    }
}

interface HomepageConfig {
    id: string
    title: string
    subtitle: string
    hero_title: string | null
    hero_subtitle: string | null
    hero_cta_text: string | null
    hero_cta_link: string | null
    show_hero: boolean
    widgets_config: WidgetConfig[]
    layout_config: {
        gridCols: { sm: number; md: number; lg: number }
        gap: number
        autoRows: string
    }
}

export default function HomepageConfig() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [config, setConfig] = useState<HomepageConfig | null>(null)

    useEffect(() => {
        fetchConfig()
    }, [])

    const fetchConfig = async () => {
        try {
            const { data, error } = await supabase
                .from('homepage_config')
                .select('*')
                .single()

            if (error) throw error
            setConfig(data)
        } catch (error) {
            console.error('Error fetching config:', error)
            toast.error('加载配置失败')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!config) return

        setSaving(true)
        try {
            const { error } = await supabase
                .from('homepage_config')
                .update({
                    title: config.title,
                    subtitle: config.subtitle,
                    hero_title: config.hero_title,
                    hero_subtitle: config.hero_subtitle,
                    hero_cta_text: config.hero_cta_text,
                    hero_cta_link: config.hero_cta_link,
                    show_hero: config.show_hero,
                    widgets_config: config.widgets_config,
                    layout_config: config.layout_config,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', config.id)

            if (error) throw error

            toast.success('配置已保存')
        } catch (error) {
            console.error('Error saving config:', error)
            toast.error('保存失败')
        } finally {
            setSaving(false)
        }
    }

    const toggleWidget = (widgetId: string) => {
        if (!config) return
        
        setConfig({
            ...config,
            widgets_config: config.widgets_config.map(w =>
                w.id === widgetId ? { ...w, enabled: !w.enabled } : w
            )
        })
    }

    const updateWidgetSpan = (widgetId: string, dimension: 'col' | 'row', value: number) => {
        if (!config) return
        
        setConfig({
            ...config,
            widgets_config: config.widgets_config.map(w =>
                w.id === widgetId 
                    ? { ...w, span: { ...w.span, [dimension]: value } }
                    : w
            )
        })
    }

    if (loading) {
        return <LoadingSpinner fullPage size="lg" text="加载配置中..." />
    }

    if (!config) {
        return (
            <div className="p-12 text-center">
                <p className="text-muted-foreground">未找到配置</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <HomeIcon className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Homepage</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">首页配置</h1>
                    <p className="text-muted-foreground mt-1">
                        管理首页仪表板的标题、组件和布局
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchConfig} disabled={saving}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        刷新
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? '保存中...' : '保存配置'}
                    </Button>
                </div>
            </div>

            {/* Basic Info */}
            <Card>
                <CardHeader>
                    <CardTitle>基本信息</CardTitle>
                    <CardDescription>首页标题和描述</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">页面标题</Label>
                        <Input
                            id="title"
                            value={config.title}
                            onChange={(e) => setConfig({ ...config, title: e.target.value })}
                            placeholder="仪表板"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subtitle">页面副标题</Label>
                        <Input
                            id="subtitle"
                            value={config.subtitle}
                            onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                            placeholder="个人状态、项目进度与学习追踪"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Hero Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Hero 区域</CardTitle>
                            <CardDescription>首页顶部大标题区域（可选）</CardDescription>
                        </div>
                        <Switch
                            checked={config.show_hero}
                            onCheckedChange={(checked) => setConfig({ ...config, show_hero: checked })}
                        />
                    </div>
                </CardHeader>
                {config.show_hero && (
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="hero-title">Hero 标题</Label>
                            <Input
                                id="hero-title"
                                value={config.hero_title || ''}
                                onChange={(e) => setConfig({ ...config, hero_title: e.target.value })}
                                placeholder="欢迎来到我的博客"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="hero-subtitle">Hero 副标题</Label>
                            <Textarea
                                id="hero-subtitle"
                                value={config.hero_subtitle || ''}
                                onChange={(e) => setConfig({ ...config, hero_subtitle: e.target.value })}
                                placeholder="分享技术、记录生活"
                                rows={2}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="cta-text">按钮文字</Label>
                                <Input
                                    id="cta-text"
                                    value={config.hero_cta_text || ''}
                                    onChange={(e) => setConfig({ ...config, hero_cta_text: e.target.value })}
                                    placeholder="开始阅读"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cta-link">按钮链接</Label>
                                <Input
                                    id="cta-link"
                                    value={config.hero_cta_link || ''}
                                    onChange={(e) => setConfig({ ...config, hero_cta_link: e.target.value })}
                                    placeholder="/blog"
                                />
                            </div>
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Widgets Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Layout className="w-5 h-5" />
                        组件配置
                    </CardTitle>
                    <CardDescription>启用/禁用组件并调整布局</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {config.widgets_config
                            .sort((a, b) => a.order - b.order)
                            .map((widget) => (
                                <div
                                    key={widget.id}
                                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Switch
                                            checked={widget.enabled}
                                            onCheckedChange={() => toggleWidget(widget.id)}
                                        />
                                        <div>
                                            <p className="font-medium">{widget.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {widget.id}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-xs text-muted-foreground">列:</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                max="4"
                                                value={widget.span.col}
                                                onChange={(e) => updateWidgetSpan(widget.id, 'col', parseInt(e.target.value) || 1)}
                                                className="w-16 h-8"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Label className="text-xs text-muted-foreground">行:</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                max="4"
                                                value={widget.span.row}
                                                onChange={(e) => updateWidgetSpan(widget.id, 'row', parseInt(e.target.value) || 1)}
                                                className="w-16 h-8"
                                            />
                                        </div>
                                        <Badge variant={widget.enabled ? "default" : "secondary"}>
                                            {widget.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>

            {/* Layout Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle>布局设置</CardTitle>
                    <CardDescription>网格布局参数</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="grid-sm">小屏列数</Label>
                            <Input
                                id="grid-sm"
                                type="number"
                                min="1"
                                max="4"
                                value={config.layout_config.gridCols.sm}
                                onChange={(e) => setConfig({
                                    ...config,
                                    layout_config: {
                                        ...config.layout_config,
                                        gridCols: {
                                            ...config.layout_config.gridCols,
                                            sm: parseInt(e.target.value) || 1
                                        }
                                    }
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="grid-md">中屏列数</Label>
                            <Input
                                id="grid-md"
                                type="number"
                                min="1"
                                max="4"
                                value={config.layout_config.gridCols.md}
                                onChange={(e) => setConfig({
                                    ...config,
                                    layout_config: {
                                        ...config.layout_config,
                                        gridCols: {
                                            ...config.layout_config.gridCols,
                                            md: parseInt(e.target.value) || 2
                                        }
                                    }
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="grid-lg">大屏列数</Label>
                            <Input
                                id="grid-lg"
                                type="number"
                                min="1"
                                max="6"
                                value={config.layout_config.gridCols.lg}
                                onChange={(e) => setConfig({
                                    ...config,
                                    layout_config: {
                                        ...config.layout_config,
                                        gridCols: {
                                            ...config.layout_config.gridCols,
                                            lg: parseInt(e.target.value) || 4
                                        }
                                    }
                                })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="gap">间距 (rem)</Label>
                            <Input
                                id="gap"
                                type="number"
                                min="0"
                                max="8"
                                step="0.5"
                                value={config.layout_config.gap}
                                onChange={(e) => setConfig({
                                    ...config,
                                    layout_config: {
                                        ...config.layout_config,
                                        gap: parseFloat(e.target.value) || 4
                                    }
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="auto-rows">行高</Label>
                            <Input
                                id="auto-rows"
                                value={config.layout_config.autoRows}
                                onChange={(e) => setConfig({
                                    ...config,
                                    layout_config: {
                                        ...config.layout_config,
                                        autoRows: e.target.value
                                    }
                                })}
                                placeholder="180px"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
