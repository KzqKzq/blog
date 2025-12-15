import { yearGoals } from '../../data/dashboard'
import { DashboardWidget } from './DashboardWidget'
import { ScrollArea } from '@/components/ui/scroll-area'

export function YearGoals() {
    return (
        <DashboardWidget title="2024 年度目标" icon="🎯">
            <ScrollArea className="h-full pr-4">
                <div className="space-y-3">
                    {yearGoals.map((goal) => (
                        <div key={goal.title} className="flex items-start gap-3">
                             <div className="text-xl pt-0.5">{goal.icon}</div>
                             <div className="flex-1 space-y-1">
                                <div className="text-xs font-medium flex justify-between">
                                    <span>{goal.title}</span>
                                    <span className="text-muted-foreground">{goal.progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 rounded-full ${goal.progress >= 100 ? 'bg-green-500' : 'bg-primary'}`}
                                        style={{ width: `${Math.min(goal.progress, 100)}%` }}
                                    />
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </DashboardWidget>
    )
}
