import { NextRequest, NextResponse } from "next/server";

const FIELD_MASK = [
  "id", "displayName", "formattedAddress", "location",
  "nationalPhoneNumber", "internationalPhoneNumber", "websiteUri",
  "regularOpeningHours", "rating", "userRatingCount", "photos",
  "editorialSummary", "primaryTypeDisplayName",
].join(",");

interface ParsedUrl {
  placeId: string | null;
  cid: string | null;
  name: string | null;
  lat: number | null;
  lng: number | null;
}

function parseMapsUrl(url: string): ParsedUrl {
  try {
    const u = new URL(url);
    const haystack = u.pathname + (u.search ?? "");

    // Estrategia 1: Place ID en formato ChIJ... (URLs con data= de lugar compartido)
    const chijMatch = haystack.match(/!1s(ChIJ[^!&/]+)/);
    const placeId = chijMatch?.[1] ?? null;

    // Estrategia 2: CID hex "0xHIGH:0xLOW" (URLs del buscador de Maps)
    const cidMatch = haystack.match(/!1s(0x[0-9a-f]+:0x[0-9a-f]+)/i);
    const cid = cidMatch?.[1] ?? null;

    // Estrategia 3: query param ?place_id=
    const placeIdParam = u.searchParams.get("place_id") ?? null;

    // Coordenadas: @lat,lng en pathname
    const coordMatch = u.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    const lat = coordMatch ? parseFloat(coordMatch[1]) : null;
    const lng = coordMatch ? parseFloat(coordMatch[2]) : null;

    // Nombre: /place/NAME/ tiene prioridad; fallback a ?q= / ?query=
    const nameMatch = u.pathname.match(/\/place\/([^/@]+)/);
    const nameFromPath = nameMatch
      ? decodeURIComponent(nameMatch[1].replace(/\+/g, " "))
      : null;
    const nameFromQ =
      u.searchParams.get("q") ?? u.searchParams.get("query") ?? null;
    const name = nameFromPath ?? nameFromQ;

    return { placeId: placeId ?? placeIdParam, cid, name, lat, lng };
  } catch {
    return { placeId: null, cid: null, name: null, lat: null, lng: null };
  }
}

// Resuelve URLs cortas (maps.app.goo.gl) siguiendo redirects manualmente
async function resolveShortUrl(url: string): Promise<string> {
  let current = url;
  for (let i = 0; i < 5; i++) {
    try {
      const res = await fetch(current, {
        redirect: "manual",
        headers: { "User-Agent": "Mozilla/5.0 (compatible; TrazaGoBot/1.0)" },
      });
      const loc = res.headers.get("location");
      if (!loc) break;
      current = loc.startsWith("http") ? loc : new URL(loc, current).toString();
      if (current.includes("maps.google.") || current.includes("google.com/maps") || current.includes("google.com.mx/maps")) break;
    } catch {
      break;
    }
  }
  return current;
}

// Convierte CID hex "0xHIGH:0xLOW" a Place ID via old Places API
async function cidToPlaceId(apiKey: string, cid: string): Promise<string | null> {
  try {
    const parts = cid.split(":");
    if (parts.length !== 2) return null;
    const lowHex = parts[1];
    const decimalCid = BigInt(lowHex).toString();

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?cid=${decimalCid}&fields=place_id&key=${apiKey}`,
      { headers: { "Accept-Language": "es-MX" } }
    );
    const json = await res.json();
    return (json.result?.place_id as string) ?? null;
  } catch {
    return null;
  }
}

async function textSearch(
  apiKey: string,
  query: string,
  lat: number | null,
  lng: number | null
): Promise<string | null> {
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
  return (json.places?.[0]?.id as string) ?? null;
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
    _primaryType: place.primaryTypeDisplayName?.text ?? "",
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

    let { placeId, cid, name, lat, lng } = parseMapsUrl(resolved);

    // Prioridad 2: convertir CID hex a Place ID via old Places API
    if (!placeId && cid) {
      placeId = await cidToPlaceId(apiKey, cid);
    }

    // Prioridad 3: buscar por nombre + coords (new Places API)
    if (!placeId && name) {
      placeId = await textSearch(apiKey, name, lat, lng);
    }

    if (!placeId) {
      return NextResponse.json(
        {
          error:
            "No se pudo identificar el lugar. Intenta con un link de Google Maps que incluya el nombre del lugar visible en la URL.",
        },
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
