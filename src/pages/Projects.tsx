import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { projects } from '../data/content'
import { ExternalLink, Github, Star } from 'lucide-react'

export default function Projects() {
  return (
    <div className="container py-10 space-y-8">
      <header className="space-y-4 text-center md:text-left">
        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Projects</div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">作品与实验室</h1>
        <p className="text-xl text-muted-foreground max-w-[700px]">
          精选开源项目与个人实验，兼顾触感设计与工程可靠性。
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                 <Badge variant="outline" className="font-mono text-xs">{project.accent || 'Lab'}</Badge>
                 {project.stars && (
                   <div className="flex items-center text-xs text-muted-foreground">
                     <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                     {project.stars}
                   </div>
                 )}
              </div>
              <CardTitle className="text-xl">{project.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {project.summary}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <Badge key={tech} variant="secondary" className="bg-secondary/50">
                    {tech}
                  </Badge>
                ))}
              </div>

              {project.highlights && (
                <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1 pt-2">
                  {project.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </CardContent>
            <CardFooter className="flex gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(project.link, '_blank', 'noopener,noreferrer')}
              >
                <Github className="w-4 h-4 mr-2" /> Source
              </Button>
              {project.demo && (
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open(project.demo!, '_blank', 'noopener,noreferrer')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" /> Demo
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
