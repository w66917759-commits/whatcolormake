import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { getLegalPage } from "@/lib/legalPages";

const page = getLegalPage("terms-of-use");

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: {
    canonical: "/terms-of-use",
  },
  openGraph: {
    title: page.title,
    description: page.description,
    url: "/terms-of-use",
    type: "website",
  },
};

export default function TermsOfUsePage() {
  return <LegalPage page={page} />;
}
