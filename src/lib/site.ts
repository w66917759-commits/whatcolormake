export const siteUrl = "https://whatcolormake.com";
export const siteDomain = "whatcolormake.com";
export const siteName = "Color Recipe Lab";
export const siteContactEmail = "hello@whatcolormake.com";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}
