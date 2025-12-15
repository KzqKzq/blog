import { coffeeStats } from '../../data/dashboard'
import { DashboardWidget } from './DashboardWidget'

export function CoffeeCounter() {
    const cups = '☕'.repeat(Math.min(coffeeStats.today, 5))

    return (
        <DashboardWidget title="咖啡" icon="☕">
            <div className="flex flex-col items-center justify-center h-full pb-2">
                <div className="text-2xl mb-1 tracking-widest">{cups}</div>
                <div className="text-2xl font-bold">{coffeeStats.thisMonth}</div>
                <div className="text-xs text-muted-foreground mt-1">本月杯数</div>
            </div>
        </DashboardWidget>
    )
}
