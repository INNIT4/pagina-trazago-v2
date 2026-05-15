export const homeHtml = `
<!-- ─────────────── HERO ─────────────── -->
<section class="hero">
  <div class="wrap">
    <div class="hero-grid">
      <div>
        <div class="hero-tag">
          <span class="eyebrow"><span class="dot"></span>
            <span data-es>Pueblo Mágico · Sonora, México</span>
            <span data-en>Magic Town · Sonora, Mexico</span>
          </span>
        </div>
        <h1>
          <span data-es>Traza tu camino<br />por Álamos.</span>
          <span data-en>Trace your path<br />through Álamos.</span>
        </h1>
        <p class="lede">
          <span data-es>TrazaGo combina rutas generadas por IA, un mapa interactivo de cada rincón del pueblo y notificaciones inteligentes para que cada paso te lleve a algo memorable.</span>
          <span data-en>TrazaGo combines AI-generated routes, an interactive map of every corner of town, and smart proximity alerts — so every step leads you somewhere memorable.</span>
        </p>
        <div class="hero-actions">
          <a href="download.html" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 12.04c.02 2.65 2.31 3.53 2.34 3.55-.02.07-.36 1.25-1.19 2.46-.72 1.05-1.46 2.1-2.63 2.12-1.15.02-1.52-.69-2.84-.69-1.32 0-1.73.67-2.82.71-1.13.04-2-1.13-2.72-2.19-1.48-2.15-2.61-6.07-1.09-8.71.75-1.31 2.1-2.14 3.56-2.16 1.11-.02 2.16.75 2.84.75.68 0 1.95-.92 3.29-.79.56.02 2.13.23 3.13 1.71-.08.05-1.87 1.09-1.85 3.24M14.97 4.85c.61-.74 1.02-1.77.91-2.79-.88.04-1.94.58-2.57 1.31-.56.65-1.05 1.69-.92 2.69.98.08 1.97-.5 2.58-1.21"/></svg>
            <span data-es>Descargar para iOS</span><span data-en>Download for iOS</span>
          </a>
          <a href="features.html" class="btn btn-ghost">
            <span data-es>Ver funciones</span><span data-en>See features</span>
          </a>
        </div>

        <div style="margin-top:48px; display:flex; gap:32px; flex-wrap:wrap;">
          <div>
            <div class="mono" style="font-size:13px;color:var(--fg-3);text-transform:uppercase;letter-spacing:.08em;">
              <span data-es>Lugares mapeados</span><span data-en>Mapped places</span>
            </div>
            <div style="font-size:28px;font-weight:700;color:var(--navy);margin-top:4px;">180+</div>
          </div>
          <div>
            <div class="mono" style="font-size:13px;color:var(--fg-3);text-transform:uppercase;letter-spacing:.08em;">
              <span data-es>Rutas posibles</span><span data-en>Possible routes</span>
            </div>
            <div style="font-size:28px;font-weight:700;color:var(--navy);margin-top:4px;">∞</div>
          </div>
          <div>
            <div class="mono" style="font-size:13px;color:var(--fg-3);text-transform:uppercase;letter-spacing:.08em;">
              <span data-es>Pueblo Mágico desde</span><span data-en>Magic Town since</span>
            </div>
            <div style="font-size:28px;font-weight:700;color:var(--navy);margin-top:4px;">2005</div>
          </div>
        </div>
      </div>

      <!-- Phone mockup -->
      <div>
        <div class="phone">
          <div class="phone-screen">
            <!-- mini menu screen -->
            <div style="padding:52px 16px 12px;display:flex;align-items:center;gap:10px;">
              <img src="assets/logo.jpeg" alt="" style="width:36px;height:36px;border-radius:8px;" />
              <div style="flex:1;">
                <div style="font-size:11px;color:var(--fg-2);">
                  <span data-es>Bienvenido a</span><span data-en>Welcome to</span>
                </div>
                <div style="font-size:17px;font-weight:700;color:var(--navy);">TrazaGo</div>
              </div>
              <div style="width:32px;height:32px;border-radius:16px;background:rgba(46,125,50,.12);display:flex;align-items:center;justify-content:center;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
            </div>

            <!-- weather card -->
            <div style="margin:0 16px 12px;padding:12px 14px;border-radius:16px;background:linear-gradient(135deg,#5CB8B2,#2E7D32);color:#fff;display:flex;align-items:center;gap:10px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              <div style="flex:1;">
                <div style="font-size:18px;font-weight:700;">32°C</div>
                <div style="font-size:10px;opacity:.85;">Álamos, Sonora</div>
              </div>
              <div style="font-size:9px;opacity:.75;text-align:right;">
                <span data-es>Ideal para<br/>explorar</span><span data-en>Great day<br/>to explore</span>
              </div>
            </div>

            <!-- search -->
            <div style="margin:0 16px 12px;padding:9px 12px;border-radius:11px;background:#F4DED4;display:flex;align-items:center;gap:8px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#84746A" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <div style="font-size:11px;color:#84746A;">
                <span data-es>Buscar lugares…</span><span data-en>Search places…</span>
              </div>
            </div>

            <!-- 4 tile grid -->
            <div style="margin:0 16px;display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <div style="padding:14px 12px;border-radius:14px;background:#fff;box-shadow:0 1px 6px rgba(0,0,0,.05);">
                <div style="width:32px;height:32px;border-radius:10px;background:rgba(46,125,50,.14);display:flex;align-items:center;justify-content:center;margin-bottom:8px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2"><circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M18 8c0 4-6 7-6 11"/></svg>
                </div>
                <div style="font-size:11px;font-weight:600;color:var(--navy);"><span data-es>Ruta IA</span><span data-en>AI Route</span></div>
                <div style="font-size:9px;color:#84746A;margin-top:1px;"><span data-es>Personalizada</span><span data-en>Personalized</span></div>
              </div>
              <div style="padding:14px 12px;border-radius:14px;background:#fff;box-shadow:0 1px 6px rgba(0,0,0,.05);">
                <div style="width:32px;height:32px;border-radius:10px;background:rgba(217,59,59,.14);display:flex;align-items:center;justify-content:center;margin-bottom:8px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D93B3B" stroke-width="2"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><path d="M8 2v16M16 6v16"/></svg>
                </div>
                <div style="font-size:11px;font-weight:600;color:var(--navy);"><span data-es>Mapa</span><span data-en>Map</span></div>
                <div style="font-size:9px;color:#84746A;margin-top:1px;"><span data-es>Explora puntos</span><span data-en>Explore points</span></div>
              </div>
              <div style="padding:14px 12px;border-radius:14px;background:#fff;box-shadow:0 1px 6px rgba(0,0,0,.05);">
                <div style="width:32px;height:32px;border-radius:10px;background:rgba(92,184,178,.18);display:flex;align-items:center;justify-content:center;margin-bottom:8px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5CB8B2" stroke-width="1.7"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88" fill="#5CB8B2" opacity=".2" stroke="#5CB8B2"/></svg>
                </div>
                <div style="font-size:11px;font-weight:600;color:var(--navy);"><span data-es>Temáticas</span><span data-en>Themed</span></div>
              </div>
              <div style="padding:14px 12px;border-radius:14px;background:#fff;box-shadow:0 1px 6px rgba(0,0,0,.05);">
                <div style="width:32px;height:32px;border-radius:10px;background:rgba(245,158,11,.16);display:flex;align-items:center;justify-content:center;margin-bottom:8px;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <div style="font-size:11px;font-weight:600;color:var(--navy);"><span data-es>Top lugares</span><span data-en>Top places</span></div>
              </div>
            </div>

            <!-- bottom nav -->
            <div style="position:absolute;bottom:0;left:0;right:0;display:flex;padding:8px 6px 10px;background:#fff;border-top:1px solid #F4DED4;">
              <div style="flex:1;text-align:center;color:#2E7D32;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg><div style="font-size:9px;font-weight:600;margin-top:2px;">Home</div></div>
              <div style="flex:1;text-align:center;color:#84746A;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/></svg><div style="font-size:9px;margin-top:2px;">Map</div></div>
              <div style="flex:1;text-align:center;color:#84746A;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg><div style="font-size:9px;margin-top:2px;">Fav</div></div>
              <div style="flex:1;text-align:center;color:#84746A;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><div style="font-size:9px;margin-top:2px;">Me</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ─────────────── MARQUEE STRIP ─────────────── -->
<div class="strip">
  <div class="strip-inner">
    <span><span data-es>Rutas con IA</span><span data-en>AI Routes</span></span>
    <span><span data-es>Mapa interactivo</span><span data-en>Interactive Map</span></span>
    <span><span data-es>Notificaciones de proximidad</span><span data-en>Proximity Alerts</span></span>
    <span><span data-es>Eventos culturales</span><span data-en>Cultural Events</span></span>
    <span><span data-es>Check-ins</span><span data-en>Check-ins</span></span>
    <span><span data-es>Modo invitado</span><span data-en>Guest mode</span></span>
    <span><span data-es>Rutas con IA</span><span data-en>AI Routes</span></span>
    <span><span data-es>Mapa interactivo</span><span data-en>Interactive Map</span></span>
    <span><span data-es>Notificaciones de proximidad</span><span data-en>Proximity Alerts</span></span>
    <span><span data-es>Eventos culturales</span><span data-en>Cultural Events</span></span>
    <span><span data-es>Check-ins</span><span data-en>Check-ins</span></span>
    <span><span data-es>Modo invitado</span><span data-en>Guest mode</span></span>
  </div>
</div>

<!-- ─────────────── VALUE PROPS ─────────────── -->
<section>
  <div class="wrap">
    <div style="max-width:680px;margin-bottom:48px;">
      <span class="eyebrow" style="margin-bottom:20px;"><span class="dot"></span><span data-es>Por qué TrazaGo</span><span data-en>Why TrazaGo</span></span>
      <h2 style="margin-top:20px;">
        <span data-es>Una app construida para un solo lugar. Hecha bien.</span>
        <span data-en>An app built for one place. Done right.</span>
      </h2>
      <p class="lede" style="margin-top:20px;">
        <span data-es>Nada de mapas genéricos ni listas turísticas globales. Cada lugar, cada ruta y cada evento están curados para Álamos.</span>
        <span data-en>No generic maps or global tourist listings. Every place, route and event is curated for Álamos.</span>
      </p>
    </div>

    <div class="grid-3">
      <div class="card card-feature" style="--accent: #2E7D32;">
        <div class="icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M18 8c0 4-6 7-6 11"/></svg>
        </div>
        <h3><span data-es>Rutas con IA</span><span data-en>AI Routes</span></h3>
        <p>
          <span data-es>Cuéntale a Gemini cuánto tiempo tienes, qué te interesa y cómo viajas — te arma un itinerario optimizado en segundos.</span>
          <span data-en>Tell Gemini how much time you have, what you like and how you travel — get an optimized itinerary in seconds.</span>
        </p>
      </div>

      <div class="card card-feature" style="--accent: #D93B3B;">
        <div class="icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        </div>
        <h3><span data-es>Mapa interactivo</span><span data-en>Interactive Map</span></h3>
        <p>
          <span data-es>Más de 180 lugares categorizados por tipo, con horarios, fotos y reseñas. Filtra por museos, restaurantes, iglesias y más.</span>
          <span data-en>180+ places sorted by category, with hours, photos and reviews. Filter by museums, restaurants, churches and more.</span>
        </p>
      </div>

      <div class="card card-feature" style="--accent: #5CB8B2;">
        <div class="icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </div>
        <h3><span data-es>Avisos por proximidad</span><span data-en>Proximity alerts</span></h3>
        <p>
          <span data-es>Cuando pasas cerca de algo interesante, te avisamos. Geofencing real, no spam ni publicidad.</span>
          <span data-en>When you walk near something worth seeing, we tell you. Real geofencing — no spam, no ads.</span>
        </p>
      </div>

      <div class="card card-feature" style="--accent: #9C27B0;">
        <div class="icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        </div>
        <h3><span data-es>Eventos en vivo</span><span data-en>Live events</span></h3>
        <p>
          <span data-es>El Festival de Música, las noches en la Plaza, los recorridos guiados — todo lo que pasa esta semana, en un solo feed.</span>
          <span data-en>The Music Festival, plaza nights, guided tours — everything happening this week in one feed.</span>
        </p>
      </div>

      <div class="card card-feature" style="--accent: #F59E0B;">
        <div class="icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h3><span data-es>Check-ins y estadísticas</span><span data-en>Check-ins & stats</span></h3>
        <p>
          <span data-es>Lleva registro de los lugares que visitaste, gana insignias y revisa tu historial cuando vuelvas a casa.</span>
          <span data-en>Track where you've been, earn badges, review your trip when you get home.</span>
        </p>
      </div>

      <div class="card card-feature" style="--accent: #1C2E4A;">
        <div class="icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        </div>
        <h3><span data-es>Modo invitado</span><span data-en>Guest mode</span></h3>
        <p>
          <span data-es>Explora sin crear cuenta. Cuando estés listo para guardar favoritos o rutas, te toma 10 segundos registrarte.</span>
          <span data-en>Explore without signing up. When you're ready to save favorites or routes, signup takes 10 seconds.</span>
        </p>
      </div>
    </div>
  </div>
</section>

<!-- ─────────────── HOW IT WORKS ─────────────── -->
<section style="background:var(--bg-tint);">
  <div class="wrap">
    <div style="max-width:680px;margin-bottom:56px;">
      <span class="eyebrow"><span class="dot"></span><span data-es>Cómo funciona</span><span data-en>How it works</span></span>
      <h2 style="margin-top:20px;">
        <span data-es>De la pantalla al pueblo en tres pasos.</span>
        <span data-en>From your screen to the streets in three steps.</span>
      </h2>
    </div>

    <div class="grid-3">
      <div>
        <div class="mono" style="font-size:13px;color:var(--green);letter-spacing:.1em;margin-bottom:16px;">01 ──</div>
        <h3 style="margin-bottom:12px;"><span data-es>Descarga e ingresa</span><span data-en>Download and step in</span></h3>
        <p class="muted">
          <span data-es>Abre la app, elige idioma y entra como invitado o con tu correo. Sin tutoriales largos.</span>
          <span data-en>Open the app, pick a language, jump in as guest or with email. No long tutorials.</span>
        </p>
      </div>
      <div>
        <div class="mono" style="font-size:13px;color:var(--green);letter-spacing:.1em;margin-bottom:16px;">02 ──</div>
        <h3 style="margin-bottom:12px;"><span data-es>Genera tu ruta</span><span data-en>Generate your route</span></h3>
        <p class="muted">
          <span data-es>Cuatro preguntas: tiempo, intereses, ritmo, presupuesto. La IA arma un itinerario que tiene sentido.</span>
          <span data-en>Four questions: time, interests, pace, budget. The AI builds an itinerary that actually makes sense.</span>
        </p>
      </div>
      <div>
        <div class="mono" style="font-size:13px;color:var(--green);letter-spacing:.1em;margin-bottom:16px;">03 ──</div>
        <h3 style="margin-bottom:12px;"><span data-es>Camina y descubre</span><span data-en>Walk and discover</span></h3>
        <p class="muted">
          <span data-es>El mapa te guía, las notificaciones te avisan, los check-ins llevan tu registro. Tú solo camina.</span>
          <span data-en>The map guides you, notifications alert you, check-ins log your trip. Just walk.</span>
        </p>
      </div>
    </div>
  </div>
</section>

<!-- ─────────────── FEATURED CATEGORIES ─────────────── -->
<section>
  <div class="wrap">
    <div style="display:flex;justify-content:space-between;align-items:end;margin-bottom:40px;gap:20px;flex-wrap:wrap;">
      <div>
        <span class="eyebrow"><span class="dot"></span><span data-es>Qué hay para descubrir</span><span data-en>What to discover</span></span>
        <h2 style="margin-top:20px;">
          <span data-es>Categorías que importan en un Pueblo Mágico.</span>
          <span data-en>Categories that matter in a Magic Town.</span>
        </h2>
      </div>
      <a href="discover.html" class="btn-link">
        <span data-es>Ver Álamos completo</span><span data-en>See full Álamos</span>
      </a>
    </div>

    <div class="grid-3">
      <div style="border:1px solid var(--line-soft); border-radius: var(--r-lg); overflow:hidden;">
        <div class="placeholder" style="aspect-ratio:5/3; border-radius:0;"><span>museum / interior</span></div>
        <div style="padding:24px;">
          <span class="tag" style="--accent:#9C27B0;"><span class="dot"></span><span data-es>Museos</span><span data-en>Museums</span></span>
          <h3 style="margin:12px 0 8px;"><span data-es>Historia viva</span><span data-en>Living history</span></h3>
          <p style="font-size:14.5px;color:var(--fg-2);">
            <span data-es>Costumbrista, Casa de María Félix, casonas restauradas — 14 espacios para entender Álamos.</span>
            <span data-en>Costumbrista, Casa de María Félix, restored colonial homes — 14 spaces to understand Álamos.</span>
          </p>
        </div>
      </div>

      <div style="border:1px solid var(--line-soft); border-radius: var(--r-lg); overflow:hidden;">
        <div class="placeholder" style="aspect-ratio:5/3; border-radius:0;"><span>cathedral / facade</span></div>
        <div style="padding:24px;">
          <span class="tag" style="--accent:#00BCD4;"><span class="dot"></span><span data-es>Iglesias</span><span data-en>Churches</span></span>
          <h3 style="margin:12px 0 8px;"><span data-es>Arquitectura colonial</span><span data-en>Colonial architecture</span></h3>
          <p style="font-size:14.5px;color:var(--fg-2);">
            <span data-es>La Catedral de la Purísima Concepción y capillas centenarias que marcan el ritmo del pueblo.</span>
            <span data-en>The Cathedral of La Purísima Concepción and century-old chapels that set the town's rhythm.</span>
          </p>
        </div>
      </div>

      <div style="border:1px solid var(--line-soft); border-radius: var(--r-lg); overflow:hidden;">
        <div class="placeholder" style="aspect-ratio:5/3; border-radius:0;"><span>plaza / palm trees</span></div>
        <div style="padding:24px;">
          <span class="tag" style="--accent:#4CAF50;"><span class="dot"></span><span data-es>Plazas y parques</span><span data-en>Plazas & parks</span></span>
          <h3 style="margin:12px 0 8px;"><span data-es>El corazón social</span><span data-en>The social heart</span></h3>
          <p style="font-size:14.5px;color:var(--fg-2);">
            <span data-es>Plaza de Armas, jardines escondidos y miradores. Donde Álamos se sienta a respirar.</span>
            <span data-en>Plaza de Armas, hidden gardens and miradors. Where Álamos sits down to breathe.</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ─────────────── QUOTE / SOCIAL ─────────────── -->
<section class="tight">
  <div class="wrap-narrow" style="text-align:center;">
    <span class="eyebrow"><span class="dot"></span><span data-es>De los exploradores</span><span data-en>From explorers</span></span>
    <p style="font-size:clamp(24px, 3vw, 36px); font-weight:500; line-height:1.3; color:var(--navy); margin-top:28px; letter-spacing:-0.01em; text-wrap:balance;">
      <span data-es>"Llegué a Álamos sin saber qué visitar. En diez minutos tenía un día completo armado, con horarios que sí encajaban. La app no se siente turística — se siente local."</span>
      <span data-en>"Showed up in Álamos with no plan. In ten minutes I had a full day mapped out, with hours that actually fit. The app doesn't feel touristy — it feels local."</span>
    </p>
    <div style="margin-top:32px;display:flex;align-items:center;justify-content:center;gap:12px;">
      <div style="width:44px;height:44px;border-radius:22px;background:var(--surface-2);display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--navy);">MR</div>
      <div style="text-align:left;">
        <div style="font-weight:600;font-size:14.5px;">María R.</div>
        <div style="font-size:13px;color:var(--fg-3);" class="mono"><span data-es>Hermosillo · Beta tester</span><span data-en>Hermosillo · Beta tester</span></div>
      </div>
    </div>
  </div>
</section>

<!-- ─────────────── CTA BAND ─────────────── -->
<section>
  <div class="wrap">
    <div class="cta-band">
      <div>
        <h2><span data-es>Tu próxima visita merece más que Google Maps.</span><span data-en>Your next visit deserves more than Google Maps.</span></h2>
        <p class="lede" style="margin-top:16px;">
          <span data-es>Descarga TrazaGo y deja que Álamos se abra paso, calle por calle.</span>
          <span data-en>Download TrazaGo and let Álamos open up, street by street.</span>
        </p>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <a href="download.html" class="btn btn-primary" style="background:#fff;color:var(--navy);justify-content:center;">
          <span data-es>Descargar App Store</span><span data-en>Download on App Store</span>
        </a>
        <a href="download.html" class="btn btn-ghost" style="background:transparent;border-color:rgba(255,255,255,.3);color:#fff;justify-content:center;">
          <span data-es>Google Play</span><span data-en>Google Play</span>
        </a>
      </div>
    </div>
  </div>
</section>
`;
