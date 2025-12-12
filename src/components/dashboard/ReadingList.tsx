import { readingList } from '../../data/dashboard'
import { DashboardWidget } from './DashboardWidget'

const statusIcons: Record<string, string> = {
    reading: '📖',
    finished: '✅',
    planned: '📋',
}

export function ReadingList() {
    return (
        <DashboardWidget title="阅读书单" icon="📚">
            <div className="reading-list">
                {readingList.map((book) => (
                    <div key={book.title} className="reading-list__item">
                        <span className="reading-list__status">{statusIcons[book.status]}</span>
                        <div className="reading-list__info">
                            <div className="reading-list__title">{book.title}</div>
                            <div className="reading-list__author">{book.author}</div>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardWidget>
    )
}
