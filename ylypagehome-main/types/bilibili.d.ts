export interface BilibiliVideo {
  id: string
  bvid: string
  title: string
  pic: string
  link: string
  pubDate: string
  views: number
  description: string
}

export interface BilibiliResponse {
  code: number
  message: string
  data: {
    archives: Array<{
      aid: string
      bvid: string
      title: string
      pic: string
      pubdate: number
      stat: {
        view: number
      }
      description: string
    }>
  }
} 