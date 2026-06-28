import Link from "next/link";
import { legalPageLinks } from "@/lib/legalPages";
import { footerNavigation } from "@/lib/navigation";
import { siteContactEmail, siteDomain, siteName } from "@/lib/site";

const copyrightYear = 2026;

export function SiteFooter() {
  return (
    <footer className="border-t-4 border-amber-300 bg-stone-950 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-md focus:outline-none focus:ring-4 focus:ring-amber-300"
            aria-label={`${siteName} home`}
          >
            <span
              aria-hidden="true"
              className="grid h-10 w-10 grid-cols-2 overflow-hidden rounded-lg border-2 border-white"
            >
              <span className="bg-[#ef4444]" />
              <span className="bg-[#facc15]" />
              <span className="bg-[#2563eb]" />
              <span className="bg-[#22c55e]" />
            </span>
            <span className="text-lg font-black">{siteName}</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-stone-300">
            Direct answers for searches like what colors make green, with games
            and worksheets for kids, parents, and teachers.
          </p>
          <p className="mt-5 text-xs font-semibold text-stone-400">
            © {copyrightYear} {siteDomain}
          </p>
        </div>

        <FooterLinkGroup title="Navigation" links={footerNavigation} />
        <FooterLinkGroup title="Legal" links={legalPageLinks} />

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.16em] text-stone-400">
            Contact
          </h2>
          <p className="mt-4 text-sm font-medium leading-6 text-stone-300">
            Send corrections, privacy questions, or classroom feedback by email.
          </p>
          <a
            href={`mailto:${siteContactEmail}`}
            className="mt-3 inline-flex min-h-9 items-center text-sm font-semibold text-stone-100 transition hover:text-white focus:outline-none focus:ring-4 focus:ring-amber-300"
          >
            {siteContactEmail}
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="text-sm font-black uppercase tracking-[0.16em] text-stone-400">
        {title}
      </h2>
      <ul className="mt-4 grid gap-2">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex min-h-8 items-center text-sm font-semibold text-stone-200 transition hover:text-white focus:outline-none focus:ring-4 focus:ring-amber-300"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
