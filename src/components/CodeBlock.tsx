import { cn } from '@/lib/utils'

interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  node?: any
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

export function CodeBlock({ inline, className, children, ...props }: CodeBlockProps) {
  // If it's inline code (like `const a = 1`), just render it simply
  if (inline) {
    return (
      <code className={cn("bg-muted/50 px-1.5 py-0.5 rounded text-sm font-mono text-primary", className)} {...props}>
        {children}
      </code>
    )
  }

  // Handle block code
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : ''

  return (
    <div className="relative group my-4 rounded-lg overflow-hidden border border-border/50 bg-muted/30 backdrop-blur-sm">
      {/* Header with Language */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border/50">
        <span className="text-xs font-mono text-muted-foreground uppercase">
          {language || 'text'}
        </span>
      </div>
      
      {/* Code Content */}
      <div className="overflow-x-auto p-4">
        <code className={cn("font-mono text-sm block min-w-full", className)} {...props}>
          {children}
        </code>
      </div>
    </div>
  )
}
