import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'b.zmtcdn.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org', // Add this
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com', // Add this
      },
      {
        protocol:'https',
        hostname :"w7.pngwing.com",
      },
    ],
  },
};

export default nextConfig;