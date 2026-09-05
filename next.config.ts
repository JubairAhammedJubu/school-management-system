import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-6206e14077b248589a5c3dca443b6dc5.r2.dev",
        pathname: "/profile-images/**",
      },
    ],
  },
};

export default nextConfig;
