import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure trailing slash handling and any other needed config
  trailingSlash: false,
};

export default nextConfig;