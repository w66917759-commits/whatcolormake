import type { MetadataRoute } from "next";
import { colorPages } from "@/data/colorRecipes";
import { legalPageLinks } from "@/lib/legalPages";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  function pagePriority(slug: string) {
    if (slug === "what-colors-make-green") {
      return 0.95;
    }

    if (slug.startsWith("what-colors-make-")) {
      return 0.88;
    }

    return 0.55;
  }

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...colorPages.map((page) => ({
      url: absoluteUrl(`/${page.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: pagePriority(page.slug),
    })),
    ...legalPageLinks.map((page) => ({
      url: absoluteUrl(page.href),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.35,
    })),
  ];
}
