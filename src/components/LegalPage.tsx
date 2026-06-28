import Link from "next/link";
import type { LegalPageContent } from "@/lib/legalPages";

export function LegalPage({ page }: { page: LegalPageContent }) {
  return (
    <main className="bg-[#fffaf1]">
      <article className="mx-auto max-w-4xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Link
          href="/"
          className="inline-flex min-h-10 items-center rounded-full border-2 border-stone-950 bg-white px-4 text-sm font-black text-stone-700 transition hover:-translate-y-0.5 hover:text-stone-950 hover:shadow-[3px_3px_0_#111827] focus:outline-none focus:ring-4 focus:ring-amber-300"
        >
          Back to lab
        </Link>

        <header className="mt-8 border-b-2 border-stone-950 pb-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
            {page.kicker}
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-stone-950 sm:text-5xl">
            {page.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-stone-700">
            {page.intro}
          </p>
          <p className="mt-4 text-sm font-bold text-stone-500">
            Last updated: {page.updated}
          </p>
        </header>

        <div className="mt-8 grid gap-4">
          {page.sections.map((section) => (
            <section
              key={section.heading}
              className="rounded-[8px] border-2 border-stone-950 bg-white p-5"
            >
              <h2 className="text-2xl font-black text-stone-950">
                {section.heading}
              </h2>
              <div className="mt-4 grid gap-3 text-base font-semibold leading-7 text-stone-700">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.bullets ? (
                <ul className="mt-4 grid gap-2 text-sm font-bold leading-6 text-stone-700">
                  {section.bullets.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="text-emerald-700">
                        -
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
