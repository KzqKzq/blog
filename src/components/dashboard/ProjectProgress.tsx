import { projects } from '../../data/content'
import { DashboardWidget } from './DashboardWidget'
import { ScrollArea } from '@/components/ui/scroll-area'

export function ProjectProgress() {
    // Simulate project progress
    const projectsWithProgress = projects.slice(0, 5).map((project, index) => ({
        ...project,
        progress: [100, 75, 40, 90, 25][index % 5] || 50,
    }))

    return (
        <DashboardWidget title="项目进度" icon="🚀">
            <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                    {projectsWithProgress.map((project) => (
                        <div key={project.id} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-medium truncate max-w-[70%]">{project.name}</span>
                                <span className="text-muted-foreground font-mono">{project.progress}%</span>
                            </div>
                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary/80 transition-all duration-500"
                                    style={{ width: `${project.progress}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </DashboardWidget>
    )
}
