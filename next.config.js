/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  },
  eslint: {
    ignoreDuringBuilds: process.env.SKIP_VALIDATION === 'true',
  },
  typescript: {
    ignoreBuildErrors: process.env.SKIP_VALIDATION === 'true',
  },
  images: {
    unoptimized: true,
    domains: ['images.pexels.com'],
  },
  // Ensure CSS is properly processed
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
};

module.exports = nextConfig;
