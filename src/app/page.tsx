import type { Metadata } from "next";
import Link from "next/link";
import { ColorGame } from "@/components/ColorGame";
import { WorksheetPreview } from "@/components/WorksheetPreview";
import { colorRecipes, whatColorMakesItPages } from "@/data/colorRecipes";
import { absoluteUrl, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "What Colors Make Green? Color Mixing Answers",
  description:
    "Find direct answers for what colors make green, orange, purple, pink, brown, black, white, and more in paint, light, and printer ink.",
  keywords: [
    "what colors make green",
    "what colors make orange",
    "what colors make purple",
    "what colors make brown",
    "color mixing chart",
    "color mixing for kids",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "What Colors Make Green? Color Mixing Answers",
    description:
      "Direct color-mixing answers with an interactive paint, light, and printer ink mixer.",
    url: "/",
    siteName,
    type: "website",
  },
};

const primaryRecipeCards = [
  ...colorRecipes.filter((recipe) => recipe.slug === "what-colors-make-green"),
  ...colorRecipes.filter((recipe) => recipe.slug !== "what-colors-make-green"),
];

const homeJsonLd = JSON.stringify([
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: absoluteUrl("/"),
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "What colors make answers",
    itemListElement: primaryRecipeCards.map((recipe, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: recipe.title,
      url: absoluteUrl(`/${recipe.slug}`),
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What colors make green?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yellow and blue make green in paint. In printer ink, yellow and cyan make green. In light, green is a primary color.",
        },
      },
      {
        "@type": "Question",
        name: "What colors make orange?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Red and yellow make orange in paint. Start with more yellow, then add red slowly.",
        },
      },
      {
        "@type": "Question",
        name: "What colors make purple?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Red and blue make purple in paint. Add white to make a lighter purple.",
        },
      },
    ],
  },
]).replace(/</g, "\\u003c");

export default function Home() {
  return (
    <main className="overflow-x-hidden bg-[#fffaf1]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: homeJsonLd }}
      />
      <ColorGame />

      <section className="bg-white px-5 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-rose-700">
              How to play
            </p>
            <h2 className="mt-2 text-2xl font-black text-stone-950 sm:text-3xl">
              Simple color catching, deeper lessons below.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Pick", "Choose 2-3 palette colors."],
              ["Mix", "Watch the bowl and match meter update."],
              ["Catch", "Press Catch It when the mix looks close."],
            ].map(([title, body]) => (
              <div
                key={title}
                className="rounded-[8px] border border-stone-200 bg-[#fffaf1] p-4"
              >
                <h3 className="text-base font-black text-stone-950">{title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-stone-600">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y-2 border-stone-950 bg-[#f4fff3] px-5 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
              Top color question
            </p>
            <h2 className="mt-2 text-3xl font-black text-stone-950">
              What colors make green?
            </h2>
            <p className="mt-3 max-w-3xl font-semibold leading-7 text-stone-700">
              Yellow and blue make green in paint. The full answer changes in
              light and printer ink, so each page separates Paint Mode, Light
              Mode, and Printer Ink Mode.
            </p>
          </div>
          <Link
            href="/what-colors-make-green"
            className="inline-flex min-h-12 items-center justify-center rounded-[8px] border-2 border-stone-950 bg-white px-5 text-sm font-black text-stone-950 transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#111827] focus:outline-none focus:ring-4 focus:ring-amber-300"
          >
            Open the green answer
          </Link>
        </div>
      </section>

      <section
        id="recipes"
        className="scroll-mt-32 border-y-2 border-stone-950 bg-white px-5 py-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                What colors make
              </p>
              <h2 className="mt-2 text-3xl font-black text-stone-950">
                Exact answers by color question
              </h2>
            </div>
            <p className="max-w-xl text-sm font-semibold leading-6 text-stone-600">
              Each card uses the search phrase directly, then explains the
              answer for paint, light, and printer ink.
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {primaryRecipeCards.map((recipe) => (
              <Link
                key={recipe.slug}
                href={`/${recipe.slug}`}
                className="group min-h-44 rounded-[8px] border-2 border-stone-950 bg-[#fffaf1] p-4 transition hover:-translate-y-1 hover:shadow-[6px_6px_0_#111827] focus:outline-none focus:ring-4 focus:ring-amber-300"
              >
                <span
                  aria-hidden="true"
                  className="block h-12 w-12 rounded-full border-2 border-stone-950 transition group-hover:scale-110"
                  style={{ backgroundColor: recipe.swatch }}
                />
                <span className="mt-4 block">
                  <span className="block text-lg font-black leading-tight text-stone-950">
                    {recipe.title}
                  </span>
                  <span className="mt-2 block text-sm font-semibold leading-6 text-stone-600">
                    {recipe.quickAnswer}
                  </span>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-8 border-t border-stone-200 pt-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  Related wording
                </p>
                <h3 className="mt-2 text-2xl font-black text-stone-950">
                  Secondary color question pages
                </h3>
              </div>
              <p className="max-w-lg text-sm font-semibold leading-6 text-stone-600">
                These pages support adjacent searches, while the main SEO
                cluster stays centered on &quot;what colors make...&quot; pages.
              </p>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {whatColorMakesItPages.map((recipe) => (
                <Link
                  key={recipe.slug}
                  href={`/${recipe.slug}`}
                  className="inline-flex min-h-12 items-center gap-3 rounded-[8px] border border-stone-300 bg-white px-3 text-sm font-black text-stone-800 transition hover:border-stone-950 hover:text-stone-950 focus:outline-none focus:ring-4 focus:ring-amber-300"
                >
                  <span
                    aria-hidden="true"
                    className="h-5 w-5 rounded-full border border-stone-300"
                    style={{ backgroundColor: recipe.swatch }}
                  />
                  {recipe.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="worksheet"
        className="scroll-mt-32 bg-[#f2fbff] px-5 py-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-rose-700">
              Offline challenge
            </p>
            <h2 className="mt-2 text-3xl font-black text-stone-950">
              Turn the score chase into a table activity
            </h2>
            <p className="mt-3 font-semibold leading-7 text-stone-700">
              Paint Lab uses red, yellow, and blue as starter colors. Light
              Mode uses additive RGB. Printer Ink Mode uses CMY and explains
              why printers add black ink.
            </p>
          </div>
          <WorksheetPreview />
        </div>
      </section>
    </main>
  );
}
