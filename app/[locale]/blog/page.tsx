import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { blogHtml } from "@/lib/html/blog";
import { rewriteLinks } from "@/lib/rewriteLinks";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const html = rewriteLinks(blogHtml, locale as Locale);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
