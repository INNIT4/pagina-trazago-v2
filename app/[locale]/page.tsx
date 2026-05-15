import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { homeHtml } from "@/lib/html/home";
import { rewriteLinks } from "@/lib/rewriteLinks";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const html = rewriteLinks(homeHtml, locale as Locale);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
