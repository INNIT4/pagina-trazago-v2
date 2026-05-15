import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Locale } from "./i18n";

export type PostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: number;
  category: string;
  hue: string;
};

export type Post = PostMeta & { content: string };

// ─── MDX (static files, legacy / fallback) ───────────────────────────────────

const ROOT = path.join(process.cwd(), "content", "blog");

export function getAllPosts(locale: Locale): PostMeta[] {
  const dir = path.join(ROOT, locale);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const source = fs.readFileSync(path.join(dir, file), "utf8");
    const { data } = matter(source);
    return {
      slug,
      title: data.title ?? slug,
      excerpt: data.excerpt ?? "",
      date: data.date ?? "",
      author: data.author ?? "TrazaGo",
      readTime: data.readTime ?? 5,
      category: data.category ?? "",
      hue: data.hue ?? "from-clay-300 to-clay-500",
    } as PostMeta;
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(locale: Locale, slug: string): Post | null {
  const file = path.join(ROOT, locale, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const source = fs.readFileSync(file, "utf8");
  const { data, content } = matter(source);
  return {
    slug,
    title: data.title ?? slug,
    excerpt: data.excerpt ?? "",
    date: data.date ?? "",
    author: data.author ?? "TrazaGo",
    readTime: data.readTime ?? 5,
    category: data.category ?? "",
    hue: data.hue ?? "from-clay-300 to-clay-500",
    content,
  };
}

// ─── Firestore (admin-created posts) ─────────────────────────────────────────
// These functions run server-side (in Server Components / generateStaticParams)
// using firebase-admin to avoid bundling client SDK into RSC.

import type { Timestamp } from "firebase-admin/firestore";

function tsToDateString(ts: Timestamp | null | undefined): string {
  if (!ts) return new Date().toISOString().slice(0, 10);
  return ts.toDate().toISOString().slice(0, 10);
}

export async function getAllPostsFS(locale: Locale): Promise<PostMeta[]> {
  try {
    const { adminDb } = await import("./firebase-admin-sdk");
    const snap = await adminDb
      .collection("blog_posts")
      .where("locale", "==", locale)
      .orderBy("publishedAt", "desc")
      .get();

    return snap.docs.map((d) => {
      const data = d.data();
      return {
        slug: data.slug ?? d.id,
        title: data.title ?? "",
        excerpt: data.excerpt ?? "",
        date: tsToDateString(data.publishedAt),
        author: data.authorName ?? "TrazaGo",
        readTime: data.readTime ?? 5,
        category: data.category ?? "",
        hue: "from-clay-300 to-clay-500",
      } as PostMeta;
    });
  } catch {
    return [];
  }
}

export async function getPostFS(locale: Locale, slug: string): Promise<Post | null> {
  try {
    const { adminDb } = await import("./firebase-admin-sdk");
    const snap = await adminDb
      .collection("blog_posts")
      .where("locale", "==", locale)
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snap.empty) return null;
    const data = snap.docs[0].data();

    return {
      slug: data.slug ?? slug,
      title: data.title ?? "",
      excerpt: data.excerpt ?? "",
      date: tsToDateString(data.publishedAt),
      author: data.authorName ?? "TrazaGo",
      readTime: data.readTime ?? 5,
      category: data.category ?? "",
      hue: "from-clay-300 to-clay-500",
      content: data.content ?? "",
    };
  } catch {
    return null;
  }
}
