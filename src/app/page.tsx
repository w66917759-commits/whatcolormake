import Link from "next/link";
import { ColorGame } from "@/components/ColorGame";
import { WorksheetPreview } from "@/components/WorksheetPreview";
import { colorRecipes } from "@/data/colorRecipes";

const arcadeRecipes = colorRecipes.slice(0, 8);

export default function Home() {
  return (
    <main className="overflow-x-hidden bg-[#fffaf1]">
      <ColorGame />

      <section
        id="recipes"
        className="border-y-2 border-stone-950 bg-white px-5 py-10 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
                Recipe arcade
              </p>
              <h2 className="mt-2 text-3xl font-black text-stone-950">
                Practice rounds by color
              </h2>
            </div>
            <p className="max-w-xl text-sm font-semibold leading-6 text-stone-600">
              Each card opens a focused recipe page with paint, light, and ink
              answers.
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {arcadeRecipes.map((recipe) => (
              <Link
                key={recipe.slug}
                href={`/${recipe.slug}`}
                className="group min-h-44 rounded-[8px] border-2 border-stone-950 bg-[#fffaf1] p-4 transition hover:-translate-y-1 hover:shadow-[6px_6px_0_#111827] focus:outline-none focus:ring-4 focus:ring-stone-300"
              >
                <span
                  aria-hidden="true"
                  className="block h-12 w-12 rounded-full border-2 border-stone-950 transition group-hover:scale-110"
                  style={{ backgroundColor: recipe.swatch }}
                />
                <span className="mt-4 block">
                  <span className="block text-lg font-black leading-tight text-stone-950">
                    {recipe.colorName.toUpperCase()}
                  </span>
                  <span className="mt-2 block text-sm font-semibold leading-6 text-stone-600">
                    {recipe.quickAnswer}
                  </span>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {colorRecipes.slice(8).map((recipe) => (
              <Link
                key={recipe.slug}
                href={`/${recipe.slug}`}
                className="rounded-[8px] border border-stone-300 bg-white px-3 py-2 text-sm font-black text-stone-700 transition hover:border-stone-950 hover:text-stone-950 focus:outline-none focus:ring-4 focus:ring-stone-300"
              >
                {recipe.title.replace("What Colors Make ", "").replace("?", "")}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f2fbff] px-5 py-10 sm:px-6 lg:px-8">
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
