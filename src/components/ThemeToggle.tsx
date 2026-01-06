import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        // Check localStorage first, then system preference
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('theme')
            if (stored) {
                return stored === 'dark'
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        return false
    })

    // Listen for system preference changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = (e: MediaQueryListEvent) => {
            // Only update if no manual preference is stored
            if (!localStorage.getItem('theme')) {
                setIsDarkMode(e.matches)
            }
        }
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    // Apply theme to document
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode)
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
    }, [isDarkMode])

    const toggleDarkMode = () => setIsDarkMode((prev) => !prev)

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label={`切换到${isDarkMode ? '浅色' : '深色'}模式`}
            className="rounded-full"
        >
            {isDarkMode ? (
                <Moon className="h-5 w-5" />
            ) : (
                <Sun className="h-5 w-5" />
            )}
        </Button>
    )
}
