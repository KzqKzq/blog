import { currentlyPlaying } from '../../data/dashboard'
import { DashboardWidget } from './DashboardWidget'
import { motion } from 'framer-motion'

export function CurrentlyPlaying() {
    return (
        <DashboardWidget title="正在听" icon="🎵">
            <div className="flex flex-col items-center justify-center h-full pb-2 text-center">
                {currentlyPlaying.isPlaying && (
                    <div className="flex items-end gap-1 h-4 mb-2">
                        <motion.div 
                            className="w-1 bg-primary rounded-full"
                            animate={{ height: [4, 12, 4] }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div 
                            className="w-1 bg-primary rounded-full"
                            animate={{ height: [8, 16, 6] }}
                            transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                        />
                         <motion.div 
                            className="w-1 bg-primary rounded-full"
                            animate={{ height: [6, 12, 4] }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                        />
                    </div>
                )}
                <div className="font-medium text-sm truncate w-full px-2" title={currentlyPlaying.track}>
                    {currentlyPlaying.track}
                </div>
                <div className="text-xs text-muted-foreground mt-1 truncate w-full px-2">
                    {currentlyPlaying.artist}
                </div>
            </div>
        </DashboardWidget>
    )
}
