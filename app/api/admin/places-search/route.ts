import { NextRequest, NextResponse } from "next/server";

// Centro de Álamos, Sonora
const ALAMOS_LAT = 27.0277;
const ALAMOS_LNG = -108.9389;
const SEARCH_RADIUS_METERS = 8000; // ~8 km

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  if (!query?.trim() || query.trim().length < 3) {
    return NextResponse.json({ predictions: [] });
  }

  const apiKey = process.env.PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "PLACES_API_KEY no configurada" }, { status: 500 });
  }

  try {
    const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
      },
      body: JSON.stringify({
        input: query,
        locationBias: {
          circle: {
            center: { latitude: ALAMOS_LAT, longitude: ALAMOS_LNG },
            radius: SEARCH_RADIUS_METERS,
          },
        },
        languageCode: "es-MX",
        regionCode: "MX",
      }),
    });

    const json = await res.json();

    if (json.error) {
      console.error("Places autocomplete error:", json.error);
      return NextResponse.json({ error: json.error.message }, { status: 500 });
    }

    type Suggestion = {
      placePrediction?: {
        placeId: string;
        structuredFormat?: {
          mainText?: { text: string };
          secondaryText?: { text: string };
        };
        text?: { text: string };
      };
    };

    const predictions = (json.suggestions ?? [])
      .filter((s: Suggestion) => s.placePrediction)
      .map((s: Suggestion) => ({
        placeId: s.placePrediction!.placeId,
        mainText:
          s.placePrediction!.structuredFormat?.mainText?.text ??
          s.placePrediction!.text?.text ??
          "",
        secondaryText:
          s.placePrediction!.structuredFormat?.secondaryText?.text ?? "",
      }));

    return NextResponse.json({ predictions });
  } catch (err) {
    console.error("Places search error:", err);
    return NextResponse.json({ error: "Error al consultar Google Places" }, { status: 500 });
  }
}
