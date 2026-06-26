export const siteUrl = "https://whatcolormake.com";
export const siteDomain = "whatcolormake.com";
export const siteName = "Color Recipe Lab";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}
