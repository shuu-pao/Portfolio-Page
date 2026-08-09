import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure trailing slash handling and any other needed config
  trailingSlash: false,
  // Pin the workspace root: a sibling repo's lockfile one directory up
  // otherwise makes Turbopack guess and warn on every build.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;