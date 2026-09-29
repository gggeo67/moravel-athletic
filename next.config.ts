import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    localPatterns: [
      { pathname: "/**", search: "" },
      {
        pathname: "/images/editorial/home-hero.webp",
        search: "?v=track-action-2",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/contact", destination: "/pages/contact", permanent: true },
      // Fabric lines renamed from their working names on 2026-09-29.
      { source: "/collections/line-one", destination: "/collections/tempo-jersey", permanent: true },
      { source: "/collections/line-two", destination: "/collections/surge-knit", permanent: true },
      { source: "/collections/line-three", destination: "/collections/stride-woven", permanent: true },
    ];
  },
};
export default nextConfig;
