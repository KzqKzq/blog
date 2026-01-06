import { Link, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { FloatingNav } from './FloatingNav'
import { BackToTop } from './BackToTop'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/', label: '首页' },
  { path: '/blog', label: '博客' },
  { path: '/projects', label: '作品集' },
  { path: '/essays', label: '随笔' },
  { path: '/about', label: '关于' },
]

export default function Layout() {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close sheet on route change
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Update capsule indicator position
  useEffect(() => {
    const updateIndicator = () => {
      if (navRef.current) {
        // Find the active nav item based on current path
        const activeItem = navItems.find(item => {
          if (item.path === '/') {
            return location.pathname === '/'
          }
          return location.pathname.startsWith(item.path)
        })

        if (activeItem) {
          const activeLink = navRef.current.querySelector(`a[href="${activeItem.path}"]`) as HTMLElement
          if (activeLink) {
            setIndicatorStyle({
              left: activeLink.offsetLeft,
              width: activeLink.offsetWidth,
            })
          }
        }
      }
    }

    // Run on mount and route change
    updateIndicator()
    // Also run after a small delay to ensure DOM is ready
    const timer = setTimeout(updateIndicator, 50)
    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full backdrop-blur transition-all duration-200",
          isScrolled ? "bg-background/80 border-b border-border" : "bg-transparent"
        )}
      >
        <div className="container flex h-16 items-center justify-center relative">
          {/* Theme Toggle - Left */}
          <div className="absolute left-4">
            <ThemeToggle />
          </div>

          {/* Desktop Nav - Capsule Slider */}
          <nav
            ref={navRef}
            className="hidden md:flex items-center relative bg-muted/50 rounded-full p-1"
          >
            {/* Sliding capsule indicator */}
            {indicatorStyle.width > 0 && (
              <motion.div
                className="absolute h-[calc(100%-8px)] bg-background rounded-full shadow-sm border border-border/50"
                initial={false}
                animate={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}

            {navItems.map((item) => {
              const isActive = item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path)

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative z-10 px-5 py-2 text-sm font-medium rounded-full transition-colors duration-200",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile Nav Button */}
          <div className="md:hidden absolute right-4">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="h-auto">
                <SheetHeader className="sr-only">
                  <SheetTitle>导航菜单</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col items-center gap-2 py-4">
                  {navItems.map((item) => {
                    const isActive = item.path === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(item.path)

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "w-full text-center py-3 text-lg font-medium rounded-lg transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content with Page Transition */}
      <main className="flex-1 w-full container mx-auto py-6 md:py-10 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <FloatingNav />
      <BackToTop />
    </div>
  )
}
