export const blogHtml = `
<style>
  .cat-bar { display: flex; gap: 8px; flex-wrap: wrap; }
  .cat-bar button {
    padding: 8px 14px; border-radius: var(--r-pill);
    background: var(--surface); border: 1px solid var(--line);
    font-size: 13.5px; color: var(--fg-2); font-family: inherit;
    transition: all .15s ease;
  }
  .cat-bar button.on { background: var(--navy); color: #fff; border-color: var(--navy); }
  .cat-bar button:hover:not(.on) { border-color: var(--navy); color: var(--navy); }

  .post-card {
    display: flex; flex-direction: column; gap: 0;
    border: 1px solid var(--line-soft); border-radius: var(--r-lg);
    overflow: hidden; background: var(--surface);
    transition: transform .2s ease, border-color .2s ease;
  }
  .post-card:hover { transform: translateY(-2px); border-color: var(--line); }
  .post-card .placeholder { aspect-ratio: 16/10; border-radius: 0; }
  .post-card .body { padding: 22px 22px 24px; display: flex; flex-direction: column; gap: 10px; }
  .post-card .meta { font-family: var(--mono); font-size: 11px; color: var(--fg-3); text-transform: uppercase; letter-spacing: .06em; display: flex; gap: 12px; }
  .post-card h3 { font-size: 19px; line-height: 1.25; color: var(--navy); }
  .post-card p { font-size: 14px; color: var(--fg-2); line-height: 1.55; }

  .featured {
    display: grid; grid-template-columns: 1.1fr 1fr; gap: 48px;
    align-items: stretch; padding: 32px 0 64px;
    border-bottom: 1px solid var(--line-soft);
  }
  .featured .placeholder { aspect-ratio: 4/3; border-radius: var(--r-lg); height: 100%; }
  .featured .body { display: flex; flex-direction: column; justify-content: center; padding: 8px 0; }
  .featured .body .meta { font-family: var(--mono); font-size: 12px; color: var(--green); text-transform: uppercase; letter-spacing: .08em; }
  .featured .body h2 { font-size: clamp(28px, 3vw, 40px); margin: 16px 0 18px; }
  .featured .body p { color: var(--fg-2); font-size: 16.5px; line-height: 1.6; }

  @media (max-width: 900px) {
    .featured { grid-template-columns: 1fr; gap: 24px; }
  }
</style>

<!-- HERO -->
<section class="hero" style="padding-bottom:32px;">
  <div class="wrap-narrow" style="text-align:center;">
    <span class="eyebrow"><span class="dot"></span><span data-es>Blog</span><span data-en>Blog</span></span>
    <h1 style="margin-top:24px;">
      <span data-es>Historias, guías y curiosidades de Álamos.</span>
      <span data-en>Stories, guides and curiosities from Álamos.</span>
    </h1>
    <p class="lede" style="margin:24px auto 0;">
      <span data-es>Escritas por historiadores locales y editores de TrazaGo. Lectura corta, contenido denso.</span>
      <span data-en>Written by local historians and TrazaGo editors. Short reads, dense content.</span>
    </p>
  </div>
</section>

<!-- CATEGORIES -->
<section class="tight" style="padding:24px 0;">
  <div class="wrap">
    <div class="cat-bar">
      <button class="on"><span data-es>Todos</span><span data-en>All</span></button>
      <button><span data-es>Historia</span><span data-en>History</span></button>
      <button><span data-es>Cultura</span><span data-en>Culture</span></button>
      <button><span data-es>Gastronomía</span><span data-en>Food</span></button>
      <button><span data-es>Guías</span><span data-en>Guides</span></button>
      <button><span data-es>Arquitectura</span><span data-en>Architecture</span></button>
      <button><span data-es>Naturaleza</span><span data-en>Nature</span></button>
    </div>
  </div>
</section>

<!-- FEATURED -->
<section class="tight" style="padding-top:0;">
  <div class="wrap">
    <div class="featured">
      <div class="placeholder"><span>silver mining · archive photo</span></div>
      <div class="body">
        <div class="meta">
          <span data-es>Destacado · Historia</span><span data-en>Featured · History</span>
          <span>· 8 min</span>
        </div>
        <h2>
          <span data-es>Cuando Álamos pesaba más oro que toda Nueva España.</span>
          <span data-en>When Álamos weighed more gold than all of New Spain.</span>
        </h2>
        <p>
          <span data-es>En el siglo XVIII, las minas de Promontorios y Aduana convirtieron a Álamos en una de las ciudades más prósperas del virreinato. Un repaso al boom de la plata, las familias que se hicieron leyenda, y los rastros que dejaron en cada casona del centro.</span>
          <span data-en>In the 18th century, the Promontorios and Aduana mines turned Álamos into one of the wealthiest cities of the viceroyalty. A look back at the silver boom, the families who became legend, and the traces they left in every downtown mansion.</span>
        </p>
        <div style="margin-top:24px;">
          <a href="#" class="btn-link"><span data-es>Leer artículo</span><span data-en>Read article</span></a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- POSTS GRID -->
<section style="padding-top:48px;">
  <div class="wrap">
    <h2 style="font-size:28px;margin-bottom:32px;"><span data-es>Más recientes</span><span data-en>Latest</span></h2>
    <div class="grid-3" style="gap:28px;">

      <article class="post-card">
        <div class="placeholder"><span>cathedral · interior</span></div>
        <div class="body">
          <div class="meta">
            <span style="color:var(--c-iglesia);font-weight:600;"><span data-es>Arquitectura</span><span data-en>Architecture</span></span>
            <span>5 min</span>
          </div>
          <h3><span data-es>La Catedral de Álamos: cuatro siglos en una piedra angular</span><span data-en>The Álamos Cathedral: four centuries in one keystone</span></h3>
          <p><span data-es>Por qué su construcción tardó casi 100 años y qué dicen los detalles del altar mayor.</span><span data-en>Why it took nearly 100 years to build and what the main altar's details reveal.</span></p>
        </div>
      </article>

      <article class="post-card">
        <div class="placeholder"><span>local food · plate</span></div>
        <div class="body">
          <div class="meta">
            <span style="color:var(--c-rest);font-weight:600;"><span data-es>Gastronomía</span><span data-en>Food</span></span>
            <span>4 min</span>
          </div>
          <h3><span data-es>Cinco platillos sonorenses que solo se cocinan aquí</span><span data-en>Five Sonoran dishes only cooked here</span></h3>
          <p><span data-es>De la carne con chile colorado a los chimichangas originales — la cocina viva de Álamos.</span><span data-en>From carne con chile colorado to original chimichangas — Álamos's living cuisine.</span></p>
        </div>
      </article>

      <article class="post-card">
        <div class="placeholder"><span>door · colonial detail</span></div>
        <div class="body">
          <div class="meta">
            <span style="color:#1A73E8;font-weight:600;"><span data-es>Cultura</span><span data-en>Culture</span></span>
            <span>6 min</span>
          </div>
          <h3><span data-es>Festival Ortiz Tirado: 40 años de ópera en el desierto</span><span data-en>Ortiz Tirado Festival: 40 years of opera in the desert</span></h3>
          <p><span data-es>La historia detrás del festival que pone a Álamos en el calendario internacional cada enero.</span><span data-en>The story behind the festival that puts Álamos on the international calendar every January.</span></p>
        </div>
      </article>

      <article class="post-card">
        <div class="placeholder"><span>walking route · marked</span></div>
        <div class="body">
          <div class="meta">
            <span style="color:var(--green);font-weight:600;"><span data-es>Guías</span><span data-en>Guides</span></span>
            <span>10 min</span>
          </div>
          <h3><span data-es>Un fin de semana perfecto en Álamos: itinerario probado</span><span data-en>The perfect weekend in Álamos: a tested itinerary</span></h3>
          <p><span data-es>De viernes a domingo, hora por hora. Probado, ajustado, y disponible directo en la app.</span><span data-en>Friday to Sunday, hour by hour. Tested, refined, available directly in the app.</span></p>
        </div>
      </article>

      <article class="post-card">
        <div class="placeholder"><span>mountains · sierra</span></div>
        <div class="body">
          <div class="meta">
            <span style="color:var(--c-parque);font-weight:600;"><span data-es>Naturaleza</span><span data-en>Nature</span></span>
            <span>7 min</span>
          </div>
          <h3><span data-es>Rutas de senderismo alrededor del Cerro de la Cruz</span><span data-en>Hiking routes around Cerro de la Cruz</span></h3>
          <p><span data-es>Tres caminatas de medio día con vistas, dificultad real y consejos para las horas correctas.</span><span data-en>Three half-day hikes with views, real difficulty ratings and tips for the right hours.</span></p>
        </div>
      </article>

      <article class="post-card">
        <div class="placeholder"><span>silver workshop · hands</span></div>
        <div class="body">
          <div class="meta">
            <span style="color:#F59E0B;font-weight:600;"><span data-es>Cultura</span><span data-en>Culture</span></span>
            <span>5 min</span>
          </div>
          <h3><span data-es>Los plateros que aún trabajan a martillo en pleno 2026</span><span data-en>The silversmiths still working by hammer in 2026</span></h3>
          <p><span data-es>Tres talleres familiares donde puedes ver hacer una pieza desde cero.</span><span data-en>Three family workshops where you can watch a piece made from scratch.</span></p>
        </div>
      </article>

      <article class="post-card">
        <div class="placeholder"><span>map · old</span></div>
        <div class="body">
          <div class="meta">
            <span style="color:var(--c-museo);font-weight:600;"><span data-es>Historia</span><span data-en>History</span></span>
            <span>9 min</span>
          </div>
          <h3><span data-es>María Félix: la diva que Álamos no soltó</span><span data-en>María Félix: the diva Álamos never let go</span></h3>
          <p><span data-es>Nacida en 1914 en una casa que aún se puede visitar. Una biografía corta del icono mexicano más universal.</span><span data-en>Born in 1914 in a house you can still visit. A short biography of Mexico's most universal icon.</span></p>
        </div>
      </article>

      <article class="post-card">
        <div class="placeholder"><span>plaza · evening</span></div>
        <div class="body">
          <div class="meta">
            <span style="color:var(--c-iglesia);font-weight:600;"><span data-es>Arquitectura</span><span data-en>Architecture</span></span>
            <span>6 min</span>
          </div>
          <h3><span data-es>Por qué las casonas tienen patios y no jardines</span><span data-en>Why the mansions have patios, not gardens</span></h3>
          <p><span data-es>La lógica climática y social de la arquitectura colonial — y cómo afecta el ritmo del día.</span><span data-en>The climate and social logic of colonial architecture — and how it shapes the rhythm of the day.</span></p>
        </div>
      </article>

      <article class="post-card">
        <div class="placeholder"><span>tortilla shop · sign</span></div>
        <div class="body">
          <div class="meta">
            <span style="color:var(--c-rest);font-weight:600;"><span data-es>Gastronomía</span><span data-en>Food</span></span>
            <span>3 min</span>
          </div>
          <h3><span data-es>Dónde desayunar en Álamos sin equivocarte</span><span data-en>Where to eat breakfast in Álamos without missing</span></h3>
          <p><span data-es>Seis lugares, todos a pie del centro, todos abiertos antes de las ocho.</span><span data-en>Six places, all walkable from the center, all open before 8 AM.</span></p>
        </div>
      </article>

    </div>

    <div style="text-align:center;margin-top:56px;">
      <button class="btn btn-ghost"><span data-es>Cargar más artículos</span><span data-en>Load more articles</span></button>
    </div>
  </div>
</section>

<!-- NEWSLETTER -->
<section style="background:var(--bg-tint);">
  <div class="wrap-narrow" style="text-align:center;">
    <span class="eyebrow"><span class="dot"></span><span data-es>Newsletter</span><span data-en>Newsletter</span></span>
    <h2 style="margin-top:20px;">
      <span data-es>Un correo al mes. Solo lo que vale la pena.</span>
      <span data-en>One email a month. Only what's worth it.</span>
    </h2>
    <p class="lede" style="margin:20px auto 32px;">
      <span data-es>Las mejores historias del mes, eventos próximos y nuevas funciones de la app.</span>
      <span data-en>The month's best stories, upcoming events, and new app features.</span>
    </p>
    <form onsubmit="event.preventDefault()" style="display:flex;gap:8px;max-width:480px;margin:0 auto;flex-wrap:wrap;">
      <input type="email" required
        placeholder="tu@correo.com"
        style="flex:1;min-width:220px;padding:14px 16px;border-radius:14px;border:1px solid var(--line);background:var(--surface);font-family:inherit;font-size:15px;color:var(--fg);outline:none;" />
      <button type="submit" class="btn btn-primary">
        <span data-es>Suscribirme</span><span data-en>Subscribe</span>
      </button>
    </form>
  </div>
</section>
`;
