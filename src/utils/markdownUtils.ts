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
    const match = line.match(headingRegex)
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
