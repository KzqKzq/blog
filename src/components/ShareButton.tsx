import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Share2, Twitter, Facebook, Link2, Check } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ShareButtonProps {
  title: string
  url?: string
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = url || window.location.href

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('链接已复制到剪贴板')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('复制失败')
    }
  }

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, '_blank', 'width=550,height=420')
  }

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(facebookUrl, '_blank', 'width=550,height=420')
  }

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: shareUrl,
        })
      } catch (err) {
        // User cancelled share
      }
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 glass-button">
          <Share2 className="h-4 w-4" />
          分享
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 glass" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">分享文章</h4>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={shareOnTwitter}
              className="justify-start gap-2"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={shareOnFacebook}
              className="justify-start gap-2"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>

            {typeof navigator.share === 'function' && (
              <Button
                variant="outline"
                size="sm"
                onClick={nativeShare}
                className="justify-start gap-2 col-span-2"
              >
                <Share2 className="h-4 w-4" />
                更多分享选项
              </Button>
            )}
          </div>

          <div className="pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="w-full justify-start gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  已复制
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4" />
                  复制链接
                </>
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
