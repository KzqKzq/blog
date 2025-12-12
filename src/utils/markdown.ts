export interface Frontmatter {
  id: string
  title: string
  description: string
  date: string
  readingTime: string
  tags?: string[]
  category: 'tech' | 'essay'
  accent?: 'brand' | 'glass' | 'amber' | 'neutral' | 'cool'
  featured?: boolean
  slug: string
  [key: string]: unknown
}

export function parseFrontmatter(markdown: string): { frontmatter: Frontmatter; body: string } {
  const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/
  const match = markdown.match(frontmatterRegex)

  if (!match) {
    throw new Error('No frontmatter found')
  }

  const frontmatterBlock = match[1]
  const body = markdown.replace(frontmatterRegex, '').trim()

  const frontmatter: any = {}
  
  frontmatterBlock.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) return

    const key = line.slice(0, colonIndex).trim()
    let value = line.slice(colonIndex + 1).trim()

    // Handle string values wrapped in quotes
    if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1)
    }

    // Handle lists - minimal fallback for the current simple lists
    if (key === 'tags' && !value) {
       // This is a simplified check, assuming tags are on following lines
       // For a robust implementation, a real yaml parser is better, but this fits our simple use case
       // However, to keep it simple and robust for this specific task, we will parse the array format [a, b] or just skip complex yaml handling since we controlled the input format.
       // Actually, let's look at how I wrote the input.
       // I wrote:
       // tags:
       //   - 'React'
       // This simple parser won't handle multiline arrays well.
       // Let's adjust the files to use inline arrays [a, b] OR improve the parser.
       // Improving the parser for this specific simple yaml subset:
       return 
    }
    
    // Very basic YAML value parsing
    if (value === 'true') frontmatter[key] = true
    else if (value === 'false') frontmatter[key] = false
    else if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
        // Parse inline array like ['a', 'b']
        frontmatter[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''))
    } else {
        frontmatter[key] = value
    }
  })

  // Re-scanning for multiline tags using a more robust approach if needed, 
  // but to save complexity I will rewrite the markdown files to use inline arrays which are easier to regex parse without a heavy library.
  // Wait, I can just use a better regex or logic.
  
  return { frontmatter: frontmatter as Frontmatter, body }
}

/**
 * A more robust but still lightweight YAML-like parser for our specific needs
 */
export function parseMarkdownFile(fileName: string, content: string): { frontmatter: Frontmatter; body: string } {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/
    const match = content.match(frontmatterRegex)
    
    if (!match) {
        return { 
            frontmatter: { slug: fileName.replace(/\.md$/, '') } as any, 
            body: content 
        }
    }

    const yamlBlock = match[1]
    const body = content.replace(frontmatterRegex, '').trim()
    const frontmatter: any = { slug: fileName.replace(/\.md$/, '') }
    
    let currentKey: string | null = null

    const lines = yamlBlock.split('\n')
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        /* Skip empty lines */
        if (!line.trim()) continue;

        if (line.trim().startsWith('- ') && currentKey) {
            // It's a list item for the previous key
            const val = line.trim().slice(2).replace(/^['"]|['"]$/g, '')
            if (!Array.isArray(frontmatter[currentKey])) {
                frontmatter[currentKey] = []
            }
            frontmatter[currentKey].push(val)
        } else {
            const colonIndex = line.indexOf(':')
            if (colonIndex !== -1) {
                const key = line.slice(0, colonIndex).trim()
                let value = line.slice(colonIndex + 1).trim()
                
                if (value) {
                    // Inline value
                     if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
                         frontmatter[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''))
                     } else if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
                        frontmatter[key] = value.slice(1, -1)
                     } else if (value === 'true') {
                        frontmatter[key] = true
                     } else if (value === 'false') {
                        frontmatter[key] = false
                     } else {
                        frontmatter[key] = value
                     }
                     currentKey = null
                } else {
                    // Start of a multiline value (like tags array)
                    currentKey = key
                }
            }
        }
    }

    return { frontmatter: frontmatter as Frontmatter, body }
}
