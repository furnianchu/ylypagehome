/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'i0.hdslb.com',
      },
      {
        protocol: 'https',
        hostname: 'i0.hdslb.com',
      },
      {
        protocol: 'http',
        hostname: 'i1.hdslb.com',
      },
      {
        protocol: 'https',
        hostname: 'i1.hdslb.com',
      },
      {
        protocol: 'http',
        hostname: 'i2.hdslb.com',
      },
      {
        protocol: 'https',
        hostname: 'i2.hdslb.com',
      }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    // 关闭严格模式以减少重复渲染
    strictMode: false,
  },
}

module.exports = nextConfig 
module.exports = {
    images: {
      unoptimized: true,
    },
  }