import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { featuresHtml } from "@/lib/html/features";
import { rewriteLinks } from "@/lib/rewriteLinks";

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const html = rewriteLinks(featuresHtml, locale as Locale);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
