# self-Page

这是一个基于 Next.js 构建的个人主页模板，支持自定义个人信息、社交媒体链接以及展示B站作品集。

## 预览
[![Watch the video](https://github.com/1dayluo/ylypagehome/blob/main/public/demo/demo.png?raw=true)](https://github.com/1dayluo/repo/assets/public/demo/demo.mp4)

## 部署

### Vercel 部署

1. Fork 此仓库到你的 GitHub 账号
2. 在 [Vercel](https://vercel.com) 上导入你的仓库
3. 在 Vercel 项目设置中配置环境变量
4. 部署完成后，你可以通过 Vercel 分配的域名访问你的网站
### vercel环境变量配置

你可以通过环境变量来自定义网站配置。在 Vercel 的项目设置中，添加以下环境变量：

- `NEXT_PUBLIC_AUTHOR_NAME`: 你的名字
- `NEXT_PUBLIC_AUTHOR_TITLE`: 你的标题
- `NEXT_PUBLIC_AUTHOR_DESCRIPTION`: 你的描述
- `NEXT_PUBLIC_AUTHOR_AVATAR`: 你的头像图片路径
- `NEXT_PUBLIC_SITE_NAME`: 站点名称
- `NEXT_PUBLIC_SITE_DESCRIPTION`: 站点描述
- `NEXT_PUBLIC_TAGS`: 标签，JSON 格式
- `NEXT_PUBLIC_BILIBILI_MID`: B站 MID
- `NEXT_PUBLIC_BILIBILI_COLLECTION_ID`: B站 收藏夹 ID
- `NEXT_PUBLIC_IMAGE_URL`: 第一页的展示图路径
环境变量优先级高于配置文件。如果未设置环境变量，将使用 `config/site.ts` 中的默认配置。
本地开发环境变量配置则在项目根目录创建 `.env.local` 文件，然后粘贴以上变量。或者修改 `config/site.ts`




## 配置说明

所有配置文件都在 `config` 目录下:




### 基础配置 (`config/site.ts`)

```typescript
    export const siteConfig = {
    name: "你的名字",
    description: "个人简介",
    // 其他基础配置...
    }
```
### 个人介绍配置 (`config/profile.ts`)

在这里配置个人介绍部分的内容:

```typescript
export const profileConfig = {
avatar: "头像图片路径",
name: "显示名称",
description: "个人简介",
// 其他个人信息...
}

```

### 社交媒体配置 (`config/social.ts`)

配置各个社交媒体的链接:

```typescript
export const socialConfig = [
{ name: "社交媒体名称", url: "社交媒体链接", icon: "社交媒体图标路径" },
// 其他社交媒体...
]
```

### B站作品集配置 (`config/bilibili.ts`)

配置 B站作品集相关参数:

```typescript
export const bilibiliConfig = {
collection: "合集ID",
// 其他B站相关配置...
}
```




### 安装依赖
npm install
### 启动开发服务器
npm run dev
### 构建
npm run build

