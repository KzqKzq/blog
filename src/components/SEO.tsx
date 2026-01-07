import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  type?: 'website' | 'article'
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

const DEFAULT_SEO = {
  title: '个人博客 - 技术写作与模式实验',
  description: '记录 React 模式、TypeScript 工程实践与新用户的落地过程',
  keywords: ['React', 'TypeScript', '前端开发', '技术博客'],
  image: '/og-image.jpg',
  type: 'website' as const,
  siteName: '个人博客',
  author: 'Your Name',
}

export function SEO({
  title,
  description,
  keywords,
  image,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
}: SEOProps) {
  const location = useLocation()
  const url = `${window.location.origin}${location.pathname}`

  const seoTitle = title ? `${title} - ${DEFAULT_SEO.siteName}` : DEFAULT_SEO.title
  const seoDescription = description || DEFAULT_SEO.description
  const seoKeywords = keywords?.length ? keywords : DEFAULT_SEO.keywords
  const seoImage = image || DEFAULT_SEO.image
  const seoAuthor = author || DEFAULT_SEO.author

  useEffect(() => {
    // Update document title
    document.title = seoTitle

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name'
      let element = document.querySelector(`meta[${attribute}="${name}"]`)

      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        document.head.appendChild(element)
      }

      element.setAttribute('content', content)
    }

    // Basic meta tags
    updateMetaTag('description', seoDescription)
    updateMetaTag('keywords', seoKeywords.join(', '))
    updateMetaTag('author', seoAuthor)

    // Open Graph tags
    updateMetaTag('og:title', seoTitle, true)
    updateMetaTag('og:description', seoDescription, true)
    updateMetaTag('og:type', type, true)
    updateMetaTag('og:url', url, true)
    updateMetaTag('og:image', seoImage, true)
    updateMetaTag('og:site_name', DEFAULT_SEO.siteName, true)

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', seoTitle)
    updateMetaTag('twitter:description', seoDescription)
    updateMetaTag('twitter:image', seoImage)

    // Article specific tags
    if (type === 'article') {
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime, true)
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime, true)
      }
      if (seoAuthor) {
        updateMetaTag('article:author', seoAuthor, true)
      }
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)
  }, [
    seoTitle,
    seoDescription,
    seoKeywords,
    seoImage,
    seoAuthor,
    type,
    url,
    publishedTime,
    modifiedTime,
  ])

  return null
}
