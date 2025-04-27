/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React Strict Mode for development
    reactStrictMode: true,
  
    // Configure image optimization
    images: {
      // Allow images from TMDB and your domain
      domains: [
        'image.tmdb.org',
        'www.themoviedb.org',
        'yourdomain.com' // Replace with your actual domain
      ],
      // Define responsive image sizes (defaults + additional sizes)
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      // Enable AVIF format support (better compression)
      formats: ['image/avif', 'image/webp'],
      // Set minimum cache TTL (in seconds)
      minimumCacheTTL: 86400, // 24 hours
    },
  
    // Environment variables that should be exposed to the browser
    env: {
      TMDB_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
      TMDB_BASE_URL: process.env.NEXT_PUBLIC_API_URL,
      TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    },
  
    // Enable SWC compiler (faster builds)
    swcMinify: true,
  
    // Configure headers for security and performance
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on'
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload'
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block'
            },
            {
              key: 'X-Frame-Options',
              value: 'SAMEORIGIN'
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff'
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin'
            }
          ],
        },
      ];
    },
  
    // Configure redirects (example)
    async redirects() {
      return [
        {
          source: '/old-movies',
          destination: '/movies',
          permanent: true,
        },
      ];
    },
  
    // Configure rewrites (example)
    async rewrites() {
      return [
        {
          source: '/api/movies/:path*',
          destination: 'https://api.themoviedb.org/3/movie/:path*',
        },
      ];
    },
  
    // Enable experimental features (optional)
    experimental: {
      // Enable new Next.js image component features
      newNextLinkBehavior: true,
      images: {
        allowFutureImage: true,
      },
      // Enable React 18 concurrent features
      concurrentFeatures: true,
      serverComponents: true,
    },
  };
  
  export default nextConfig;