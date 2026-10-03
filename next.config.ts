import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // dev-এ double effect বন্ধ
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-6206e14077b248589a5c3dca443b6dc5.r2.dev",
        pathname: "/profile-images/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      }
    ],
  },
  async rewrites() {
    const serverUrl = (process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000").replace(/\/+$/, "");
    return [
      {
        source: "/api/:path*",
        destination: `${serverUrl}/api/:path*`,
      },
    ];
  },
  async headers() {
  return [
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
    
      ],
    },
  ];
}
};

export default nextConfig;
