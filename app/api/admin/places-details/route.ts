import { NextRequest, NextResponse } from "next/server";

const FIELD_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "location",
  "nationalPhoneNumber",
  "internationalPhoneNumber",
  "websiteUri",
  "regularOpeningHours",
  "rating",
  "userRatingCount",
  "photos",
  "googleMapsUri",
  "editorialSummary",
  "primaryTypeDisplayName",
].join(",");

export async function POST(req: NextRequest) {
  const { placeId } = await req.json();

  if (!placeId?.trim()) {
    return NextResponse.json({ error: "placeId requerido" }, { status: 400 });
  }

  const apiKey = process.env.PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "PLACES_API_KEY no configurada" }, { status: 500 });
  }

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
        "Accept-Language": "es-MX",
      },
    });

    const place = await res.json();

    if (place.error) {
      console.error("Place details error:", place.error);
      return NextResponse.json({ error: place.error.message }, { status: 500 });
    }

    // Construir URLs de fotos usando el endpoint /media
    type PlacePhoto = { name?: string };
    const photos: string[] = (place.photos ?? [])
      .slice(0, 6)
      .map((p: PlacePhoto) =>
        p.name
          ? `https://places.googleapis.com/v1/${p.name}/media?key=${apiKey}&maxWidthPx=1600`
          : ""
      )
      .filter(Boolean);

    // Horarios formateados como texto humano
    const horariosTexto: string =
      (place.regularOpeningHours?.weekdayDescriptions ?? []).join("\n") ?? "";

    const normalized = {
      googlePlaceId: place.id ?? placeId,
      nombre: place.displayName?.text ?? "",
      direccion: place.formattedAddress ?? "",
      telefono: place.nationalPhoneNumber ?? place.internationalPhoneNumber ?? "",
      sitioWeb: place.websiteUri ?? "",
      horarios: horariosTexto,
      rating: typeof place.rating === "number" ? place.rating : 0,
      reviewCount: typeof place.userRatingCount === "number" ? place.userRatingCount : 0,
      ubicacion:
        place.location?.latitude != null && place.location?.longitude != null
          ? { lat: place.location.latitude, lng: place.location.longitude }
          : null,
      imagenUrl: photos[0] ?? "",
      imagenesGaleria: photos.slice(1),
      // Datos extra para enriquecer el prompt de IA
      _editorialSummary: place.editorialSummary?.text ?? "",
      _primaryType: place.primaryTypeDisplayName?.text ?? "",
    };

    return NextResponse.json(normalized);
  } catch (err) {
    console.error("Place details error:", err);
    return NextResponse.json({ error: "Error al consultar Google Places" }, { status: 500 });
  }
}
