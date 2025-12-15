import { motion } from 'framer-motion'
import {
  GitHubHeatmap,
  TravelMap,
  TechRadar,
  YearGoals,
  ReadingList,
  ProjectProgress,
  WritingStats,
  GitHubStars,
  CurrentlyPlaying,
  CurrentStatus,
  CoffeeCounter,
} from '../components/dashboard'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="flex flex-col gap-6 p-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">仪表板</h1>
          <p className="text-muted-foreground mt-1">
            个人状态、项目进度与学习追踪
          </p>
        </div>
        {/* Reset button removed as layout is now static/responsive */}
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px]"
      >
        {/* Row 1 */}
        <motion.div variants={item} className="col-span-1 lg:col-span-2 row-span-2">
           <GitHubHeatmap />
        </motion.div>
        <motion.div variants={item} className="col-span-1 row-span-2">
           <TravelMap />
        </motion.div>
        <motion.div variants={item} className="col-span-1 row-span-2">
           <TechRadar />
        </motion.div>

        {/* Row 2 */}
        <motion.div variants={item} className="col-span-1 row-span-2">
           <ProjectProgress />
        </motion.div>
        <motion.div variants={item} className="col-span-1 lg:col-span-2 row-span-2">
           <ReadingList />
        </motion.div>
        <motion.div variants={item} className="col-span-1">
           <WritingStats />
        </motion.div>
        <motion.div variants={item} className="col-span-1">
           <CoffeeCounter />
        </motion.div>

        {/* Row 3 - Small widgets */}
        <motion.div variants={item} className="col-span-1">
           <GitHubStars />
        </motion.div>
        <motion.div variants={item} className="col-span-1">
           <CurrentlyPlaying />
        </motion.div>
        <motion.div variants={item} className="col-span-1">
           <CurrentStatus />
        </motion.div>
        <motion.div variants={item} className="col-span-1">
           <YearGoals />
        </motion.div>

      </motion.div>
    </div>
  )
}
