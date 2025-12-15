import { skills } from '../../data/dashboard'
import { DashboardWidget } from './DashboardWidget'
import { ScrollArea } from '@/components/ui/scroll-area'

export function TechRadar() {
    const sortedSkills = [...skills].sort((a, b) => b.level - a.level)

    return (
        <DashboardWidget title="技术栈" icon="🎯">
            <ScrollArea className="h-full pr-4">
                <div className="space-y-3">
                    {sortedSkills.map((skill) => (
                        <div key={skill.name} className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="font-medium">{skill.name}</span>
                                <span className="text-muted-foreground">{skill.level}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${skill.level}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </DashboardWidget>
    )
}
