export const contactHtml = `
<style>
  .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
  @media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr; gap: 48px; } }

  .form-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
  .form-field label { font-family: var(--mono); font-size: 12px; color: var(--fg-3); text-transform: uppercase; letter-spacing: .06em; font-weight: 600; }
  .form-field input, .form-field select, .form-field textarea {
    padding: 13px 16px; border-radius: 12px;
    border: 1px solid var(--line); background: var(--surface);
    font-family: inherit; font-size: 15px; color: var(--fg);
    outline: none; transition: border-color .15s ease, box-shadow .15s ease;
  }
  .form-field textarea { resize: vertical; min-height: 120px; }
  .form-field input:focus, .form-field select:focus, .form-field textarea:focus {
    border-color: var(--navy);
    box-shadow: 0 0 0 4px rgba(28,46,74,.08);
  }

  .contact-channel {
    padding: 22px 24px; border: 1px solid var(--line-soft); border-radius: var(--r-lg);
    background: var(--surface); display: flex; gap: 18px; align-items: flex-start;
    margin-bottom: 14px;
    transition: border-color .15s ease;
  }
  .contact-channel:hover { border-color: var(--navy); }
  .contact-channel .icon {
    width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
    background: color-mix(in oklch, var(--accent, var(--green)) 12%, transparent);
    color: var(--accent, var(--green));
    display: flex; align-items: center; justify-content: center;
  }
  .contact-channel h3 { font-size: 16px; margin-bottom: 4px; }
  .contact-channel p { font-size: 14px; color: var(--fg-2); line-height: 1.5; }
  .contact-channel .link { font-family: var(--mono); font-size: 13px; color: var(--navy); font-weight: 600; margin-top: 6px; display: inline-block; }

  /* FAQ */
  .faq-item { border-top: 1px solid var(--line-soft); }
  .faq-item:last-child { border-bottom: 1px solid var(--line-soft); }
  .faq-item summary {
    list-style: none; cursor: pointer;
    padding: 24px 0; display: flex; justify-content: space-between; align-items: center; gap: 24px;
    font-size: 17px; font-weight: 600; color: var(--navy);
  }
  .faq-item summary::-webkit-details-marker { display: none; }
  .faq-item summary::after {
    content: '+'; font-family: var(--mono); font-size: 22px; font-weight: 400; color: var(--fg-3);
    transition: transform .2s ease, color .15s ease;
    flex-shrink: 0;
  }
  .faq-item[open] summary::after { content: '−'; color: var(--green); }
  .faq-item .answer { padding: 0 0 24px; font-size: 15.5px; color: var(--fg-2); line-height: 1.7; max-width: 70ch; }
</style>

<!-- HERO -->
<section class="hero" style="padding-bottom:32px;">
  <div class="wrap-narrow" style="text-align:center;">
    <span class="eyebrow"><span class="dot"></span><span data-es>Contacto</span><span data-en>Contact</span></span>
    <h1 style="margin-top:24px;">
      <span data-es>Hablemos.</span>
      <span data-en>Let's talk.</span>
    </h1>
    <p class="lede" style="margin:24px auto 0;">
      <span data-es>Soporte, colaboraciones, prensa, o solo decir hola — el equipo lee todo.</span>
      <span data-en>Support, partnerships, press, or just to say hi — the team reads everything.</span>
    </p>
  </div>
</section>

<!-- CONTACT FORM + CHANNELS -->
<section style="padding-top:32px;">
  <div class="wrap">
    <div class="contact-grid">
      <!-- form -->
      <div>
        <h2 style="font-size:24px;margin-bottom:24px;"><span data-es>Envíanos un mensaje</span><span data-en>Send us a message</span></h2>
        <form novalidate>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
            <div class="form-field">
              <label><span data-es>Nombre</span><span data-en>Name</span></label>
              <input type="text" required placeholder="Tu nombre" />
            </div>
            <div class="form-field">
              <label><span data-es>Correo</span><span data-en>Email</span></label>
              <input type="email" required placeholder="tu@correo.com" />
            </div>
          </div>
          <div class="form-field">
            <label><span data-es>Tipo de consulta</span><span data-en>Subject</span></label>
            <select required>
              <option value="support">Soporte / Support</option>
              <option value="content">Contenido / Content</option>
              <option value="biz">Negocios / Business</option>
              <option value="press">Prensa / Press</option>
              <option value="other">Otro / Other</option>
            </select>
          </div>
          <div class="form-field">
            <label><span data-es>Mensaje</span><span data-en>Message</span></label>
            <textarea required placeholder="Cuéntanos en qué te podemos ayudar…"></textarea>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;padding:15px;font-size:15px;">
            <span data-es>Enviar mensaje</span><span data-en>Send message</span>
          </button>
          <p style="font-size:12px;color:var(--fg-3);margin-top:12px;text-align:center;font-family:var(--mono);">
            <span data-es>Respondemos en ≤ 48 horas hábiles.</span>
            <span data-en>We respond within 48 business hours.</span>
          </p>
        </form>
      </div>

      <!-- channels -->
      <div>
        <h2 style="font-size:24px;margin-bottom:24px;"><span data-es>Canales directos</span><span data-en>Direct channels</span></h2>

        <div class="contact-channel" id="support" style="--accent:#2E7D32;">
          <div class="icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div>
            <h3><span data-es>Soporte</span><span data-en>Support</span></h3>
            <p><span data-es>¿Algo no funciona o tienes dudas?</span><span data-en>Something broken or you have questions?</span></p>
            <a href="mailto:soporte@trazago.app" class="link">soporte@trazago.app</a>
          </div>
        </div>

        <div class="contact-channel" style="--accent:#5CB8B2;">
          <div class="icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-6 0v4"/><rect x="3" y="9" width="18" height="12" rx="2"/></svg>
          </div>
          <div>
            <h3><span data-es>Negocios</span><span data-en>Business</span></h3>
            <p><span data-es>Hoteles, restaurantes y comercios que quieran sumarse.</span><span data-en>Hotels, restaurants and shops wanting to join.</span></p>
            <a href="mailto:negocios@trazago.app" class="link">negocios@trazago.app</a>
          </div>
        </div>

        <div class="contact-channel" style="--accent:#9C27B0;">
          <div class="icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 22h16M4 18h16M4 14h16M4 10h16M4 6h16M4 2h16"/></svg>
          </div>
          <div>
            <h3><span data-es>Prensa</span><span data-en>Press</span></h3>
            <p><span data-es>Kit de prensa, entrevistas, fotos en alta resolución.</span><span data-en>Press kit, interviews, high-res photos.</span></p>
            <a href="mailto:prensa@trazago.app" class="link">prensa@trazago.app</a>
          </div>
        </div>

        <div class="contact-channel" style="--accent:#D93B3B;">
          <div class="icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          </div>
          <div>
            <h3><span data-es>Oficina</span><span data-en>Office</span></h3>
            <p><span data-es>Hermosillo, Sonora · Lunes a viernes, 9:00 — 18:00</span><span data-en>Hermosillo, Sonora · Mon–Fri, 9 AM — 6 PM</span></p>
            <span class="link">+52 662 000 0000</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section id="faq" style="background:var(--bg-tint);">
  <div class="wrap">
    <div style="max-width:680px;margin-bottom:32px;">
      <span class="eyebrow"><span class="dot"></span>FAQ</span>
      <h2 style="margin-top:20px;">
        <span data-es>Preguntas que llegan seguido.</span>
        <span data-en>Questions we hear a lot.</span>
      </h2>
    </div>

    <div style="max-width:880px;">
      <details class="faq-item">
        <summary><span data-es>¿La app es gratis de verdad?</span><span data-en>Is the app really free?</span></summary>
        <div class="answer">
          <span data-es>Sí. TrazaGo es gratis para descargar y usar. No tiene anuncios, no tiene suscripción premium, no vende tus datos. El proyecto se sostiene con apoyo del programa de turismo de Sonora y patrocinadores locales.</span>
          <span data-en>Yes. TrazaGo is free to download and use. No ads, no premium subscription, no data selling. The project is sustained by support from the Sonora tourism program and local sponsors.</span>
        </div>
      </details>

      <details class="faq-item">
        <summary><span data-es>¿Funciona sin internet?</span><span data-en>Does it work offline?</span></summary>
        <div class="answer">
          <span data-es>Parcialmente. El mapa y los lugares se cachean localmente, así que puedes consultarlos sin internet. La generación de rutas con IA y los eventos sí requieren conexión, porque consultan servidores en tiempo real.</span>
          <span data-en>Partially. The map and places are cached locally, so you can browse them offline. AI route generation and events require connection, since they query servers in real time.</span>
        </div>
      </details>

      <details class="faq-item">
        <summary><span data-es>¿Necesito crear cuenta para usarla?</span><span data-en>Do I need an account to use it?</span></summary>
        <div class="answer">
          <span data-es>No. El modo invitado te da acceso a casi todo: mapa, búsqueda, eventos, blog, clima e incluso generar rutas. Solo necesitas cuenta si quieres guardar favoritos, sincronizar entre dispositivos o registrar check-ins.</span>
          <span data-en>No. Guest mode gives you access to most things: map, search, events, blog, weather, even AI route generation. You only need an account to save favorites, sync across devices or record check-ins.</span>
        </div>
      </details>

      <details class="faq-item">
        <summary><span data-es>¿Qué pasa con mi ubicación y mis datos?</span><span data-en>What about my location and data?</span></summary>
        <div class="answer">
          <span data-es>La ubicación se usa solo en el dispositivo para las notificaciones de proximidad y el mapa. No la enviamos a ningún servidor. Tus favoritos y check-ins viven en tu cuenta de Firebase y puedes exportarlos o borrarlos en cualquier momento desde el perfil.</span>
          <span data-en>Location is used only on-device for proximity notifications and the map. We don't send it to any server. Your favorites and check-ins live in your Firebase account and you can export or delete them anytime from your profile.</span>
        </div>
      </details>

      <details class="faq-item">
        <summary><span data-es>¿La app solo cubre Álamos?</span><span data-en>Does the app only cover Álamos?</span></summary>
        <div class="answer">
          <span data-es>Por ahora sí. TrazaGo está enfocada en hacer una sola cosa muy bien: el contenido de Álamos está curado a mano por un equipo de historiadores y editores locales. Hay planes para expandir a otros Pueblos Mágicos de Sonora durante 2026.</span>
          <span data-en>For now, yes. TrazaGo focuses on doing one thing very well: Álamos content is hand-curated by a team of local historians and editors. There are plans to expand to other Magic Towns of Sonora during 2026.</span>
        </div>
      </details>

      <details class="faq-item">
        <summary><span data-es>Soy dueño de un negocio. ¿Cómo aparezco en la app?</span><span data-en>I own a business. How do I get listed?</span></summary>
        <div class="answer">
          <span data-es>Escríbenos a <a href="mailto:negocios@trazago.app">negocios@trazago.app</a> con la información del lugar. Tenemos un proceso de verificación corto: revisamos horarios, dirección, fotos y categoría. La inclusión es gratuita siempre que el lugar tenga sentido turístico-cultural para Álamos.</span>
          <span data-en>Write us at <a href="mailto:business@trazago.app">business@trazago.app</a> with your place info. We have a short verification process: hours, address, photos and category. Inclusion is free as long as the place has tourist or cultural relevance to Álamos.</span>
        </div>
      </details>

      <details class="faq-item">
        <summary><span data-es>¿Hay versión web del mapa?</span><span data-en>Is there a web version of the map?</span></summary>
        <div class="answer">
          <span data-es>Todavía no. La experiencia móvil es la prioritaria — geofencing, cámara para check-ins y notificaciones funcionan mejor ahí. Una versión web simple del mapa está en el roadmap para fines de 2026.</span>
          <span data-en>Not yet. The mobile experience is the priority — geofencing, check-in camera and notifications work better there. A simple web version of the map is on the roadmap for late 2026.</span>
        </div>
      </details>

      <details class="faq-item">
        <summary><span data-es>¿Quién está detrás del proyecto?</span><span data-en>Who's behind the project?</span></summary>
        <div class="answer">
          <span data-es>TrazaGo es un proyecto de INNIT4 con el apoyo del programa de Pueblos Mágicos de Sonora. El equipo combina desarrolladores en Hermosillo, historiadores y guías locales de Álamos, y un puñado de fotógrafos y editores que llevan años retratando el pueblo.</span>
          <span data-en>TrazaGo is a project by INNIT4 with support from the Sonora Magic Towns program. The team combines developers in Hermosillo, local historians and guides from Álamos, and a handful of photographers and editors who've spent years documenting the town.</span>
        </div>
      </details>
    </div>
  </div>
</section>

<!-- CTA -->
<section>
  <div class="wrap">
    <div class="cta-band">
      <div>
        <h2><span data-es>¿Listo para descubrir Álamos?</span><span data-en>Ready to discover Álamos?</span></h2>
        <p class="lede" style="margin-top:16px;">
          <span data-es>Descarga la app y empieza a trazar tu camino.</span>
          <span data-en>Download the app and start tracing your path.</span>
        </p>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <a href="download.html" class="btn btn-primary" style="background:#fff;color:var(--navy);justify-content:center;">
          <span data-es>Descargar</span><span data-en>Download</span>
        </a>
        <a href="features.html" class="btn btn-ghost" style="background:transparent;border-color:rgba(255,255,255,.3);color:#fff;justify-content:center;">
          <span data-es>Ver funciones</span><span data-en>See features</span>
        </a>
      </div>
    </div>
  </div>
</section>
`;
