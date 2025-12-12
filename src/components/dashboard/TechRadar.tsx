import { skills } from '../../data/dashboard'
import { DashboardWidget } from './DashboardWidget'

export function TechRadar() {
    const sortedSkills = [...skills].sort((a, b) => b.level - a.level).slice(0, 8)

    return (
        <DashboardWidget title="技术栈" icon="🎯">
            <div className="tech-radar__list">
                {sortedSkills.map((skill) => (
                    <div key={skill.name} className="tech-radar__skill">
                        <span className="tech-radar__name">{skill.name}</span>
                        <div className="tech-radar__bar">
                            <div
                                className="tech-radar__bar-fill"
                                style={{ width: `${skill.level}%` }}
                            />
                        </div>
                        <span className="tech-radar__level">{skill.level}%</span>
                    </div>
                ))}
            </div>
        </DashboardWidget>
    )
}
