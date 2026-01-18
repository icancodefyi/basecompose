import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@BaseCompose/engine", "@BaseCompose/types"],
  turbopack: {}, // Use default Turbopack config

  images: {
    remotePatterns: [
      {
        protocol: "https",  
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/docs",
        destination: "https://basecompose-docs.vercel.app/docs",
      },
      {
        source: "/docs/:path*",
        destination: "https://basecompose-docs.vercel.app/docs/:path*",
      },
    ];
  },
};

export default nextConfig;
