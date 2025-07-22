/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https", 
        hostname: "img.clerk.com",
      },
    ],
  },
  
  // Add these to fix the 500 errors
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  
  // Ensure proper handling of server actions
  serverActions: {
    allowedForwardedHosts: ['localhost', '*.vercel.app'],
    allowedOrigins: ['http://localhost:3000', 'https://*.vercel.app'],
  },
  
  // Fix hot reload issues
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;