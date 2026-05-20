import { NextRequest, NextResponse } from "next/server";

const FIELD_MASK = [
  "id", "displayName", "formattedAddress", "location",
  "nationalPhoneNumber", "internationalPhoneNumber", "websiteUri",
  "regularOpeningHours", "rating", "userRatingCount", "photos",
  "editorialSummary", "primaryTypeDisplayName",
].join(",");

function parseMapsUrl(url: string) {
  try {
    const u = new URL(url);

    // Solo extraer Place IDs reales (formato ChIJ...) — ignorar CIDs y textos de búsqueda
    const haystack = u.pathname + (u.search ?? "");
    const pidMatch = haystack.match(/!1s(ChIJ[^!&/]+)/);
    const placeId = pidMatch?.[1] ?? null;

    // Coordenadas desde @lat,lng
    const coordMatch = u.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    const lat = coordMatch ? parseFloat(coordMatch[1]) : null;
    const lng = coordMatch ? parseFloat(coordMatch[2]) : null;

    // Nombre desde /place/NOMBRE/
    const nameMatch = u.pathname.match(/\/place\/([^/@]+)/);
    const name = nameMatch
      ? decodeURIComponent(nameMatch[1].replace(/\+/g, " "))
      : null;

    return { placeId, name, lat, lng };
  } catch {
    return { placeId: null, name: null, lat: null, lng: null };
  }
}

async function resolveShortUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; bot)" },
    });
    return res.url !== url ? res.url : url;
  } catch {
    return url;
  }
}

async function textSearch(apiKey: string, query: string, lat: number | null, lng: number | null): Promise<string | null> {
  const body: Record<string, unknown> = {
    textQuery: query,
    maxResultCount: 1,
    languageCode: "es",
  };
  if (lat != null && lng != null) {
    body.locationBias = {
      circle: { center: { latitude: lat, longitude: lng }, radius: 3000 },
    };
  }
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.id",
      "Content-Type": "application/json",
      "Accept-Language": "es-MX",
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  return json.places?.[0]?.id ?? null;
}

async function fetchDetails(apiKey: string, placeId: string) {
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
      "Accept-Language": "es-MX",
    },
  });
  const place = await res.json();
  if (place.error) throw new Error(place.error.message);

  type PlacePhoto = { name?: string };
  const photos: string[] = (place.photos ?? [])
    .slice(0, 6)
    .map((p: PlacePhoto) =>
      p.name ? `https://places.googleapis.com/v1/${p.name}/media?key=${apiKey}&maxWidthPx=1600` : ""
    )
    .filter(Boolean);

  return {
    googlePlaceId: place.id ?? placeId,
    nombre: place.displayName?.text ?? "",
    direccion: place.formattedAddress ?? "",
    telefono: place.nationalPhoneNumber ?? place.internationalPhoneNumber ?? "",
    sitioWeb: place.websiteUri ?? "",
    horarios: (place.regularOpeningHours?.weekdayDescriptions ?? []).join("\n"),
    rating: typeof place.rating === "number" ? place.rating : 0,
    reviewCount: typeof place.userRatingCount === "number" ? place.userRatingCount : 0,
    ubicacion:
      place.location?.latitude != null
        ? { lat: place.location.latitude, lng: place.location.longitude }
        : null,
    imagenUrl: photos[0] ?? "",
    imagenesGaleria: photos.slice(1),
    _editorialSummary: place.editorialSummary?.text ?? "",
  };
}

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url?.trim()) {
    return NextResponse.json({ error: "URL requerida" }, { status: 400 });
  }

  const apiKey = process.env.PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "PLACES_API_KEY no configurada" }, { status: 500 });
  }

  try {
    // Resolver links cortos (goo.gl, maps.app.goo.gl)
    const resolved = /goo\.gl|maps\.app/i.test(url) ? await resolveShortUrl(url) : url;

    let { placeId, name, lat, lng } = parseMapsUrl(resolved);

    // Si no hay Place ID en la URL, buscar por nombre + coordenadas
    if (!placeId && name) {
      placeId = await textSearch(apiKey, name, lat, lng);
    }

    if (!placeId) {
      return NextResponse.json(
        { error: "No se pudo identificar el lugar. Usa un link de Google Maps que incluya el nombre del lugar." },
        { status: 400 }
      );
    }

    const data = await fetchDetails(apiKey, placeId);
    return NextResponse.json(data);
  } catch (err) {
    console.error("maps-url error:", err);
    return NextResponse.json({ error: "Error al procesar el link." }, { status: 500 });
  }
}
