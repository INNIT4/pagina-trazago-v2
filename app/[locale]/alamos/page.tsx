import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { discoverHtml } from "@/lib/html/discover";
import { rewriteLinks } from "@/lib/rewriteLinks";

export default async function AlamosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const html = rewriteLinks(discoverHtml, locale as Locale);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
