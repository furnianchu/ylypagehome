import { NextResponse } from 'next/server'
import { siteConfig } from '@/config/site'

// 添加静态生成配置
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // 1小时重新验证一次

export async function GET(request: Request) {
  try {
    // 获取 URL 参数
    const { searchParams } = new URL(request.url)
    const mid = searchParams.get('mid') || siteConfig.bilibili.mid
    const collectionId = searchParams.get('collectionId') || siteConfig.bilibili.collectionId

    const response = await fetch(
      `https://api.bilibili.com/x/polymer/web-space/seasons_archives_list?mid=${mid}&season_id=${collectionId}&sort_reverse=false&page_num=1&page_size=30`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'Accept-Language': 'en',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        next: { revalidate: 3600 }
      }
    )

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching bilibili data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bilibili data' },
      { status: 500 }
    )
  }
}