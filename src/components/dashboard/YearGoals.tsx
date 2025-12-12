import { yearGoals } from '../../data/dashboard'
import { DashboardWidget } from './DashboardWidget'

export function YearGoals() {
    return (
        <DashboardWidget title="2024 年度目标" icon="🎯">
            <div className="year-goals">
                {yearGoals.map((goal) => (
                    <div key={goal.title} className="year-goals__item">
                        <span className="year-goals__icon">{goal.icon}</span>
                        <div className="year-goals__info">
                            <div className="year-goals__title">{goal.title}</div>
                            <div className="year-goals__bar">
                                <div
                                    className={`year-goals__bar-fill ${goal.progress >= 100 ? 'year-goals__bar-fill--complete' : ''}`}
                                    style={{ width: `${Math.min(goal.progress, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardWidget>
    )
}
