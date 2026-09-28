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
};
export default nextConfig;
