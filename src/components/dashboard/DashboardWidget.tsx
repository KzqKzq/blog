import { ReactNode } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface DashboardWidgetProps {
  title: string
  icon: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
}

export function DashboardWidget({ title, icon, children, className, contentClassName }: DashboardWidgetProps) {
  return (
    <Card className={cn("h-full overflow-hidden transition-all hover:shadow-md border-border/50", className)}>
      <CardHeader className="pb-2 pt-4 px-4 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <span className="text-base text-foreground/80">{icon}</span> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={cn("p-4 pt-2 h-[calc(100%-3.5rem)] overflow-auto", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  )
}
