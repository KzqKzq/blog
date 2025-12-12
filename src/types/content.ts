export type AccentTone = 'brand' | 'amber' | 'cool' | 'neutral'

export interface Article {
  id: string
  slug: string
  title: string
  description: string
  date: string
  readingTime: string
  tags: string[]
  category: 'tech' | 'essay'
  featured?: boolean
  accent?: AccentTone
  body: string
}

export interface Project {
  id: string
  name: string
  summary: string
  tech: string[]
  link: string
  demo?: string
  stars?: number
  accent?: AccentTone
  highlights?: string[]
}
