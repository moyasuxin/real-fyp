import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  images: {
    domains: ['example.com', 'randomuser.me', 'uwokktuhfyqcrdrxqbhx.supabase.co', 'placehold.co'],
  },
  webpack: (config) => {
    config.cache = false;
    return config;
  },
  // Fix chunk loading timeout issues in development
  experimental: {
    // Increase chunk loading timeout
    workerThreads: false,
    cpus: 1,
  },
  // Optimize for better HMR stability
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
