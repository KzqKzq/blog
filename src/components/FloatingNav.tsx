import { useEffect, useState, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './FloatingNav.css'

const navItems = [
    { path: '/', label: '首页', icon: '🏠' },
    { path: '/blog', label: '博客', icon: '📝' },
    { path: '/projects', label: '作品', icon: '🚀' },
    { path: '/essays', label: '随笔', icon: '✍️' },
    { path: '/about', label: '关于', icon: '👤' },
]

export function FloatingNav() {
    const [visible, setVisible] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const location = useLocation()

    // Hide when route changes
    useEffect(() => {
        setExpanded(false)
        setVisible(false)
    }, [location.pathname])

    // Show on scroll, hide after timeout
    useEffect(() => {
        const handleScroll = () => {
            setVisible(true)

            // Clear existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }

            // Hide after 2.5 seconds of no scrolling
            timeoutRef.current = setTimeout(() => {
                setVisible(false)
                setExpanded(false)
            }, 2500)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', handleScroll)
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    const handleToggle = () => {
        setExpanded((prev) => !prev)
        // Reset timeout when interacting
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
            setVisible(false)
            setExpanded(false)
        }, 4000)
    }

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="floating-nav"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                    <AnimatePresence>
                        {expanded && (
                            <motion.div
                                className="floating-nav__menu"
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `floating-nav__item ${isActive ? 'floating-nav__item--active' : ''}`
                                        }
                                    >
                                        <span className="floating-nav__icon">{item.icon}</span>
                                        <span className="floating-nav__label">{item.label}</span>
                                    </NavLink>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="button"
                        className={`floating-nav__trigger ${expanded ? 'floating-nav__trigger--open' : ''}`}
                        onClick={handleToggle}
                        aria-label="导航菜单"
                    >
                        <span className="floating-nav__trigger-icon">
                            {expanded ? '✕' : '☰'}
                        </span>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
