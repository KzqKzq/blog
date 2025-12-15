import { projects } from '../../data/content'
import { DashboardWidget } from './DashboardWidget'

export function GitHubStars() {
    const totalStars = projects.reduce((sum, p) => sum + (p.stars || 0), 0)

    return (
        <DashboardWidget title="Star 数" icon="⭐">
            <div className="flex flex-col items-center justify-center h-full pb-2">
                <div className="text-4xl font-bold tracking-tight text-primary">{totalStars}</div>
                <div className="text-xs text-muted-foreground mt-1">GitHub Stars</div>
            </div>
        </DashboardWidget>
    )
}
