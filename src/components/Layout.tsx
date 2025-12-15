import { Link, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import { useState, useEffect } from 'react'

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

  return (
    <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b backdrop-blur transition-all duration-200",
          isScrolled ? "bg-background/80 border-border" : "bg-transparent border-transparent"
        )}
      >
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center space-x-2 font-bold">
              <span className="text-xl bg-gradient-to-tr from-primary to-teal-400 bg-clip-text text-transparent">
                KZQ
              </span>
              <span className="hidden md:inline-block text-sm text-muted-foreground font-medium">/ 数字工坊</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "transition-colors hover:text-primary relative",
                    location.pathname === item.path ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-[19px] left-0 right-0 h-[2px] bg-primary"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Nav Sheet */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <SheetHeader className="px-1">
                  <SheetTitle>
                    <Link to="/" className="flex items-center space-x-2 font-bold select-none">
                      <span className="text-xl bg-gradient-to-tr from-primary to-teal-400 bg-clip-text text-transparent">
                        KZQ
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8 mr-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        location.pathname === item.path
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
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
