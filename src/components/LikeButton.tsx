import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
  articleId?: string
  initialLikes?: number
}

export function LikeButton({ articleId, initialLikes = 0 }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [hasLiked, setHasLiked] = useState(false)
  const [showParticles, setShowParticles] = useState(false)

  useEffect(() => {
    if (articleId) {
      const stored = localStorage.getItem(`like-${articleId}`)
      if (stored) {
        setHasLiked(true)
      }
    }
  }, [articleId])

  const handleLike = () => {
    if (!articleId) return

    if (!hasLiked) {
      setLikes(prev => prev + 1)
      setHasLiked(true)
      setShowParticles(true)
      localStorage.setItem(`like-${articleId}`, 'true')
      
      // Reset particles
      setTimeout(() => setShowParticles(false), 1000)
    } else {
      // Optional: Allow unlike
      setLikes(prev => Math.max(0, prev - 1))
      setHasLiked(false)
      localStorage.removeItem(`like-${articleId}`)
    }
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "gap-2 glass-button transition-all duration-300",
          hasLiked && "text-red-500 border-red-500/20 bg-red-500/5 hover:bg-red-500/10"
        )}
        onClick={handleLike}
      >
        <motion.div
          animate={hasLiked ? { scale: [1, 1.5, 1] } : {}}
          transition={{ duration: 0.4 }}
        >
          <Heart className={cn("h-4 w-4", hasLiked && "fill-current")} />
        </motion.div>
        <span>{likes > 0 ? likes : '点赞'}</span>
      </Button>

      {/* Particles Animation */}
      <AnimatePresence>
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{ 
                  opacity: 0, 
                  scale: 1, 
                  x: (Math.random() - 0.5) * 40, 
                  y: -20 - Math.random() * 20 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-red-500"
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
