import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { contactHtml } from "@/lib/html/contact";
import { rewriteLinks } from "@/lib/rewriteLinks";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const html = rewriteLinks(contactHtml, locale as Locale);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
