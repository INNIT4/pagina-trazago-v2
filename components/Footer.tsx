import Link from "next/link";
import type { Locale } from "@/lib/i18n";

export default function Footer({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();
  const L = (slug: string) => `/${locale}/${slug}`;

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpeg" alt="TrazaGo" />
              <span>
                Traza<em>Go</em>
              </span>
            </div>
            <p>
              <span data-es>
                Descubre Álamos, Sonora — el Pueblo Mágico — con rutas
                inteligentes, eventos y experiencias.
              </span>
              <span data-en>
                Discover Álamos, Sonora — the Magic Town — with smart routes,
                events and curated experiences.
              </span>
            </p>
          </div>

          <div>
            <h4>
              <span data-es>Producto</span>
              <span data-en>Product</span>
            </h4>
            <div className="footer-links">
              <Link href={L("caracteristicas")}>
                <span data-es>Funciones</span>
                <span data-en>Features</span>
              </Link>
              <Link href={L("descarga")}>
                <span data-es>Descargar</span>
                <span data-en>Download</span>
              </Link>
              <Link href={L("caracteristicas") + "#ai"}>
                <span data-es>Rutas con IA</span>
                <span data-en>AI Routes</span>
              </Link>
              <Link href={L("caracteristicas") + "#map"}>
                <span data-es>Mapa</span>
                <span data-en>Map</span>
              </Link>
            </div>
          </div>

          <div>
            <h4>
              <span data-es>Explorar</span>
              <span data-en>Explore</span>
            </h4>
            <div className="footer-links">
              <Link href={L("alamos")}>
                <span data-es>Álamos</span>
                <span data-en>Álamos</span>
              </Link>
              <Link href={L("blog")}>Blog</Link>
              <Link href={L("alamos") + "#categories"}>
                <span data-es>Categorías</span>
                <span data-en>Categories</span>
              </Link>
              <Link href={L("alamos") + "#events"}>
                <span data-es>Eventos</span>
                <span data-en>Events</span>
              </Link>
            </div>
          </div>

          <div>
            <h4>
              <span data-es>Compañía</span>
              <span data-en>Company</span>
            </h4>
            <div className="footer-links">
              <Link href={L("contacto")}>
                <span data-es>Contacto</span>
                <span data-en>Contact</span>
              </Link>
              <Link href={L("contacto") + "#faq"}>FAQ</Link>
              <Link href={L("contacto") + "#support"}>
                <span data-es>Soporte</span>
                <span data-en>Support</span>
              </Link>
              <a href="mailto:hola@trazago.app">hola@trazago.app</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {year} TrazaGo —{" "}
            <span data-es>Hecho con cariño en Sonora</span>
            <span data-en>Made with care in Sonora</span>
          </span>
          <div className="legal">
            <Link href={L("privacidad")}>
              <span data-es>Privacidad</span>
              <span data-en>Privacy</span>
            </Link>
            <Link href={L("terminos")}>
              <span data-es>Términos</span>
              <span data-en>Terms</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
