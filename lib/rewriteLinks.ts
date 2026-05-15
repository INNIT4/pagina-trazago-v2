import type { Locale } from "./i18n";

const PATH_MAP: Record<string, string> = {
  "index.html": "",
  "features.html": "caracteristicas",
  "discover.html": "alamos",
  "blog.html": "blog",
  "download.html": "descarga",
  "contact.html": "contacto",
};

/**
 * Rewrites raw HTML from the TRAZAGOV2 mockup into Next.js-compatible paths
 * for the given locale. Replaces:
 *   - href="X.html"          → href="/{locale}/{slug}"
 *   - href="X.html#anchor"   → href="/{locale}/{slug}#anchor"
 *   - src="assets/logo.jpeg" → src="/logo.jpeg"
 */
export function rewriteLinks(html: string, locale: Locale): string {
  let out = html;

  // Asset rewrite (logo only — the design has no other assets)
  out = out.replace(/(["'])assets\/logo\.jpeg(["'])/g, `$1/logo.jpeg$2`);

  // Page link rewrites
  for (const [src, slug] of Object.entries(PATH_MAP)) {
    const target = slug === "" ? `/${locale}` : `/${locale}/${slug}`;
    const re = new RegExp(
      `href=(["'])${src.replace(/\./g, "\\.")}(#[^"']*)?\\1`,
      "g"
    );
    out = out.replace(re, (_m, q, anchor = "") => `href=${q}${target}${anchor}${q}`);
  }

  return out;
}
