import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ZoomImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt?: string
  src?: string
  className?: string
}

export function ZoomImage({ src, alt, className, ...props }: ZoomImageProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!src) return null

  return (
    <>
      {/* Thumbnail */}
      <div 
        className={cn(
          "relative group cursor-zoom-in rounded-lg overflow-hidden my-6 transition-all hover:shadow-lg", 
          className
        )}
        onClick={() => setIsOpen(true)}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto rounded-lg transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
          {...props}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm">
            <ZoomIn className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Fullscreen Overlay - Portalled to body to escape stacking contexts */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-10 cursor-zoom-out"
              onClick={() => setIsOpen(false)}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpen(false)
                }}
              >
                <X className="w-6 h-6" />
              </button>

              {/* Large Image */}
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                src={src}
                alt={alt}
                className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
              />
              
              {/* Caption */}
              {alt && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  delay={0.2}
                  className="absolute bottom-6 left-0 right-0 text-center text-white/80 text-sm font-medium px-4"
                >
                  {alt}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
