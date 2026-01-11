import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@layered/engine", "@layered/types"],
};

export default nextConfig;
