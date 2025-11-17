import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  images: {
    domains: ['example.com', 'randomuser.me', 'uwokktuhfyqcrdrxqbhx.supabase.co'],
  },
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};
module.exports = nextConfig;


export default nextConfig;
