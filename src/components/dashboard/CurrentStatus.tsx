import { currentStatus } from '../../data/dashboard'
import { DashboardWidget } from './DashboardWidget'

export function CurrentStatus() {
    return (
        <DashboardWidget title="当前状态" icon="💭">
            <div className="current-status">
                <div className="current-status__emoji">🎯</div>
                <div className="current-status__text">{currentStatus.status}</div>
                <div className="current-status__activity">{currentStatus.activity}</div>
            </div>
        </DashboardWidget>
    )
}
