
export type ArticleMeta = {
  sticky?: boolean
  seoTitle?: string
  seoDescription?: string
  summaryLength?: number
  displayPosition?: 'home' | 'blog' | 'none'
  [key: string]: any
}

export type ArticleContentPayload = {
  markdown: string
  meta?: ArticleMeta
  // Legacy support
  doc?: any[]
}

export function parseArticleContent(raw: string | null | undefined): ArticleContentPayload | null {
  if (!raw) return null

  // Try to parse as JSON first (it might be legacy payload or our new payload)
  if (raw.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(raw)

      // If it has markdown property, return it
      if (parsed.markdown !== undefined) {
        return {
          markdown: parsed.markdown,
          meta: parsed.meta || {},
          doc: parsed.doc || null
        }
      }

      // If it's old Plate structure without markdown field? 
      // We assume it's just legacy doc, but we can't easily convert doc to markdown here without backend.
      // But typically we store markdown too.
      if (parsed.doc) {
        return {
          markdown: '', // Or some placeholder
          doc: parsed.doc,
          meta: parsed.meta || {}
        }
      }
    } catch (e) {
      // ignore JSON parse error
    }
  }

  // Fallback: treat as raw markdown string
  return {
    markdown: raw,
    meta: {},
    doc: null
  }
}

export function fallbackMarkdownPayload(markdown: string): ArticleContentPayload {
  return {
    markdown,
    meta: {
      displayPosition: 'blog'
    },
    doc: null
  }
}
