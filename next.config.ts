import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Webpack is explicitly used via the --webpack flag in package.json */
  output: 'standalone', // Recommended for Vercel/Docker stability
  
  // Ensuring the bundler doesn't look beyond the project root
  outputFileTracingRoot: __dirname,
  
  // Experimental flags for Next.js 16
  experimental: {
    // Ensuring clean build extraction
  }
};

export default nextConfig;
