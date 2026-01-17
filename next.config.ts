import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@BaseCompose/engine", "@BaseCompose/types"],
  turbopack: {}, // Use default Turbopack config
};

export default nextConfig;
