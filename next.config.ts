import type { NextConfig } from "next";

// Product photos uploaded through the Django admin are served from the API's own host.
const api = new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Lets local development optimise photos from a Django API on this machine. Never on for a public API host.
    dangerouslyAllowLocalIP: ["localhost", "127.0.0.1"].includes(api.hostname),
    qualities: [70, 85],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: api.protocol.replace(":", "") as "http" | "https", hostname: api.hostname, port: api.port, pathname: "/media/**" },
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/media/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/media/**" },
    ],
  },
};

export default nextConfig;
