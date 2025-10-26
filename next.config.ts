import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for deployment
  output: "export",

  // Image optimization
  images: {
    unoptimized: true, // Required for static export
  },

  // Trailing slash for better compatibility
  trailingSlash: true,

  // Disable x-powered-by header
  poweredByHeader: false,

  // Compression
  compress: true,

  // React strict mode
  reactStrictMode: true,
};

export default nextConfig;
