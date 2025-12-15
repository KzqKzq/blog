import { readingList } from '../../data/dashboard'
import { DashboardWidget } from './DashboardWidget'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CheckCircle2, BookOpen, ClipboardList } from 'lucide-react'

const statusIcons: Record<string, React.ReactNode> = {
    reading: <BookOpen className="w-4 h-4 text-blue-500" />,
    finished: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    planned: <ClipboardList className="w-4 h-4 text-muted-foreground" />,
}

export function ReadingList() {
    return (
        <DashboardWidget title="阅读书单" icon="📚">
            <ScrollArea className="h-full pr-4">
                <div className="space-y-3">
                    {readingList.map((book) => (
                        <div key={book.title} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="mt-0.5">{statusIcons[book.status]}</div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-medium leading-none truncate block" title={book.title}>
                                    {book.title}
                                </span>
                                <span className="text-xs text-muted-foreground mt-1 truncate block">
                                    {book.author}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </DashboardWidget>
    )
}
