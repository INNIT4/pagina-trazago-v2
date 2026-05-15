import { isLocale, getDictionary, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import LegalLayout from "@/components/LegalLayout";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale as Locale);

  return (
    <LegalLayout
      eyebrow={dict.footer.terms}
      title={dict.legal.termsTitle}
      updated={dict.legal.termsUpdated}
    >
      {locale === "es" ? <Es /> : <En />}
    </LegalLayout>
  );
}

function Es() {
  return (
    <>
      <p>
        Al usar TrazaGo aceptas estos términos. Léelos con calma; están escritos
        sin jerga legal innecesaria.
      </p>

      <h2>1. Uso aceptable</h2>
      <p>
        Puedes usar TrazaGo para descubrir y planear visitas turísticas. No
        puedes usarla para:
      </p>
      <ul>
        <li>Reverse engineering del cliente.</li>
        <li>Spam, suplantación o acoso a otros usuarios.</li>
        <li>Subir contenido ilegal, ofensivo o que infrinja derechos.</li>
      </ul>

      <h2>2. Cuentas</h2>
      <p>
        Eres responsable de proteger tus credenciales. Si sospechas un acceso
        no autorizado, escríbenos.
      </p>

      <h2>3. Contenido del usuario</h2>
      <p>
        Las reseñas y fotos que subes siguen siendo tuyas. Nos otorgas una
        licencia limitada para mostrarlas dentro de la app y la página web. Si
        las eliminas, las quitamos de nuestros servidores en un plazo razonable.
      </p>

      <h2>4. Contenido del catálogo</h2>
      <p>
        Curamos editorialmente los lugares listados. La información se verifica
        localmente pero puede cambiar (horarios, precios, condiciones). Verifica
        antes de tu visita.
      </p>

      <h2>5. Limitación de responsabilidad</h2>
      <p>
        TrazaGo se ofrece "tal cual". No garantizamos disponibilidad continua ni
        precisión absoluta del catálogo. No nos hacemos responsables por
        decisiones de viaje basadas exclusivamente en la app.
      </p>

      <h2>6. Cambios al servicio</h2>
      <p>
        Podemos modificar o discontinuar funciones. Si un cambio es material, te
        avisamos con anticipación dentro de la app.
      </p>

      <h2>7. Ley aplicable</h2>
      <p>
        Estos términos se rigen por las leyes de los Estados Unidos Mexicanos.
      </p>

      <h2>8. Contacto</h2>
      <p>
        <a href="mailto:hola@trazago.app">hola@trazago.app</a>
      </p>
    </>
  );
}

function En() {
  return (
    <>
      <p>
        By using TrazaGo you accept these terms. Read them calmly; they are
        written without unnecessary legal jargon.
      </p>

      <h2>1. Acceptable use</h2>
      <p>
        You can use TrazaGo to discover and plan tourist visits. You may not use
        it to:
      </p>
      <ul>
        <li>Reverse-engineer the client.</li>
        <li>Spam, impersonate or harass other users.</li>
        <li>Upload illegal, offensive or rights-infringing content.</li>
      </ul>

      <h2>2. Accounts</h2>
      <p>
        You are responsible for protecting your credentials. If you suspect
        unauthorized access, write to us.
      </p>

      <h2>3. User content</h2>
      <p>
        Reviews and photos you upload remain yours. You grant us a limited
        license to display them inside the app and the website. If you delete
        them, we remove them from our servers within a reasonable period.
      </p>

      <h2>4. Catalog content</h2>
      <p>
        We editorially curate listed places. Information is verified locally but
        may change (hours, prices, conditions). Verify before your visit.
      </p>

      <h2>5. Limitation of liability</h2>
      <p>
        TrazaGo is offered "as is". We do not guarantee continuous availability
        nor absolute accuracy of the catalog. We are not responsible for travel
        decisions based exclusively on the app.
      </p>

      <h2>6. Service changes</h2>
      <p>
        We may modify or discontinue features. If a change is material, we will
        notify you in advance inside the app.
      </p>

      <h2>7. Governing law</h2>
      <p>
        These terms are governed by the laws of the United Mexican States.
      </p>

      <h2>8. Contact</h2>
      <p>
        <a href="mailto:hello@trazago.app">hello@trazago.app</a>
      </p>
    </>
  );
}
