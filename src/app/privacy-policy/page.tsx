import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { getLegalPage } from "@/lib/legalPages";

const page = getLegalPage("privacy-policy");

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: page.title,
    description: page.description,
    url: "/privacy-policy",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return <LegalPage page={page} />;
}
