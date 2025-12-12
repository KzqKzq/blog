import { projects } from '../../data/content'
import { DashboardWidget } from './DashboardWidget'

export function ProjectProgress() {
    // Simulate project progress
    const projectsWithProgress = projects.map((project, index) => ({
        ...project,
        progress: [100, 75, 40][index] || 50,
    }))

    return (
        <DashboardWidget title="项目进度" icon="🚀">
            <div className="project-progress">
                {projectsWithProgress.map((project) => (
                    <div key={project.id} className="project-progress__item">
                        <div className="project-progress__header">
                            <span className="project-progress__name">{project.name}</span>
                            <span className="project-progress__percent">{project.progress}%</span>
                        </div>
                        <div className="project-progress__bar">
                            <div
                                className="project-progress__bar-fill"
                                style={{ width: `${project.progress}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </DashboardWidget>
    )
}
