import { coffeeStats } from '../../data/dashboard'
import { DashboardWidget } from './DashboardWidget'

export function CoffeeCounter() {
    const cups = '☕'.repeat(Math.min(coffeeStats.today, 5))

    return (
        <DashboardWidget title="咖啡" icon="☕">
            <div className="coffee-counter">
                <div className="coffee-counter__cups">{cups}</div>
                <div className="coffee-counter__number">{coffeeStats.thisMonth}</div>
                <div className="coffee-counter__label">本月杯数</div>
            </div>
        </DashboardWidget>
    )
}
