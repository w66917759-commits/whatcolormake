import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { getLegalPage } from "@/lib/legalPages";

const page = getLegalPage("about");

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: page.title,
    description: page.description,
    url: "/about",
    type: "website",
  },
};

export default function AboutPage() {
  return <LegalPage page={page} />;
}
