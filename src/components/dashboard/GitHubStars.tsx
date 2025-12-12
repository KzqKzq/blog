import { projects } from '../../data/content'
import { DashboardWidget } from './DashboardWidget'

export function GitHubStars() {
    const totalStars = projects.reduce((sum, p) => sum + (p.stars || 0), 0)

    return (
        <DashboardWidget title="Star 数" icon="⭐">
            <div className="github-stars">
                <div className="github-stars__number">{totalStars}</div>
                <div className="github-stars__label">GitHub Stars</div>
            </div>
        </DashboardWidget>
    )
}
