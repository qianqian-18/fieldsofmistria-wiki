import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 1,
    workerThreads: true,
    webpackBuildWorker: false,
  },
};

export default nextConfig;
