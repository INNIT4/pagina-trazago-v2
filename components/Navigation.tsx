"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

const PAGES = [
  { slug: "", es: "Inicio", en: "Home" },
  { slug: "caracteristicas", es: "Funciones", en: "Features" },
  { slug: "alamos", es: "Álamos", en: "Álamos" },
  { slug: "blog", es: "Blog", en: "Blog" },
  { slug: "descarga", es: "Descargar", en: "Download" },
  { slug: "contacto", es: "Contacto", en: "Contact" },
] as const;

export default function Navigation({ locale }: { locale: Locale }) {
  const pathname = usePathname() || "";
  const current = pathname.replace(/^\/(es|en)\/?/, "").replace(/\/$/, "");

  const hrefFor = (slug: string) =>
    slug === "" ? `/${locale}` : `/${locale}/${slug}`;

  const otherLocale: Locale = locale === "es" ? "en" : "es";
  const restOfPath = pathname.replace(/^\/(es|en)/, "") || "";
  const switchHref = `/${otherLocale}${restOfPath}`;

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href={`/${locale}`} className="nav-logo" aria-label="TrazaGo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpeg" alt="TrazaGo" />
          <span className="nav-logo-text">
            Traza<span>Go</span>
          </span>
        </Link>

        <div className="nav-links">
          {PAGES.map((p) => {
            const isActive = current === p.slug;
            return (
              <Link
                key={p.slug || "home"}
                href={hrefFor(p.slug)}
                className={isActive ? "active" : ""}
              >
                <span data-es>{p.es}</span>
                <span data-en>{p.en}</span>
              </Link>
            );
          })}
        </div>

        <div className="nav-right">
          <div className="lang-toggle" role="group" aria-label="Language">
            <Link
              href={locale === "es" ? "#" : switchHref}
              className={locale === "es" ? "on" : ""}
              aria-current={locale === "es" ? "true" : undefined}
            >
              ES
            </Link>
            <Link
              href={locale === "en" ? "#" : switchHref}
              className={locale === "en" ? "on" : ""}
              aria-current={locale === "en" ? "true" : undefined}
            >
              EN
            </Link>
          </div>
          <Link href={`/${locale}/descarga`} className="btn btn-primary nav-cta">
            <span data-es>Descargar</span>
            <span data-en>Get the app</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
