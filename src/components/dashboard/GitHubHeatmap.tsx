import { useEffect, useState } from 'react'
import { githubUsername } from '../../data/dashboard'
import { DashboardWidget } from './DashboardWidget'
import { Skeleton } from '@/components/ui/skeleton'

interface ContributionDay {
    date: string
    count: number
    level: number
}

interface ContributionWeek {
    days: ContributionDay[]
}

export function GitHubHeatmap() {
    const [contributions, setContributions] = useState<ContributionWeek[]>([])
    const [totalContributions, setTotalContributions] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchContributions = async () => {
            try {
                // Generate mock data
                const weeks: ContributionWeek[] = []
                const today = new Date()
                let total = 0

                for (let w = 0; w < 20; w++) { // Show fewer weeks for simpler UI
                    const days: ContributionDay[] = []
                    for (let d = 0; d < 7; d++) {
                        const date = new Date(today)
                        date.setDate(date.getDate() - (20 - w) * 7 - (6 - d))

                        const rand = Math.random()
                        let count = 0
                        let level = 0
                        const isWeekend = d === 0 || d === 6
                        const activityChance = isWeekend ? 0.3 : 0.7

                        if (rand < activityChance) {
                            if (rand < 0.1) { count = Math.floor(Math.random() * 5) + 10; level = 4 }
                            else if (rand < 0.25) { count = Math.floor(Math.random() * 5) + 5; level = 3 }
                            else if (rand < 0.45) { count = Math.floor(Math.random() * 3) + 2; level = 2 }
                            else { count = 1; level = 1 }
                        }

                        total += count
                        days.push({
                            date: date.toISOString().split('T')[0],
                            count,
                            level,
                        })
                    }
                    weeks.push({ days })
                }

                setContributions(weeks)
                setTotalContributions(total)
                setLoading(false)
            } catch (error) {
                console.error('Failed to fetch contributions:', error)
                setLoading(false)
            }
        }

        fetchContributions()
    }, [])

    if (loading) {
        return (
            <DashboardWidget title="代码活动" icon="📊">
                <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-[100px] w-full" />
                </div>
            </DashboardWidget>
        )
    }

    const getLevelColor = (level: number) => {
        switch (level) {
            case 1: return 'bg-emerald-200 dark:bg-emerald-900'
            case 2: return 'bg-emerald-300 dark:bg-emerald-700'
            case 3: return 'bg-emerald-400 dark:bg-emerald-600'
            case 4: return 'bg-emerald-500 dark:bg-emerald-500'
            default: return 'bg-secondary'
        }
    }

    return (
        <DashboardWidget title="代码活动" icon="📊">
            <div className="flex flex-col h-full justify-between">
                <div className="flex gap-1 overflow-hidden h-full items-center">
                    {contributions.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {week.days.map((day, dayIndex) => (
                                <div
                                    key={dayIndex}
                                    className={`w-2.5 h-2.5 rounded-sm ${getLevelColor(day.level)}`}
                                    title={`${day.date}: ${day.count} contributions`}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                <div className="flex justify-between items-end text-xs text-muted-foreground mt-2">
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-foreground">{totalContributions}</span>
                        <span>年度贡献</span>
                    </div>
                    <div className="text-right">
                        <div className="font-medium text-primary">@{githubUsername}</div>
                        <div>GitHub</div>
                    </div>
                </div>
            </div>
        </DashboardWidget>
    )
}
