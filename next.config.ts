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
};

export default nextConfig;
