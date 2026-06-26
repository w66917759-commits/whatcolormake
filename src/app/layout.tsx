import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteName, siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description:
    "Interactive color mixing games, simple color recipes, and printable worksheets for kids, parents, and teachers.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteName,
    description:
      "Interactive color mixing games, simple color recipes, and printable worksheets for kids, parents, and teachers.",
    url: "/",
    siteName,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
