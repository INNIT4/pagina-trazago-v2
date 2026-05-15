import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { downloadHtml } from "@/lib/html/download";
import { rewriteLinks } from "@/lib/rewriteLinks";

export default async function DownloadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const html = rewriteLinks(downloadHtml, locale as Locale);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
