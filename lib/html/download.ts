// Pre-compute decorative QR pattern at module load (same algorithm as TRAZAGOV2's inline script).
function buildQrCells(): string {
  let h = 0;
  const seed = "trazago-2026";
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  function rng() {
    h = (h * 1664525 + 1013904223) >>> 0;
    return h / 0xffffffff;
  }
  const cells: string[] = [];
  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 12; x++) {
      const corner =
        (x < 3 && y < 3) || (x > 8 && y < 3) || (x < 3 && y > 8);
      const innerCorner =
        (x === 1 && y === 1) || (x === 10 && y === 1) || (x === 1 && y === 10);
      const fill = corner
        ? !innerCorner &&
          (x === 0 ||
            x === 2 ||
            x === 9 ||
            x === 11 ||
            y === 0 ||
            y === 2 ||
            y === 9 ||
            y === 11)
        : rng() > 0.55;
      cells.push(
        `<div${fill ? ' class="b"' : ""} style="grid-column:${x + 1};grid-row:${y + 1};"></div>`
      );
    }
  }
  return cells.join("");
}

const qrCells = buildQrCells();

export const downloadHtml = `
<style>
  .download-hero { padding: 80px 0; }
  .store-btn {
    display: inline-flex; align-items: center; gap: 14px;
    padding: 14px 22px; border-radius: 14px;
    background: var(--navy); color: #fff;
    transition: background .15s ease;
    min-width: 220px;
  }
  .store-btn:hover { background: var(--navy-soft); }
  .store-btn svg { flex-shrink: 0; }
  .store-btn .label { display: flex; flex-direction: column; line-height: 1.15; gap: 2px; }
  .store-btn .small { font-size: 11px; opacity: .8; }
  .store-btn .big { font-size: 17px; font-weight: 600; letter-spacing: -0.01em; }

  .qr-card {
    background: var(--surface); border: 1px solid var(--line-soft);
    border-radius: var(--r-xl); padding: 40px;
    display: flex; gap: 32px; align-items: center;
  }
  .qr-box {
    width: 200px; height: 200px; flex-shrink: 0;
    background: var(--bg);
    border: 1px solid var(--line);
    border-radius: var(--r-md);
    display: grid; grid-template-columns: repeat(12, 1fr); grid-template-rows: repeat(12, 1fr);
    padding: 14px; gap: 2px;
  }
  .qr-box .b { background: var(--navy); border-radius: 2px; }

  .req-row { display: flex; justify-content: space-between; gap: 32px; padding: 18px 0; border-bottom: 1px solid var(--line-soft); }
  .req-row:last-child { border-bottom: 0; }
  .req-row .key { font-family: var(--mono); font-size: 13px; color: var(--fg-3); text-transform: uppercase; letter-spacing: .06em; }
  .req-row .val { font-size: 15px; font-weight: 500; color: var(--navy); text-align: right; }

  @media (max-width: 700px) {
    .qr-card { flex-direction: column; text-align: center; padding: 28px; }
  }
</style>

<!-- HERO -->
<section class="download-hero">
  <div class="wrap">
    <div class="hero-grid">
      <div>
        <span class="eyebrow"><span class="dot"></span><span data-es>Descargar</span><span data-en>Download</span></span>
        <h1 style="margin-top:24px;">
          <span data-es>Llévate Álamos en el bolsillo.</span>
          <span data-en>Take Álamos in your pocket.</span>
        </h1>
        <p class="lede" style="margin-top:24px;">
          <span data-es>Gratis. Sin ads. Sin suscripciones. Solo descarga la app y empieza a explorar.</span>
          <span data-en>Free. No ads. No subscriptions. Just download and start exploring.</span>
        </p>

        <div style="display:flex;gap:12px;margin-top:36px;flex-wrap:wrap;">
          <a href="#" class="store-btn">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M17.05 12.04c.02 2.65 2.31 3.53 2.34 3.55-.02.07-.36 1.25-1.19 2.46-.72 1.05-1.46 2.1-2.63 2.12-1.15.02-1.52-.69-2.84-.69-1.32 0-1.73.67-2.82.71-1.13.04-2-1.13-2.72-2.19-1.48-2.15-2.61-6.07-1.09-8.71.75-1.31 2.1-2.14 3.56-2.16 1.11-.02 2.16.75 2.84.75.68 0 1.95-.92 3.29-.79.56.02 2.13.23 3.13 1.71-.08.05-1.87 1.09-1.85 3.24M14.97 4.85c.61-.74 1.02-1.77.91-2.79-.88.04-1.94.58-2.57 1.31-.56.65-1.05 1.69-.92 2.69.98.08 1.97-.5 2.58-1.21"/></svg>
            <div class="label">
              <span class="small"><span data-es>Descarga en el</span><span data-en>Download on the</span></span>
              <span class="big">App Store</span>
            </div>
          </a>
          <a href="#" class="store-btn">
            <svg width="26" height="26" viewBox="0 0 512 512"><path fill="#fff" d="M325.3 234.3 104.3 13.31C95.9 4.91 84.59 0 72.91 0 49.14 0 30 19.15 30 42.91v426.18C30 492.85 49.15 512 72.91 512c11.69 0 23-4.91 31.37-13.31L325.3 277.7c12.79-12.79 12.79-33.7 0-46.5z"/><path fill="#fff" d="M431.9 218.9 366.4 181.4l-66 66 66 66 65.5-37.5c17.6-10.1 17.6-35.4 0-45.5z" opacity=".9"/></svg>
            <div class="label">
              <span class="small"><span data-es>Disponible en</span><span data-en>Get it on</span></span>
              <span class="big">Google Play</span>
            </div>
          </a>
        </div>

        <div style="margin-top:40px;display:flex;gap:8px;flex-wrap:wrap;">
          <span class="tag" style="--accent:#2E7D32;"><span class="dot"></span><span data-es>Gratis</span><span data-en>Free</span></span>
          <span class="tag" style="--accent:#5CB8B2;"><span class="dot"></span><span data-es>Sin ads</span><span data-en>Ad-free</span></span>
          <span class="tag" style="--accent:#9C27B0;"><span class="dot"></span><span data-es>Modo invitado</span><span data-en>Guest mode</span></span>
          <span class="tag" style="--accent:#F59E0B;"><span class="dot"></span><span data-es>Offline parcial</span><span data-en>Partial offline</span></span>
        </div>
      </div>

      <div>
        <div class="phone">
          <div class="phone-screen">
            <div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:36px;text-align:center;background:var(--bg);">
              <div style="width:140px;height:140px;border-radius:50%;background:rgba(46,125,50,.10);display:flex;align-items:center;justify-content:center;font-size:64px;margin-bottom:24px;">🗺️</div>
              <h2 style="font-size:22px;color:var(--navy);font-weight:700;margin-bottom:12px;">
                <span data-es>Explora Álamos</span><span data-en>Explore Álamos</span>
              </h2>
              <p style="font-size:13px;color:var(--fg-2);line-height:1.5;">
                <span data-es>Descubre lugares históricos, eventos culturales y experiencias únicas en este Pueblo Mágico.</span>
                <span data-en>Discover historic places, cultural events and unique experiences in this Magic Town.</span>
              </p>
              <div style="display:flex;gap:6px;margin-top:28px;">
                <div style="width:22px;height:6px;border-radius:3px;background:var(--green);"></div>
                <div style="width:6px;height:6px;border-radius:3px;background:rgba(46,125,50,.3);"></div>
                <div style="width:6px;height:6px;border-radius:3px;background:rgba(46,125,50,.3);"></div>
              </div>
              <button style="margin-top:32px;width:100%;padding:13px;border-radius:14px;background:var(--green);color:#fff;font-size:14px;font-weight:600;">
                <span data-es>Comenzar</span><span data-en>Get started</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- QR -->
<section class="tight">
  <div class="wrap">
    <div class="qr-card">
      <div class="qr-box" aria-hidden="true" id="qr">${qrCells}</div>
      <div>
        <h2 style="font-size:28px;"><span data-es>Escanea con tu teléfono</span><span data-en>Scan with your phone</span></h2>
        <p style="font-size:15.5px;color:var(--fg-2);margin-top:12px;line-height:1.6;">
          <span data-es>Apunta tu cámara al código y descarga TrazaGo directamente. Funciona en iOS y Android — detecta automáticamente tu sistema.</span>
          <span data-en>Point your camera at the code and download TrazaGo directly. Works on iOS and Android — auto-detects your system.</span>
        </p>
        <div style="display:flex;gap:12px;margin-top:24px;flex-wrap:wrap;">
          <a href="#" class="btn btn-ghost"><span data-es>Copiar enlace</span><span data-en>Copy link</span></a>
          <a href="#" class="btn-link"><span data-es>Enviar a mi correo</span><span data-en>Email it to me</span></a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- REQUIREMENTS -->
<section>
  <div class="wrap">
    <div style="display:grid;grid-template-columns:1fr 1.4fr;gap:80px;align-items:start;">
      <div>
        <span class="eyebrow"><span class="dot"></span><span data-es>Compatibilidad</span><span data-en>Compatibility</span></span>
        <h2 style="margin-top:20px;">
          <span data-es>Funciona en casi cualquier teléfono.</span>
          <span data-en>Works on almost any phone.</span>
        </h2>
        <p style="font-size:15.5px;color:var(--fg-2);margin-top:16px;line-height:1.6;">
          <span data-es>Diseñada para iOS 14+ y Android 7+. La app pesa menos de 40 MB y usa almacenamiento offline para que el mapa funcione sin internet.</span>
          <span data-en>Built for iOS 14+ and Android 7+. The app is under 40 MB and uses offline storage so the map works without internet.</span>
        </p>
      </div>

      <div>
        <div class="req-row">
          <div class="key">iOS</div>
          <div class="val">14.0 +</div>
        </div>
        <div class="req-row">
          <div class="key">Android</div>
          <div class="val">7.0 (SDK 24) +</div>
        </div>
        <div class="req-row">
          <div class="key"><span data-es>Tamaño descarga</span><span data-en>Download size</span></div>
          <div class="val">~38 MB</div>
        </div>
        <div class="req-row">
          <div class="key"><span data-es>Idiomas</span><span data-en>Languages</span></div>
          <div class="val"><span data-es>Español, Inglés</span><span data-en>Spanish, English</span></div>
        </div>
        <div class="req-row">
          <div class="key"><span data-es>Permisos requeridos</span><span data-en>Required permissions</span></div>
          <div class="val"><span data-es>Ubicación, Notificaciones</span><span data-en>Location, Notifications</span></div>
        </div>
        <div class="req-row">
          <div class="key"><span data-es>Permisos opcionales</span><span data-en>Optional permissions</span></div>
          <div class="val"><span data-es>Cámara (check-ins), Galería</span><span data-en>Camera (check-ins), Gallery</span></div>
        </div>
        <div class="req-row">
          <div class="key"><span data-es>Datos móviles</span><span data-en>Mobile data</span></div>
          <div class="val">~5 MB/<span data-es>día</span><span data-en>day</span></div>
        </div>
        <div class="req-row">
          <div class="key"><span data-es>Versión actual</span><span data-en>Current version</span></div>
          <div class="val">2.4.0 — <span data-es>Abril 2026</span><span data-en>April 2026</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section style="padding-top:0;">
  <div class="wrap">
    <div class="cta-band">
      <div>
        <h2><span data-es>180+ lugares te están esperando.</span><span data-en>180+ places are waiting.</span></h2>
        <p class="lede" style="margin-top:16px;">
          <span data-es>Descarga TrazaGo ahora y arma tu primera ruta antes de salir.</span>
          <span data-en>Download TrazaGo now and build your first route before you leave.</span>
        </p>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <a href="#" class="btn btn-primary" style="background:#fff;color:var(--navy);justify-content:center;">App Store</a>
        <a href="#" class="btn btn-ghost" style="background:transparent;border-color:rgba(255,255,255,.3);color:#fff;justify-content:center;">Google Play</a>
      </div>
    </div>
  </div>
</section>
`;
