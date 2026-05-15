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
