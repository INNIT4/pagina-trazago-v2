export const discoverHtml = `
<style>
  .alamos-hero { padding: 100px 0 64px; position: relative; overflow: hidden; }
  .alamos-hero .visual {
    aspect-ratio: 16/8; width: 100%; margin-top: 48px;
    border-radius: var(--r-xl); overflow: hidden;
    background: linear-gradient(180deg, #FBEFE7, #F4DED4);
    border: 1px solid var(--line-soft);
    display: flex; align-items: center; justify-content: center;
    background-image:
      repeating-linear-gradient(135deg, transparent, transparent 14px, rgba(28,46,74,.04) 14px, rgba(28,46,74,.04) 28px);
  }
  .alamos-hero .visual span {
    background: rgba(255,255,255,.9); padding: 10px 18px; border-radius: 8px;
    font-family: var(--mono); font-size: 13px; color: var(--fg-2);
    border: 1px solid var(--line);
  }

  .fact-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .fact { padding: 28px 24px; border: 1px solid var(--line-soft); border-radius: var(--r-lg); background: var(--surface); }
  .fact .num { font-size: 36px; font-weight: 700; color: var(--navy); letter-spacing: -0.02em; }
  .fact .label { font-family: var(--mono); font-size: 12px; color: var(--fg-3); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 8px; }
  @media (max-width: 900px) { .fact-grid { grid-template-columns: 1fr 1fr; } }

  .cat-card {
    border: 1px solid var(--line-soft); border-radius: var(--r-lg);
    overflow: hidden; transition: border-color .2s ease;
    background: var(--surface);
  }
  .cat-card:hover { border-color: var(--navy); }
  .cat-card .head {
    height: 140px; display: flex; align-items: center; justify-content: center;
    background:
      radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--accent) 18%, transparent), transparent 60%),
      var(--surface-2);
    position: relative;
  }
  .cat-card .pin {
    width: 44px; height: 44px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg);
    background: var(--accent); box-shadow: 0 4px 12px rgba(0,0,0,.18);
    display: flex; align-items: center; justify-content: center;
  }
  .cat-card .pin::after { content: ''; width: 14px; height: 14px; border-radius: 50%; background: #fff; transform: rotate(45deg); }
  .cat-card .body { padding: 20px 22px 22px; }
  .cat-card h3 { font-size: 18px; margin-bottom: 6px; }
  .cat-card .count { font-family: var(--mono); font-size: 12px; color: var(--fg-3); }
  .cat-card p { font-size: 14px; color: var(--fg-2); line-height: 1.55; margin-top: 12px; }

  .timeline {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;
    margin-top: 40px;
  }
  .timeline .tl-card { padding: 24px 22px; border: 1px solid var(--line-soft); border-radius: var(--r-lg); background: var(--surface); }
  .timeline .tl-card .month { font-family: var(--mono); font-size: 12px; color: var(--green); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
  .timeline .tl-card h3 { font-size: 17px; margin-top: 8px; }
  .timeline .tl-card p { font-size: 13.5px; color: var(--fg-2); margin-top: 10px; line-height: 1.55; }
  @media (max-width: 900px) { .timeline { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 600px) { .timeline { grid-template-columns: 1fr; } }
</style>

<!-- HERO -->
<section class="alamos-hero">
  <div class="wrap">
    <div style="max-width:720px;">
      <span class="eyebrow"><span class="dot"></span><span data-es>Álamos · Sonora · México</span><span data-en>Álamos · Sonora · Mexico</span></span>
      <h1 style="margin-top:24px;">
        <span data-es>Un pueblo de plata, palmeras y silencios largos.</span>
        <span data-en>A town of silver, palm trees and long silences.</span>
      </h1>
      <p class="lede" style="margin-top:24px;">
        <span data-es>Fundado en 1683, declarado Pueblo Mágico en 2005. Álamos es uno de los lugares con mejor arquitectura colonial conservada del norte de México — y la app está construida para que no te pierdas nada.</span>
        <span data-en>Founded 1683, declared a Magic Town in 2005. Álamos has some of the best-preserved colonial architecture in northern Mexico — and the app is built to help you take it all in.</span>
      </p>
    </div>

    <div class="visual">
      <span><span data-es>vista panorámica · Catedral y Plaza de Armas</span><span data-en>panoramic view · Cathedral and Plaza de Armas</span></span>
    </div>
  </div>
</section>

<!-- QUICK FACTS -->
<section class="tight">
  <div class="wrap">
    <div class="fact-grid">
      <div class="fact">
        <div class="num">1683</div>
        <div class="label"><span data-es>Año de fundación</span><span data-en>Founded</span></div>
      </div>
      <div class="fact">
        <div class="num">2005</div>
        <div class="label"><span data-es>Pueblo Mágico desde</span><span data-en>Magic Town since</span></div>
      </div>
      <div class="fact">
        <div class="num">~25K</div>
        <div class="label"><span data-es>Habitantes</span><span data-en>Inhabitants</span></div>
      </div>
      <div class="fact">
        <div class="num">411 m</div>
        <div class="label"><span data-es>Altitud sobre el mar</span><span data-en>Above sea level</span></div>
      </div>
    </div>
  </div>
</section>

<!-- ABOUT -->
<section>
  <div class="wrap">
    <div style="display:grid;grid-template-columns:1fr 1.4fr;gap:80px;align-items:start;">
      <div>
        <span class="eyebrow"><span class="dot"></span><span data-es>Sobre Álamos</span><span data-en>About Álamos</span></span>
        <h2 style="margin-top:20px;">
          <span data-es>El sur de Sonora, en su mejor forma.</span>
          <span data-en>Southern Sonora at its best.</span>
        </h2>
      </div>
      <div>
        <p style="font-size:16.5px;line-height:1.7;color:var(--fg);">
          <span data-es>Álamos nació gracias a la plata. En el siglo XVIII fue una de las ciudades más ricas de la Nueva España, y esa riqueza se ve hoy en las casonas restauradas, los portales del centro y la Catedral de la Purísima Concepción, terminada en 1804.</span>
          <span data-en>Álamos was born from silver. In the 18th century it was one of the richest cities in New Spain, and that wealth shows today in restored mansions, the downtown arcades, and the Cathedral of La Purísima Concepción, finished in 1804.</span>
        </p>
        <p style="font-size:16.5px;line-height:1.7;color:var(--fg-2);margin-top:20px;">
          <span data-es>Hoy es un punto de cita anual para artistas, músicos y viajeros que vienen al Festival Ortiz Tirado cada enero. Pero la mejor manera de conocerlo no es en un fin de semana de festival — es a pie, sin prisa, con la app abierta.</span>
          <span data-en>Today it's an annual gathering point for artists, musicians and travelers who come for the Ortiz Tirado Festival every January. But the best way to know it isn't a festival weekend — it's on foot, slowly, with the app open.</span>
        </p>
      </div>
    </div>
  </div>
</section>

<!-- CATEGORIES -->
<section id="categories" style="background:var(--bg-tint);">
  <div class="wrap">
    <div style="max-width:680px;margin-bottom:48px;">
      <span class="eyebrow"><span class="dot"></span><span data-es>Categorías</span><span data-en>Categories</span></span>
      <h2 style="margin-top:20px;">
        <span data-es>180+ puntos de interés, organizados como los pensarías.</span>
        <span data-en>180+ points of interest, organized how you'd think of them.</span>
      </h2>
    </div>

    <div class="grid-3">
      <div class="cat-card" style="--accent:#9C27B0;">
        <div class="head"><div class="pin"></div></div>
        <div class="body">
          <h3><span data-es>Museos</span><span data-en>Museums</span></h3>
          <div class="count">14 <span data-es>lugares</span><span data-en>places</span></div>
          <p><span data-es>Costumbrista, Casa de María Félix, ruta de la plata, casonas-museo.</span><span data-en>Costumbrista, Casa de María Félix, silver route, museum-homes.</span></p>
        </div>
      </div>
      <div class="cat-card" style="--accent:#FF5722;">
        <div class="head"><div class="pin"></div></div>
        <div class="body">
          <h3><span data-es>Restaurantes</span><span data-en>Restaurants</span></h3>
          <div class="count">38 <span data-es>lugares</span><span data-en>places</span></div>
          <p><span data-es>Cocina sonorense, fondas locales, cafés de patio, restaurantes en casonas restauradas.</span><span data-en>Sonoran cuisine, local diners, patio cafés, restaurants in restored mansions.</span></p>
        </div>
      </div>
      <div class="cat-card" style="--accent:#2196F3;">
        <div class="head"><div class="pin"></div></div>
        <div class="body">
          <h3><span data-es>Hoteles</span><span data-en>Hotels</span></h3>
          <div class="count">22 <span data-es>lugares</span><span data-en>places</span></div>
          <p><span data-es>Desde haciendas históricas hasta posadas familiares. Filtrados por tipo y zona.</span><span data-en>From historic haciendas to family inns. Filtered by type and area.</span></p>
        </div>
      </div>
      <div class="cat-card" style="--accent:#00BCD4;">
        <div class="head"><div class="pin"></div></div>
        <div class="body">
          <h3><span data-es>Iglesias</span><span data-en>Churches</span></h3>
          <div class="count">8 <span data-es>lugares</span><span data-en>places</span></div>
          <p><span data-es>La Catedral, capillas barrocas, conventos. Horarios de misa actualizados.</span><span data-en>The Cathedral, baroque chapels, convents. Mass times kept up to date.</span></p>
        </div>
      </div>
      <div class="cat-card" style="--accent:#4CAF50;">
        <div class="head"><div class="pin"></div></div>
        <div class="body">
          <h3><span data-es>Plazas y parques</span><span data-en>Plazas & parks</span></h3>
          <div class="count">11 <span data-es>lugares</span><span data-en>places</span></div>
          <p><span data-es>Plaza de Armas, Jardín Juárez, miradores y rutas naturales cercanas.</span><span data-en>Plaza de Armas, Jardín Juárez, miradors and nearby nature trails.</span></p>
        </div>
      </div>
      <div class="cat-card" style="--accent:#FFC107;">
        <div class="head"><div class="pin"></div></div>
        <div class="body">
          <h3><span data-es>Tiendas y artesanías</span><span data-en>Shops & crafts</span></h3>
          <div class="count">27 <span data-es>lugares</span><span data-en>places</span></div>
          <p><span data-es>Talleres de plata, artesanos textiles, tiendas de tortilla — el comercio local que vale la pena.</span><span data-en>Silver workshops, textile artisans, tortilla shops — local commerce worth visiting.</span></p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- WHEN TO VISIT -->
<section id="when">
  <div class="wrap">
    <div style="max-width:680px;">
      <span class="eyebrow"><span class="dot"></span><span data-es>Cuándo ir</span><span data-en>When to go</span></span>
      <h2 style="margin-top:20px;">
        <span data-es>Cada estación es un Álamos distinto.</span>
        <span data-en>Each season is a different Álamos.</span>
      </h2>
    </div>

    <div class="timeline">
      <div class="tl-card">
        <div class="month"><span data-es>ENE — FEB</span><span data-en>JAN — FEB</span></div>
        <h3><span data-es>Festival Ortiz Tirado</span><span data-en>Ortiz Tirado Festival</span></h3>
        <p><span data-es>El evento del año. Música clásica en la Catedral, plazas llenas, hospedaje agotado. Reserva con meses.</span><span data-en>The event of the year. Classical music in the Cathedral, full plazas, sold-out lodging. Book months ahead.</span></p>
      </div>
      <div class="tl-card">
        <div class="month"><span data-es>MAR — MAY</span><span data-en>MAR — MAY</span></div>
        <h3><span data-es>Primavera ideal</span><span data-en>Ideal spring</span></h3>
        <p><span data-es>Clima perfecto: 22–28°C. Jacarandas en flor. La mejor temporada para caminar el centro.</span><span data-en>Perfect weather: 22–28°C. Jacarandas in bloom. Best season for walking the center.</span></p>
      </div>
      <div class="tl-card">
        <div class="month"><span data-es>JUN — SEP</span><span data-en>JUN — SEP</span></div>
        <h3><span data-es>Calor y lluvia</span><span data-en>Heat & rain</span></h3>
        <p><span data-es>Hace calor (hasta 38°C) y llueve por la tarde. Vegetación intensa, menos turistas, mejores precios.</span><span data-en>Hot (up to 38°C) and afternoon rain. Lush vegetation, fewer tourists, better prices.</span></p>
      </div>
      <div class="tl-card">
        <div class="month"><span data-es>OCT — DIC</span><span data-en>OCT — DEC</span></div>
        <h3><span data-es>Otoño suave</span><span data-en>Soft autumn</span></h3>
        <p><span data-es>Temperaturas amables, día de muertos, y el pueblo empieza a prepararse para el festival.</span><span data-en>Mild temperatures, Day of the Dead, and the town starts preparing for the festival.</span></p>
      </div>
    </div>
  </div>
</section>

<!-- ICONIC PLACES -->
<section style="background:var(--bg-tint);">
  <div class="wrap">
    <div style="max-width:680px;margin-bottom:48px;">
      <span class="eyebrow"><span class="dot"></span><span data-es>Imprescindibles</span><span data-en>Must-sees</span></span>
      <h2 style="margin-top:20px;">
        <span data-es>Cinco lugares por los que vale la pena venir.</span>
        <span data-en>Five places worth the trip on their own.</span>
      </h2>
    </div>

    <div style="display:grid;grid-template-columns:1.5fr 1fr 1fr;grid-template-rows:auto auto;gap:20px;">
      <article style="grid-row:span 2;border:1px solid var(--line-soft);border-radius:var(--r-lg);overflow:hidden;background:var(--surface);">
        <div class="placeholder" style="aspect-ratio:5/4;border-radius:0;"><span>catedral · la purísima concepción</span></div>
        <div style="padding:28px;">
          <span class="tag" style="--accent:#00BCD4;"><span class="dot"></span><span data-es>Iglesias</span><span data-en>Churches</span></span>
          <h3 style="margin:14px 0 10px;font-size:22px;"><span data-es>Catedral de la Purísima Concepción</span><span data-en>Cathedral of La Purísima Concepción</span></h3>
          <p style="font-size:14.5px;color:var(--fg-2);line-height:1.6;">
            <span data-es>Terminada en 1804, una de las catedrales coloniales mejor conservadas del noroeste de México. Su torre domina el horizonte de Álamos.</span>
            <span data-en>Finished in 1804, one of the best-preserved colonial cathedrals in northwestern Mexico. Its tower dominates the Álamos skyline.</span>
          </p>
        </div>
      </article>

      <article style="border:1px solid var(--line-soft);border-radius:var(--r-lg);overflow:hidden;background:var(--surface);">
        <div class="placeholder" style="aspect-ratio:4/3;border-radius:0;"><span>museo · costumbrista</span></div>
        <div style="padding:20px;">
          <span class="tag" style="--accent:#9C27B0;font-size:11px;"><span class="dot"></span>Museo</span>
          <h3 style="margin:10px 0 6px;font-size:16px;"><span data-es>Museo Costumbrista</span><span data-en>Costumbrist Museum</span></h3>
          <p style="font-size:13px;color:var(--fg-2);"><span data-es>Vida cotidiana sonorense</span><span data-en>Daily Sonoran life</span></p>
        </div>
      </article>

      <article style="border:1px solid var(--line-soft);border-radius:var(--r-lg);overflow:hidden;background:var(--surface);">
        <div class="placeholder" style="aspect-ratio:4/3;border-radius:0;"><span>casa · maría félix</span></div>
        <div style="padding:20px;">
          <span class="tag" style="--accent:#9C27B0;font-size:11px;"><span class="dot"></span><span data-es>Casa-museo</span><span data-en>House-museum</span></span>
          <h3 style="margin:10px 0 6px;font-size:16px;"><span data-es>Casa de María Félix</span><span data-en>María Félix's House</span></h3>
          <p style="font-size:13px;color:var(--fg-2);"><span data-es>La Doña nació aquí</span><span data-en>La Doña was born here</span></p>
        </div>
      </article>

      <article style="border:1px solid var(--line-soft);border-radius:var(--r-lg);overflow:hidden;background:var(--surface);">
        <div class="placeholder" style="aspect-ratio:4/3;border-radius:0;"><span>plaza · de armas</span></div>
        <div style="padding:20px;">
          <span class="tag" style="--accent:#4CAF50;font-size:11px;"><span class="dot"></span>Plaza</span>
          <h3 style="margin:10px 0 6px;font-size:16px;"><span data-es>Plaza de Armas</span><span data-en>Plaza de Armas</span></h3>
          <p style="font-size:13px;color:var(--fg-2);"><span data-es>Corazón del Pueblo Mágico</span><span data-en>Heart of the Magic Town</span></p>
        </div>
      </article>

      <article style="border:1px solid var(--line-soft);border-radius:var(--r-lg);overflow:hidden;background:var(--surface);">
        <div class="placeholder" style="aspect-ratio:4/3;border-radius:0;"><span>mirador · cerro de la cruz</span></div>
        <div style="padding:20px;">
          <span class="tag" style="--accent:#4CAF50;font-size:11px;"><span class="dot"></span><span data-es>Mirador</span><span data-en>Viewpoint</span></span>
          <h3 style="margin:10px 0 6px;font-size:16px;"><span data-es>Cerro de la Cruz</span><span data-en>Cerro de la Cruz</span></h3>
          <p style="font-size:13px;color:var(--fg-2);"><span data-es>Toda Álamos a tus pies</span><span data-en>All of Álamos at your feet</span></p>
        </div>
      </article>
    </div>
  </div>
</section>

<!-- CTA -->
<section>
  <div class="wrap">
    <div class="cta-band">
      <div>
        <h2><span data-es>Tu primera ruta te está esperando.</span><span data-en>Your first route is waiting.</span></h2>
        <p class="lede" style="margin-top:16px;">
          <span data-es>Abre TrazaGo y arma un día completo en menos de cinco minutos.</span>
          <span data-en>Open TrazaGo and build a full day in under five minutes.</span>
        </p>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <a href="download.html" class="btn btn-primary" style="background:#fff;color:var(--navy);justify-content:center;">
          <span data-es>Descargar gratis</span><span data-en>Download free</span>
        </a>
        <a href="features.html" class="btn btn-ghost" style="background:transparent;border-color:rgba(255,255,255,.3);color:#fff;justify-content:center;">
          <span data-es>Ver todas las funciones</span><span data-en>See all features</span>
        </a>
      </div>
    </div>
  </div>
</section>
`;
