import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import { Settings2, Type, LineChart } from 'lucide-react'

interface SettingsData {
  fontSize: number
  lineHeight: number
}

const DEFAULT_SETTINGS: SettingsData = {
  fontSize: 18,
  lineHeight: 1.8,
}

function getInitialSettings(): SettingsData {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS
  }

  try {
    const saved = localStorage.getItem('reading-settings')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (
        parsed &&
        typeof parsed === 'object' &&
        typeof parsed.fontSize === 'number' &&
        typeof parsed.lineHeight === 'number'
      ) {
        return {
          fontSize: parsed.fontSize,
          lineHeight: parsed.lineHeight,
        }
      }
    }
  } catch {
    // ignore
  }

  return DEFAULT_SETTINGS
}

export function ReadingSettings() {
  const [fontSize, setFontSize] = useState(() => getInitialSettings().fontSize)
  const [lineHeight, setLineHeight] = useState(() => getInitialSettings().lineHeight)

  const applySettings = useCallback(() => {
    // 选择 MDEditor 渲染的内容容器
    const article = document.querySelector('article.prose')
    if (article) {
      // 设置 article 样式
      const articleEl = article as HTMLElement
      articleEl.style.fontSize = `${fontSize}px`
      articleEl.style.lineHeight = `${lineHeight}`

      // 设置所有段落和文本元素的行距
      const textElements = article.querySelectorAll('p, li, blockquote, td, th, dd, dt')
      textElements.forEach((el) => {
        ;(el as HTMLElement).style.lineHeight = `${lineHeight}`
      })

      // 覆盖 MDEditor.Markdown 的内联样式
      const mdContent = article.querySelector('.wmde-markdown')
      if (mdContent) {
        ;(mdContent as HTMLElement).style.fontSize = 'inherit'
        ;(mdContent as HTMLElement).style.lineHeight = `${lineHeight}`
      }

      // 也设置 data-color-mode 容器
      const colorModeDiv = article.querySelector('[data-color-mode]')
      if (colorModeDiv) {
        ;(colorModeDiv as HTMLElement).style.fontSize = 'inherit'
        ;(colorModeDiv as HTMLElement).style.lineHeight = `${lineHeight}`
      }
    }

    localStorage.setItem('reading-settings', JSON.stringify({ fontSize, lineHeight }))
  }, [fontSize, lineHeight])

  useEffect(() => {
    applySettings()
  }, [applySettings])

  const resetSettings = () => {
    setFontSize(DEFAULT_SETTINGS.fontSize)
    setLineHeight(DEFAULT_SETTINGS.lineHeight)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          阅读设置
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-4">阅读设置</h4>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                <label className="text-sm font-medium">字体大小</label>
              </div>
              <span className="text-sm text-muted-foreground">{fontSize}px</span>
            </div>
            <Slider
              value={[fontSize]}
              onValueChange={([value]) => setFontSize(value)}
              min={14}
              max={24}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>小</span>
              <span>大</span>
            </div>
          </div>

          {/* Line Height */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                <label className="text-sm font-medium">行距</label>
              </div>
              <span className="text-sm text-muted-foreground">{lineHeight}</span>
            </div>
            <Slider
              value={[lineHeight * 10]}
              onValueChange={([value]) => setLineHeight(value / 10)}
              min={14}
              max={24}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>紧凑</span>
              <span>宽松</span>
            </div>
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={resetSettings}
            className="w-full"
          >
            恢复默认
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
