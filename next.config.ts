import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* every page is prerendered, so ship the site as pure static files —
     no server, no functions, just the CDN */
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
