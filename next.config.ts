import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@layered/engine", "@layered/types"],
  turbopack: {}, // Use default Turbopack config
};

export default nextConfig;
