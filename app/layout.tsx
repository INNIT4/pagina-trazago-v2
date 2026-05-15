import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://trazago.app"),
  title: {
    default: "TrazaGo — Descubre Álamos, Sonora",
    template: "%s · TrazaGo",
  },
  description:
    "App de turismo para Álamos, Sonora. Rutas con IA, notificaciones de proximidad, mapa interactivo.",
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "TrazaGo",
  },
  icons: {
    icon: "/logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
