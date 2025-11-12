/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    '@daily-ai-news/ai',
    '@daily-ai-news/config',
    '@daily-ai-news/db',
    '@daily-ai-news/fetchers',
    '@daily-ai-news/processors',
    '@daily-ai-news/publisher'
  ]
};

module.exports = nextConfig;
