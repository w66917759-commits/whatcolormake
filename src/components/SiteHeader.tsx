import Link from "next/link";
import { primaryNavigation } from "@/lib/navigation";
import { siteName } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-stone-950 bg-[#fffaf1]/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:flex-nowrap sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 rounded-md focus:outline-none focus:ring-4 focus:ring-amber-300"
          aria-label={`${siteName} home`}
        >
          <span
            aria-hidden="true"
            className="grid h-10 w-10 grid-cols-2 overflow-hidden rounded-lg border-2 border-stone-950 shadow-[3px_3px_0_#111827] transition group-hover:-translate-y-0.5"
          >
            <span className="bg-[#ef4444]" />
            <span className="bg-[#facc15]" />
            <span className="bg-[#2563eb]" />
            <span className="bg-[#22c55e]" />
          </span>
          <span>
            <span className="block text-base font-black leading-none text-stone-950">
              {siteName}
            </span>
            <span className="mt-1 block text-xs font-semibold text-stone-500">
              What colors make answers
            </span>
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="w-full sm:w-auto">
          <div className="grid grid-cols-3 gap-1 sm:flex sm:items-center">
            {primaryNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-10 items-center justify-center rounded-full px-2.5 text-sm font-black text-stone-700 transition hover:bg-amber-100 hover:text-stone-950 focus:outline-none focus:ring-4 focus:ring-amber-300 sm:px-3.5"
              >
                <span className="sm:hidden">{item.shortLabel}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
