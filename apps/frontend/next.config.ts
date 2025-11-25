import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: "../../",
  },
  output: "standalone",
  transpilePackages: ["@playloggd/domain"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.igdb.com",
        port: "",
        pathname: "/igdb/image/**",
      },
    ],
  },
};

export default nextConfig;
