import { BilibiliVideo } from '@/types/bilibili'
import { siteConfig } from '@/config/site'

const getBilibiliConfig = () => {
  return {
    mid: process.env.NEXT_PUBLIC_BILIBILI_MID || siteConfig.bilibili.mid,
    collectionId: process.env.NEXT_PUBLIC_BILIBILI_COLLECTION_ID || siteConfig.bilibili.collectionId
  }
}

export async function fetchCollectionVideos(
  collectionId?: string, 
  mid?: string
): Promise<BilibiliVideo[]> {
  try {
    const config = getBilibiliConfig()
    const finalMid = mid || config.mid
    const finalCollectionId = collectionId || config.collectionId

    // 直接调用 B站 API
    const response = await fetch(`/api/bilibili?mid=${finalMid}&collectionId=${finalCollectionId}`)

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.code !== 0) {
      throw new Error(data.message || 'Failed to fetch bilibili videos')
    }

    return data.data.archives.map((video: any) => ({
      id: video.aid,
      bvid: video.bvid,
      title: video.title,
      pic: video.pic,
      link: `https://www.bilibili.com/video/${video.bvid}`,
      pubDate: new Date(video.pubdate * 1000).toLocaleDateString('zh-CN'),
      views: video.stat.view,
      description: video.description || ''
    }))
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}