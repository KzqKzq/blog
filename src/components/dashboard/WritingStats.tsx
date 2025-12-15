import { posts, essays } from '../../data/content'
import { DashboardWidget } from './DashboardWidget'

export function WritingStats() {
    const totalArticles = posts.length + essays.length

    return (
        <DashboardWidget title="写作" icon="✍️">
            <div className="flex flex-col items-center justify-center h-full pb-2">
                <div className="text-4xl font-bold tracking-tight">{totalArticles}</div>
                <div className="text-xs text-muted-foreground mt-1">篇文章</div>
            </div>
        </DashboardWidget>
    )
}
