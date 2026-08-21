/** @type {import('next').NextConfig} */
const nextConfig = {
  // 公共环境变量，前缀 NEXT_PUBLIC_ 会被注入到客户端
  env: {
    NEXT_PUBLIC_BG_MODE: process.env.NEXT_PUBLIC_BG_MODE || 'daily',
  },
};

module.exports = nextConfig;
