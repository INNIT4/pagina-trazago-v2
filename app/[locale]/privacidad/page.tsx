import { isLocale, getDictionary, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import LegalLayout from "@/components/LegalLayout";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale as Locale);

  return (
    <LegalLayout
      eyebrow={dict.footer.privacy}
      title={dict.legal.privacyTitle}
      updated={dict.legal.privacyUpdated}
    >
      {locale === "es" ? <Es /> : <En />}
    </LegalLayout>
  );
}

function Es() {
  return (
    <>
      <p>
        TrazaGo respeta tu privacidad. Esta política explica qué datos
        recopilamos, cómo los usamos y qué control tienes sobre ellos.
      </p>

      <h2>1. Información que recopilamos</h2>
      <p>
        Recopilamos solo lo mínimo para que la app funcione:
      </p>
      <ul>
        <li>
          <strong>Cuenta:</strong> nombre y correo electrónico (solo si te
          registras).
        </li>
        <li>
          <strong>Ubicación:</strong> coordenadas en tiempo real, exclusivamente
          mientras la app está abierta y solo para mapa y geocercas. No se
          almacenan en nuestros servidores.
        </li>
        <li>
          <strong>Uso:</strong> eventos anónimos (vistas, taps) vía Firebase
          Analytics para mejorar el producto.
        </li>
        <li>
          <strong>Errores:</strong> reportes de crash vía Firebase Crashlytics,
          sin contenido personal.
        </li>
      </ul>

      <h2>2. Lo que no hacemos</h2>
      <ul>
        <li>No vendemos tus datos a terceros.</li>
        <li>No mostramos publicidad.</li>
        <li>No rastreamos tu ubicación cuando la app está cerrada.</li>
      </ul>

      <h2>3. Servicios de terceros</h2>
      <p>Confiamos en proveedores estándar:</p>
      <ul>
        <li>
          <strong>Firebase</strong> (Google): autenticación, base de datos,
          analytics, crashlytics.
        </li>
        <li>
          <strong>Google Maps</strong>: render del mapa.
        </li>
        <li>
          <strong>Gemini</strong>: generación de itinerarios.
        </li>
        <li>
          <strong>OpenWeather</strong>: clima.
        </li>
      </ul>

      <h2>4. Tus derechos</h2>
      <p>
        Puedes solicitar acceso, corrección o eliminación de tus datos en
        cualquier momento escribiendo a{" "}
        <a href="mailto:privacidad@trazago.app">privacidad@trazago.app</a>.
      </p>

      <h2>5. Cambios</h2>
      <p>
        Si actualizamos esta política, te avisaremos dentro de la app antes de
        que los cambios surtan efecto.
      </p>

      <h2>6. Contacto</h2>
      <p>
        <a href="mailto:hola@trazago.app">hola@trazago.app</a> · Álamos, Sonora,
        México.
      </p>
    </>
  );
}

function En() {
  return (
    <>
      <p>
        TrazaGo respects your privacy. This policy explains what data we
        collect, how we use it, and what control you have over it.
      </p>

      <h2>1. Information we collect</h2>
      <p>We collect only the minimum needed for the app to work:</p>
      <ul>
        <li>
          <strong>Account:</strong> name and email (only if you sign up).
        </li>
        <li>
          <strong>Location:</strong> real-time coordinates, only while the app
          is open and only for map and geofences. Not stored on our servers.
        </li>
        <li>
          <strong>Usage:</strong> anonymous events (views, taps) via Firebase
          Analytics to improve the product.
        </li>
        <li>
          <strong>Errors:</strong> crash reports via Firebase Crashlytics, no
          personal content.
        </li>
      </ul>

      <h2>2. What we don't do</h2>
      <ul>
        <li>We don't sell your data to third parties.</li>
        <li>We don't show advertising.</li>
        <li>We don't track your location when the app is closed.</li>
      </ul>

      <h2>3. Third-party services</h2>
      <p>We rely on standard providers:</p>
      <ul>
        <li>
          <strong>Firebase</strong> (Google): authentication, database,
          analytics, crashlytics.
        </li>
        <li>
          <strong>Google Maps</strong>: map rendering.
        </li>
        <li>
          <strong>Gemini</strong>: itinerary generation.
        </li>
        <li>
          <strong>OpenWeather</strong>: weather.
        </li>
      </ul>

      <h2>4. Your rights</h2>
      <p>
        You can request access, correction or deletion of your data at any time
        by writing to{" "}
        <a href="mailto:privacy@trazago.app">privacy@trazago.app</a>.
      </p>

      <h2>5. Changes</h2>
      <p>
        If we update this policy, we'll notify you inside the app before the
        changes take effect.
      </p>

      <h2>6. Contact</h2>
      <p>
        <a href="mailto:hello@trazago.app">hello@trazago.app</a> · Álamos,
        Sonora, Mexico.
      </p>
    </>
  );
}
