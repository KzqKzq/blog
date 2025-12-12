import { currentlyPlaying } from '../../data/dashboard'
import { DashboardWidget } from './DashboardWidget'

export function CurrentlyPlaying() {
    return (
        <DashboardWidget title="正在听" icon="🎵">
            <div className="currently-playing">
                {currentlyPlaying.isPlaying && (
                    <div className="currently-playing__animation">
                        <div className="currently-playing__bar" />
                        <div className="currently-playing__bar" />
                        <div className="currently-playing__bar" />
                    </div>
                )}
                <div className="currently-playing__track">{currentlyPlaying.track}</div>
                <div className="currently-playing__artist">{currentlyPlaying.artist}</div>
            </div>
        </DashboardWidget>
    )
}
