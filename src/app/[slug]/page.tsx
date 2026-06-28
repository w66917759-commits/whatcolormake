import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  colorPages,
  getColorPageFaq,
  getColorPage,
  type ColorRecipe,
} from "@/data/colorRecipes";
import { absoluteUrl } from "@/lib/site";

type RecipePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return colorPages.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({
  params,
}: RecipePageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getColorPage(slug);

  if (!recipe) {
    return {};
  }

  const pageUrl = absoluteUrl(`/${recipe.slug}`);
  const twoColorKeywords = [
    "what-colors-make-green",
    "what-colors-make-orange",
    "what-colors-make-purple",
    "what-colors-make-pink",
  ].includes(recipe.slug)
    ? [`what two colors make ${recipe.colorName}`]
    : [];

  return {
    title: recipe.title,
    description: recipe.description,
    keywords: [
      recipe.title.toLowerCase().replace("?", ""),
      `what colors make ${recipe.colorName}`,
      ...twoColorKeywords,
      `how to make ${recipe.colorName}`,
      `${recipe.colorName} color mixing`,
    ],
    alternates: {
      canonical: `/${recipe.slug}`,
    },
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      url: pageUrl,
      type: "article",
    },
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params;
  const recipe = getColorPage(slug);

  if (!recipe) {
    notFound();
  }

  const relatedRecipes = recipe.relatedQuestions
    .map((relatedSlug) => getColorPage(relatedSlug))
    .filter((related): related is ColorRecipe => Boolean(related));
  const pageUrl = absoluteUrl(`/${recipe.slug}`);
  const faq = getColorPageFaq(recipe);
  const isPrimaryQueryPage = recipe.slug.startsWith("what-colors-make-");

  const pageJsonLd = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: recipe.title,
      headline: recipe.title,
      description: recipe.description,
      url: pageUrl,
      mainEntity: {
        "@type": "Question",
        name: recipe.title,
        acceptedAnswer: {
          "@type": "Answer",
          text: recipe.quickAnswer,
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "What colors make",
          item: absoluteUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: recipe.title,
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ]).replace(/</g, "\\u003c");

  return (
    <main className="bg-[#fffaf1]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: pageJsonLd }}
      />
      <article className="mx-auto max-w-4xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Link
          href="/"
          className="inline-flex min-h-10 items-center rounded-full border-2 border-stone-950 bg-white px-4 text-sm font-black text-stone-700 transition hover:-translate-y-0.5 hover:text-stone-950 hover:shadow-[3px_3px_0_#111827] focus:outline-none focus:ring-4 focus:ring-amber-300"
        >
          Back to lab
        </Link>

        <header className="mt-8 border-b-2 border-stone-950 pb-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-rose-700">
            {isPrimaryQueryPage
              ? "What colors make answer"
              : "Related color question"}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span
              className="h-10 w-10 shrink-0 rounded-full border-2 border-stone-950"
              style={{ backgroundColor: recipe.swatch }}
              aria-hidden="true"
            />
            <h1 className="text-4xl font-black leading-tight text-stone-950 sm:text-5xl">
              {recipe.title}
            </h1>
          </div>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-700">
            {recipe.quickAnswer}
          </p>
        </header>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[14px] border-2 border-stone-950 bg-white p-5 shadow-[4px_4px_0_#111827]">
            <h2 className="text-xl font-black text-stone-950">
              Quick answer for kids
            </h2>
            <p className="mt-3 leading-7 text-stone-700">
              {recipe.kidExplanation}
            </p>
          </div>
          <div className="rounded-[14px] border-2 border-stone-950 bg-white p-5 shadow-[4px_4px_0_#111827]">
            <h2 className="text-xl font-black text-stone-950">
              Parent and teacher note
            </h2>
            <p className="mt-3 leading-7 text-stone-700">
              {recipe.parentTeacherExplanation}
            </p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-black text-stone-950">
            What colors make {recipe.colorName} by color system
          </h2>
          <div className="mt-4 divide-y-2 divide-stone-200 overflow-hidden rounded-[14px] border-2 border-stone-950 bg-white shadow-[4px_4px_0_#111827]">
            <SystemAnswer title="Paint Lab" body={recipe.paintAnswer} />
            <SystemAnswer title="Light Mode" body={recipe.lightAnswer} />
            <SystemAnswer title="Printer Ink Mode" body={recipe.inkAnswer} />
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[14px] border-2 border-stone-950 bg-white p-5 shadow-[4px_4px_0_#111827]">
            <h2 className="text-xl font-black text-stone-950">
              Try it in Free Mix
            </h2>
            <p className="mt-3 leading-7 text-stone-700">
              Open the unified lab, switch systems, and compare the recipe
              without a score.
            </p>
            <Link
              href="/#mixer"
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#e11d48] focus:outline-none focus:ring-4 focus:ring-amber-300"
            >
              Open Free Mix
            </Link>
          </div>

          <div className="rounded-[14px] border-2 border-stone-950 bg-white p-5 shadow-[4px_4px_0_#111827]">
            <h2 className="text-xl font-black text-stone-950">
              Worksheet activity
            </h2>
            <p className="mt-3 leading-7 text-stone-700">
              {recipe.activityPrompt}
            </p>
          </div>
        </section>

        <section className="mt-8">
          <section className="mb-8">
            <h2 className="text-2xl font-black text-stone-950">
              Frequently asked questions
            </h2>
            <div className="mt-4 divide-y-2 divide-stone-200 overflow-hidden rounded-[14px] border-2 border-stone-950 bg-white shadow-[4px_4px_0_#111827]">
              {faq.map((item) => (
                <div key={item.question} className="p-4">
                  <h3 className="font-black text-stone-950">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-stone-700">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <h2 className="text-xl font-black text-stone-950">
            Related questions
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {relatedRecipes.map((related) => (
              <Link
                key={related.slug}
                href={`/${related.slug}`}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border-2 border-stone-300 bg-white px-3.5 text-sm font-black text-stone-800 transition hover:-translate-y-0.5 hover:border-stone-950 hover:text-stone-950 focus:outline-none focus:ring-4 focus:ring-amber-300"
              >
                <span
                  aria-hidden="true"
                  className="h-4 w-4 rounded-full border border-stone-300"
                  style={{ backgroundColor: related.swatch }}
                />
                {related.title}
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}

function SystemAnswer({ title, body }: { title: string; body: string }) {
  return (
    <div className="p-4">
      <h3 className="font-black text-stone-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-700">{body}</p>
    </div>
  );
}
