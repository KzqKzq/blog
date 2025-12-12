import type { ReactNode } from 'react'
import { Card } from '@kzqkzq/tactile-ui'
import './dashboard.css'

interface DashboardWidgetProps {
    title: string
    icon?: string
    children: ReactNode
    className?: string
}

export function DashboardWidget({ title, icon, children, className = '' }: DashboardWidgetProps) {
    return (
        <Card className={`dashboard-widget ${className}`}>
            <div className="widget-header">
                {icon && <span className="widget-icon">{icon}</span>}
                <h3 className="widget-title">{title}</h3>
            </div>
            <div className="widget-content">
                {children}
            </div>
        </Card>
    )
}
