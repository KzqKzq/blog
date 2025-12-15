import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { essays } from '../data/content'
import { Calendar, Clock } from 'lucide-react'

export default function Essays() {
  const sortedEssays = [...essays].sort((a, b) => (a.date > b.date ? -1 : 1))

  return (
    <div className="container max-w-4xl py-10 space-y-8">
      <header className="space-y-4 text-center md:text-left">
        <Badge variant="secondary" className="mb-2">Essays</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">松弛与思考</h1>
        <p className="text-xl text-muted-foreground">
          一些关于节奏、阅读与个人习惯的随笔。
        </p>
      </header>

      <div className="grid gap-6">
        {sortedEssays.map((essay) => (
          <Link key={essay.id} to={`/essays/${essay.slug}`}>
            <Card className="group hover:bg-muted/50 transition-colors duration-200 border-border/60">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {essay.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {essay.readingTime}
                  </span>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {essay.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {essay.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
