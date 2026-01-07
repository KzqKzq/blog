import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb() {
  const location = useLocation()

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = location.pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [{ label: '首页', href: '/' }]

    const pathMap: Record<string, string> = {
      blog: '博客',
      projects: '作品集',
      essays: '随笔',
      about: '关于',
      admin: '管理后台',
      posts: '文章管理',
      dashboard: '仪表盘',
      settings: '设置',
      homepage: '首页配置',
    }

    let currentPath = ''
    paths.forEach((path, index) => {
      currentPath += `/${path}`
      const label = pathMap[path] || path

      // Last item should not have href
      if (index === paths.length - 1) {
        breadcrumbs.push({ label })
      } else {
        breadcrumbs.push({ label, href: currentPath })
      }
    })

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  // Don't show breadcrumb on home page
  if (location.pathname === '/') {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="h-4 w-4" />}

            {crumb.href ? (
              <Link
                to={crumb.href}
                className="hover:text-foreground transition-colors flex items-center gap-1"
              >
                {index === 0 && <Home className="h-3.5 w-3.5" />}
                {crumb.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium flex items-center gap-1">
                {index === 0 && <Home className="h-3.5 w-3.5" />}
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
