import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/lib/i18n";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const lc = locale as Locale;

  return (
    <>
      {/* Sync <html lang> to current route locale before paint so CSS [data-es]/[data-en] visibility works */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang='${lc}';`,
        }}
      />
      <Navigation locale={lc} />
      <main>{children}</main>
      <Footer locale={lc} />
    </>
  );
}
