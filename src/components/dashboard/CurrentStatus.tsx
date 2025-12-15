import { currentStatus } from '../../data/dashboard'
import { DashboardWidget } from './DashboardWidget'

export function CurrentStatus() {
    return (
        <DashboardWidget title="当前状态" icon="💭">
            <div className="flex flex-col items-center justify-center h-full pb-2 text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-medium text-sm">{currentStatus.status}</div>
                <div className="text-xs text-muted-foreground mt-1">{currentStatus.activity}</div>
            </div>
        </DashboardWidget>
    )
}
