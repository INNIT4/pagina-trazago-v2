# pagina-trazago

Landing y sitio multipágina para **TrazaGo** — la app de descubrimiento turístico de Álamos, Sonora.

## Stack

- **Next.js 15** (App Router, React 19, TypeScript)
- **Tailwind CSS** + variables CSS para tema
- **Motion** (animaciones)
- **MDX** vía `next-mdx-remote` + `gray-matter` (blog)
- **Geist** (sans + mono) + **Fraunces** (display serif variable)

## Estructura

```
app/
  [locale]/
    page.tsx              # Home
    caracteristicas/      # Features
    alamos/               # About Álamos
    descarga/             # Download
    blog/                 # Blog index + [slug]
    contacto/             # Contact + FAQ
    privacidad/           # Privacy
    terminos/             # Terms
  layout.tsx              # Root (fonts)
  page.tsx                # Redirect → /es
  globals.css

components/               # Navigation, Footer, AppMockup, Reveal, etc.
content/blog/{es,en}/*.mdx  # Posts del blog
lib/                      # i18n + blog helpers + cn util
public/                   # favicon, assets estáticos
```

## i18n

Bilingüe (es / en) por segmento de ruta dinámico `[locale]`. El selector vive en la navegación. Las traducciones están en `lib/dictionaries/{es,en}.json`.

## Aesthetic direction

Minimalismo editorial tech con alma cálida.

- Base: hueso/crema (`bone-50`) — nunca blanco frío.
- Texto: charcoal cálido (`ink-900`).
- Acento: terracota (`clay-500`/`clay-600`) — sutil nod a la cantera de Álamos.
- Tipografía display: **Fraunces** variable (con eje `opsz` para óptica grande).
- Tipografía UI: **Geist Sans**.
- Acentos / labels: **Geist Mono**.
- Motion: `motion/react` con curvas suaves (`cubic-bezier(0.22, 1, 0.36, 1)`).

## Setup

```bash
cd c:\Users\josei\pagina-trazago
npm install
npm run dev
# abre http://localhost:3000  →  redirige a /es
```

## Deploy

Optimizado para **Vercel**. Sin variables de entorno requeridas para arrancar.

```bash
vercel
```

## Próximos pasos

1. Reemplazar placeholders (`AppMockup` por screenshots reales, `QRCode` decorativo por uno funcional apuntando a Google Play).
2. Conectar el formulario de contacto a un endpoint real (API route + email service).
3. Suscripción de iOS a una lista (Resend / Loops / Mailchimp).
4. Añadir `sitemap.xml` y `robots.txt` cuando se publique el dominio.
5. Configurar `metadataBase` con el dominio final en `app/layout.tsx`.
