import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { colorRecipes, getRecipe } from "@/data/colorRecipes";
import { absoluteUrl } from "@/lib/site";

type RecipePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return colorRecipes.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({
  params,
}: RecipePageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipe(slug);

  if (!recipe) {
    return {};
  }

  return {
    title: recipe.title,
    description: recipe.description,
    alternates: {
      canonical: `/${recipe.slug}`,
    },
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      url: absoluteUrl(`/${recipe.slug}`),
      type: "article",
    },
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params;
  const recipe = getRecipe(slug);

  if (!recipe) {
    notFound();
  }

  const relatedRecipes = recipe.relatedQuestions
    .map((relatedSlug) => getRecipe(relatedSlug))
    .filter(Boolean);

  return (
    <main className="bg-white">
      <article className="mx-auto max-w-4xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Link
          href="/"
          className="inline-flex min-h-10 items-center rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-blue-200"
        >
          Back to lab
        </Link>

        <header className="mt-8 border-b border-slate-200 pb-8">
          <p className="text-sm font-semibold text-blue-700">Color recipe</p>
          <div className="mt-3 flex items-center gap-3">
            <span
              className="h-10 w-10 shrink-0 rounded-full border border-slate-200"
              style={{ backgroundColor: recipe.swatch }}
              aria-hidden="true"
            />
            <h1 className="text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              {recipe.title}
            </h1>
          </div>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            {recipe.quickAnswer}
          </p>
        </header>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-950">
              Quick answer for kids
            </h2>
            <p className="mt-3 leading-7 text-slate-700">
              {recipe.kidExplanation}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-950">
              Parent and teacher note
            </h2>
            <p className="mt-3 leading-7 text-slate-700">
              {recipe.parentTeacherExplanation}
            </p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-slate-950">
            Answers by color system
          </h2>
          <div className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200">
            <SystemAnswer title="Paint Lab" body={recipe.paintAnswer} />
            <SystemAnswer title="Light Mode" body={recipe.lightAnswer} />
            <SystemAnswer title="Printer Ink Mode" body={recipe.inkAnswer} />
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-950">
              Try it in the mixer
            </h2>
            <p className="mt-3 leading-7 text-slate-700">
              Open the mixer, choose the right mode, and compare the recipe.
            </p>
            <Link
              href="/#mixer"
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Open mixer
            </Link>
          </div>

          <div className="rounded-lg border border-slate-200 p-5">
            <h2 className="text-xl font-bold text-slate-950">
              Worksheet activity
            </h2>
            <p className="mt-3 leading-7 text-slate-700">
              {recipe.activityPrompt}
            </p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-950">
            Related questions
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {relatedRecipes.map((related) => (
              <Link
                key={related!.slug}
                href={`/${related!.slug}`}
                className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                <span
                  aria-hidden="true"
                  className="h-4 w-4 rounded-full border border-slate-200"
                  style={{ backgroundColor: related!.swatch }}
                />
                {related!.title}
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
      <h3 className="font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-700">{body}</p>
    </div>
  );
}
