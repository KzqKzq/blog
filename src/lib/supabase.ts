import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Article = {
    id: string
    slug: string
    title: string
    description: string
    content: string
    cover_image: string
    category: string
    tags: string[]
    published: boolean
    created_at: string
    updated_at: string
}

// Admin Dashboard Types
export type Post = {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  cover_image?: string
  status: 'draft' | 'published'
  tags: string[]
  author_id?: string
  published_at?: string
  seo_title?: string
  seo_description?: string
  created_at: string
  updated_at: string
}

export type Comment = {
  id: string
  post_id: string
  author_name: string
  author_email: string
  content: string
  status: 'pending' | 'approved' | 'spam'
  created_at: string
}

export type SiteSetting = {
  key: string
  value: Record<string, any>
  updated_at: string
}
