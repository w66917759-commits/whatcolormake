import { siteContactEmail, siteDomain, siteName } from "@/lib/site";

export type LegalPageSlug =
  | "about"
  | "contact"
  | "privacy-policy"
  | "terms-of-use";

export type LegalPageSection = {
  heading: string;
  body: string[];
  bullets?: string[];
};

export type LegalPageContent = {
  slug: LegalPageSlug;
  title: string;
  description: string;
  kicker: string;
  updated: string;
  intro: string;
  sections: LegalPageSection[];
};

export const legalPageLinks: { href: string; label: string }[] = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-use", label: "Terms of Use" },
];

export const legalPages: Record<LegalPageSlug, LegalPageContent> = {
  about: {
    slug: "about",
    title: `About ${siteName}`,
    description:
      "Learn how Color Recipe Lab explains color mixing for kids, parents, and teachers.",
    kicker: "About",
    updated: "June 27, 2026",
    intro:
      "Color Recipe Lab is a simple color-mixing reference for common questions like what colors make green, orange, purple, pink, brown, black, and white.",
    sections: [
      {
        heading: "What the site is for",
        body: [
          "The site gives direct color-mixing answers for paint, light, and printer ink, then lets learners compare those systems in a small interactive lab.",
          "It is built for classroom activities, quick homework help, and parents who want a clear explanation without a long art theory lesson.",
        ],
      },
      {
        heading: "How answers are organized",
        body: [
          "Each guide separates paint mixtures from RGB light and printer ink because those systems do not always make colors the same way.",
        ],
        bullets: [
          "Paint answers use familiar classroom color mixing.",
          "Light answers explain additive RGB behavior.",
          "Printer ink answers explain CMY and CMYK behavior in plain language.",
        ],
      },
    ],
  },
  contact: {
    slug: "contact",
    title: `Contact ${siteName}`,
    description:
      "Contact Color Recipe Lab for corrections, feedback, and site questions.",
    kicker: "Contact",
    updated: "June 27, 2026",
    intro:
      "Send corrections, feedback, and site questions by email. Please include the page URL if your note is about a specific color answer.",
    sections: [
      {
        heading: "Email",
        body: [
          `Reach the site owner at ${siteContactEmail}. This address is intended for feedback about ${siteDomain}, content corrections, and basic site questions.`,
        ],
      },
      {
        heading: "Helpful details to include",
        body: [
          "For color-answer corrections, include the color system you are asking about: paint, light, or printer ink.",
        ],
        bullets: [
          "The page or route you were reading.",
          "The specific sentence that seemed unclear.",
          "The classroom, art, or printing context behind your question.",
        ],
      },
    ],
  },
  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description:
      "Read the privacy policy for Color Recipe Lab and what information the site uses.",
    kicker: "Privacy",
    updated: "June 27, 2026",
    intro:
      `${siteName} is designed as a lightweight educational website. It does not require accounts, payments, or user uploads.`,
    sections: [
      {
        heading: "Information you provide",
        body: [
          "If you email the contact address, the information in that message is used to read and respond to your request.",
          "The public website itself does not ask you to create an account or submit personal profile information.",
        ],
      },
      {
        heading: "Local browser storage",
        body: [
          "The interactive color game may store simple progress details in your own browser so the game can remember local play state on the same device.",
          "This local storage stays in your browser unless you clear it or your browser removes it.",
        ],
      },
      {
        heading: "Hosting and security",
        body: [
          "Hosting providers may process standard technical logs such as request time, browser type, and IP address for security, debugging, and performance.",
          "The site does not sell personal information.",
        ],
      },
      {
        heading: "Contact",
        body: [
          `For privacy questions, email ${siteContactEmail}.`,
        ],
      },
    ],
  },
  "terms-of-use": {
    slug: "terms-of-use",
    title: "Terms of Use",
    description:
      "Read the terms for using Color Recipe Lab and its educational color-mixing content.",
    kicker: "Terms",
    updated: "June 27, 2026",
    intro:
      `By using ${siteDomain}, you agree to use the site as a general educational reference and interactive learning tool.`,
    sections: [
      {
        heading: "Educational use",
        body: [
          "The content is provided for general learning and classroom-friendly color exploration. It is not a professional color-matching, printing, paint-manufacturing, or safety standard.",
        ],
      },
      {
        heading: "Content accuracy",
        body: [
          "Color results can vary by paint brand, pigment strength, paper, screen, printer, lighting, and device settings.",
          "The site aims to explain common color-mixing behavior clearly, but users should test real materials when exact output matters.",
        ],
      },
      {
        heading: "Acceptable use",
        body: [
          "Do not misuse the site, interfere with its availability, or attempt to access systems that are not intentionally public.",
        ],
      },
      {
        heading: "Questions",
        body: [
          `For questions about these terms, email ${siteContactEmail}.`,
        ],
      },
    ],
  },
};

export function getLegalPage(slug: LegalPageSlug) {
  return legalPages[slug];
}
