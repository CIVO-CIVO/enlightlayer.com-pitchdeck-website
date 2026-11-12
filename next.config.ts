import type { NextConfig } from "next";

// A pitch deck shared by link: every route is noindex (see also app/robots.ts).
const nextConfig: NextConfig = {
  // keeps `next build` (port 3210 preview) from clobbering the dev server's .next
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
