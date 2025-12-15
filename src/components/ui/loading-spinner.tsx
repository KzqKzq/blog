import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    text?: string
    className?: string
    fullPage?: boolean
}

export function LoadingSpinner({ 
    size = 'md', 
    text, 
    className,
    fullPage = false 
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    }

    const spinner = (
        <div className={cn(
            "flex flex-col items-center justify-center gap-3",
            fullPage && "h-screen",
            className
        )}>
            <Loader2 className={cn(
                "animate-spin text-primary",
                sizeClasses[size]
            )} />
            {text && (
                <p className="text-sm text-muted-foreground animate-pulse">
                    {text}
                </p>
            )}
        </div>
    )

    return spinner
}

// Page-level loading with skeleton cards
export function PageLoadingSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <div 
                    key={i} 
                    className="rounded-lg border bg-card p-6 space-y-4 animate-pulse"
                >
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="space-y-2">
                        <div className="h-3 bg-muted rounded" />
                        <div className="h-3 bg-muted rounded w-5/6" />
                    </div>
                    <div className="flex gap-2">
                        <div className="h-5 w-16 bg-muted rounded-full" />
                        <div className="h-5 w-12 bg-muted rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    )
}

// Table loading skeleton
export function TableLoadingSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                    {Array.from({ length: cols }).map((_, j) => (
                        <td key={j} className="p-4">
                            <div className="h-4 bg-muted rounded w-full" />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    )
}
