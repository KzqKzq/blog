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
