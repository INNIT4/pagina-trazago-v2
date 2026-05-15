import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { isLocale, getDictionary, locales, type Locale } from "@/lib/i18n";
import { getAllPosts, getPost, getPostFS } from "@/lib/blog";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  return locales.flatMap((loc) =>
    getAllPosts(loc).map((p) => ({ locale: loc, slug: p.slug }))
  );
}

const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 style={{ marginTop: 40, fontSize: 28 }} {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 style={{ marginTop: 28 }} {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      style={{
        marginTop: 18,
        fontSize: 17,
        lineHeight: 1.7,
        color: "var(--fg-2)",
      }}
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      style={{
        marginTop: 16,
        paddingLeft: 22,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
      {...props}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      style={{
        marginTop: 16,
        paddingLeft: 22,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
      {...props}
    />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li style={{ fontSize: 17, lineHeight: 1.6, color: "var(--fg-2)" }} {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      style={{
        margin: "32px 0",
        paddingLeft: 24,
        borderLeft: "3px solid var(--green)",
        fontSize: 22,
        fontStyle: "italic",
        lineHeight: 1.4,
        color: "var(--navy)",
      }}
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      style={{
        background: "var(--surface-2)",
        padding: "2px 8px",
        borderRadius: 6,
        fontFamily: "var(--mono)",
        fontSize: "0.92em",
        color: "var(--navy)",
      }}
      {...props}
    />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      style={{
        color: "var(--green)",
        textDecoration: "underline",
        textUnderlineOffset: 3,
      }}
      {...props}
    />
  ),
  hr: () => (
    <hr
      style={{
        margin: "48px 0",
        border: 0,
        height: 1,
        background: "var(--line-soft)",
      }}
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong style={{ color: "var(--fg)", fontWeight: 600 }} {...props} />
  ),
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale as Locale);
  const post = (await getPostFS(locale as Locale, slug)) ?? getPost(locale as Locale, slug);
  if (!post) notFound();

  return (
    <>
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="wrap-narrow">
          <Link
            href={`/${locale}/blog`}
            className="mono"
            style={{
              fontSize: 12,
              color: "var(--fg-3)",
              textTransform: "uppercase",
              letterSpacing: ".08em",
            }}
          >
            ← {dict.blog.back}
          </Link>

          <p
            className="mono"
            style={{
              marginTop: 32,
              fontSize: 12,
              color: "var(--green)",
              textTransform: "uppercase",
              letterSpacing: ".08em",
              fontWeight: 600,
            }}
          >
            {post.category} ·{" "}
            {new Date(post.date).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            · {post.readTime} {dict.blog.readTime}
          </p>

          <h1 style={{ marginTop: 16 }}>{post.title}</h1>

          <p className="lede" style={{ marginTop: 24 }}>
            {post.excerpt}
          </p>

          <p
            className="mono"
            style={{
              marginTop: 32,
              fontSize: 12,
              color: "var(--fg-3)",
              textTransform: "uppercase",
              letterSpacing: ".08em",
            }}
          >
            {dict.blog.by} · {post.author}
          </p>
        </div>
      </section>

      <div
        className="wrap-narrow"
        style={{
          height: 240,
          borderRadius: "var(--r-xl)",
          background: "var(--bg-tint)",
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent, transparent 14px, rgba(28,46,74,.04) 14px, rgba(28,46,74,.04) 28px)",
          margin: "0 auto",
        }}
      />

      <section className="legal-body" style={{ paddingTop: 48 }}>
        <div className="wrap-narrow">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }}
          />

          <div
            style={{
              marginTop: 64,
              paddingTop: 32,
              borderTop: "1px solid var(--line-soft)",
            }}
          >
            <Link
              href={`/${locale}/blog`}
              className="mono"
              style={{
                fontSize: 12,
                color: "var(--fg-3)",
                textTransform: "uppercase",
                letterSpacing: ".08em",
              }}
            >
              ← {dict.blog.back}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
