import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  images: { remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }] },
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
