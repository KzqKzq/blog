/**
 * Fetches the daily Bing wallpaper URL via a CORS-friendly proxy.
 * Returns the URL string or null if fetch fails.
 */
export async function fetchDailyImage(): Promise<string | null> {
  try {
    // Using bing.biturl.top as a stable, CORS-friendly wrapper for Bing images
    // mkt=zh-CN gets the localized image (sometimes different)
    const response = await fetch('https://bing.biturl.top/?resolution=1920&format=json&index=0&mkt=zh-CN')
    const data = await response.json()
    
    if (data && data.url) {
      return data.url
    }
    return null
  } catch (error) {
    console.error('Failed to fetch daily image:', error)
    return null
  }
}
