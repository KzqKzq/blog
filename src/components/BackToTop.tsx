import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './BackToTop.css'

export function BackToTop() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            // Show button when scrolled down 400px
            setVisible(window.scrollY > 400)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    type="button"
                    className="back-to-top"
                    onClick={scrollToTop}
                    aria-label="返回顶部"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                >
                    <span className="back-to-top__icon">↑</span>
                </motion.button>
            )}
        </AnimatePresence>
    )
}
