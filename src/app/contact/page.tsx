import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { getLegalPage } from "@/lib/legalPages";

const page = getLegalPage("contact");

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: page.title,
    description: page.description,
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return <LegalPage page={page} />;
}
