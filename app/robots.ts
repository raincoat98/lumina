import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/products";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/_next/",
          "/checkout/",
          "/order/",
          "/profile/",
          "/cart/",
          "/wishlist/",
          "/login/",
          "/signup/",
          "/forgot-password/",
          "/dialog-test/",
          "/loading-demo/",
          "/theme-test/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/_next/",
          "/checkout/",
          "/order/",
          "/profile/",
          "/cart/",
          "/wishlist/",
          "/login/",
          "/signup/",
          "/forgot-password/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

