import type { MetadataRoute } from "next";

//TODO: upravit domenu

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/checkout",
          "/cart",
          "/thank-you",
        ],
      },
    ],
    sitemap: "http://localhost:3000/sitemap.xml",
  };
}