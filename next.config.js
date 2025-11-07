/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Next.js 16 optimizations - Disable cache components for client-side state management
  // cacheComponents: true, // Disabled due to client-side Zustand store usage
  
  // Image optimization
  images: {
    remotePatterns: [],
  },
  
  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // TypeScript configuration
  typescript: {
    // Fail build on TypeScript errors
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
