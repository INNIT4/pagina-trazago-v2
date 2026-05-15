import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, getDictionary, type Locale } from "@/lib/i18n";
import { getAllPostsFS, getAllPosts } from "@/lib/blog";

export const revalidate = 60;

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lc = locale as Locale;
  const dict = getDictionary(lc);

  const fsPosts = await getAllPostsFS(lc);
  const mdxPosts = getAllPosts(lc);

  // Merge: FS posts first, then MDX posts not already in FS (by slug)
  const fsSlugs = new Set(fsPosts.map((p) => p.slug));
  const combined = [...fsPosts, ...mdxPosts.filter((p) => !fsSlugs.has(p.slug))];

  return (
    <section style={{ padding: "80px 0" }}>
      <div className="wrap-narrow">
        <p className="mono" style={{ fontSize: 12, color: "var(--green)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>
          {dict.blog.eyebrow}
        </p>
        <h1 style={{ marginTop: 8 }}>{dict.blog.title}</h1>
        <p className="lede" style={{ marginTop: 16 }}>{dict.blog.lead}</p>

        <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 24 }}>
          {combined.map((post) => (
            <Link
              key={post.slug}
              href={`/${lc}/blog/${post.slug}`}
              style={{ textDecoration: "none", display: "block", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-xl)", padding: 28, transition: "box-shadow .2s" }}
            >
              <p className="mono" style={{ fontSize: 11, color: "var(--green)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600, marginBottom: 8 }}>
                {post.category} · {new Date(post.date).toLocaleDateString(lc, { year: "numeric", month: "long", day: "numeric" })} · {post.readTime} min
              </p>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>{post.title}</h2>
              <p style={{ fontSize: 15, color: "var(--fg-2)", lineHeight: 1.6 }}>{post.excerpt}</p>
              <p style={{ marginTop: 16, fontSize: 13, color: "var(--green)", fontWeight: 600 }}>{dict.common.readMore} →</p>
            </Link>
          ))}

          {combined.length === 0 && (
            <p style={{ color: "var(--fg-3)", fontSize: 15 }}>No hay posts publicados aún.</p>
          )}
        </div>
      </div>
    </section>
  );
}
