import { useEffect, useState, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, PenTool, FolderGit2, BookOpen, User, X, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/blog', label: '博客', icon: PenTool },
    { path: '/projects', label: '作品', icon: FolderGit2 },
    { path: '/essays', label: '随笔', icon: BookOpen },
    { path: '/about', label: '关于', icon: User },
]

export function FloatingNav() {
    const [visible, setVisible] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
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

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }

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
                    className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                    <AnimatePresence>
                        {expanded && (
                            <motion.div
                                className="flex flex-col gap-2 p-2 bg-background/80 backdrop-blur-md border border-border rounded-lg shadow-lg mb-2"
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
                                            cn(
                                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted",
                                                isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
                                            )
                                        }
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </NavLink>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Button
                        size="icon"
                        className="rounded-full h-12 w-12 shadow-lg"
                        onClick={handleToggle}
                        aria-label="导航菜单"
                    >
                        {expanded ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
