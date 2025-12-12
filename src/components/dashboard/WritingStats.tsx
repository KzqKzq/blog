import { posts, essays } from '../../data/content'
import { DashboardWidget } from './DashboardWidget'

export function WritingStats() {
    const totalArticles = posts.length + essays.length

    return (
        <DashboardWidget title="写作" icon="✍️">
            <div className="writing-stats">
                <div className="writing-stats__number">{totalArticles}</div>
                <div className="writing-stats__label">篇文章</div>
            </div>
        </DashboardWidget>
    )
}
