import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/cart", "/checkout", "/account", "/order", "/login", "/register", "/forgot-password", "/search"] }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
