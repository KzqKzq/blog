export interface TocItem {
  id: string
  text: string
  level: number
}

export function extractHeadings(markdown: string): TocItem[] {
  const lines = markdown.split('\n')
  const headings: TocItem[] = []

  // Regex to match ## and ### headings
  // Captures: 1=hashes, 2=text
  const headingRegex = /^(#{2,3})\s+(.+)$/

  lines.forEach((line) => {
    const trimmedLine = line.trim()
    const match = trimmedLine.match(headingRegex)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      // Create a simple slug-like ID
      const id = text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\u4e00-\u9fa5-]/g, '') // Keep alphanumeric and Chinese characters

      headings.push({ id, text, level })
    }
  })

  return headings
}

/**
 * Normalize markdown headings to ensure there's always a space after # symbols.
 * This fixes parsing issues with tiptap-markdown which requires standard markdown format.
 * 
 * @example
 * `##3.标题` → `## 3.标题`
 * `###Section` → `### Section`
 */
export function normalizeMarkdownHeadings(markdown: string): string {
  // Match heading lines where # symbols are immediately followed by non-space, non-# characters
  // This regex finds: #{1,6} not followed by space or another #
  return markdown.replace(/^(#{1,6})([^\s#])/gm, '$1 $2')
}
