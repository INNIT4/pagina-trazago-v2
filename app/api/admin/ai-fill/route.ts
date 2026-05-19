import { NextRequest, NextResponse } from "next/server";

const MODELS = [
  "gemini-2.5-flash-preview-05-20",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

async function callGemini(apiKey: string, prompt: string): Promise<string> {
  for (const model of MODELS) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1500 },
        }),
      }
    );

    const json = await res.json();

    // Si Gemini devolvió un error, intentar con el siguiente modelo
    if (json.error) {
      console.warn(`Model ${model} error:`, json.error.message);
      continue;
    }

    const text: string = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    if (text) return text;
  }
  return "";
}

export async function POST(req: NextRequest) {
  const { nombre, categoria } = await req.json();

  if (!nombre?.trim()) {
    return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY no configurada en Vercel" }, { status: 500 });
  }

  const prompt = `Eres un experto en turismo cultural de Álamos, Sonora, México (Pueblo Mágico).
Genera contenido para el siguiente punto de interés turístico:

Nombre: ${nombre}
Categoría: ${categoria || "General"}

Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta (sin markdown, sin bloques de código, sin texto antes ni después):
{
  "descripcionCorta": "máximo 140 caracteres, atractiva para turistas",
  "descripcion": "2-3 oraciones descriptivas en español",
  "descripcionLarga": "párrafo completo de 4-6 oraciones con contexto histórico/cultural en español",
  "descripcionCortaEn": "max 140 chars, attractive for tourists",
  "descripcionEn": "2-3 descriptive sentences in English",
  "descripcionLargaEn": "full paragraph 4-6 sentences with historical/cultural context in English",
  "historiaResumen": "breve resumen histórico del lugar en 2-3 oraciones",
  "tipsVisita": ["tip 1", "tip 2", "tip 3"],
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "mejorMomentoDelDia": ["MAÑANA", "TARDE"],
  "mejorTemporada": ["Todo el año"],
  "audienciaIdeal": ["FAMILIA", "PAREJA"]
}

Valores permitidos para mejorMomentoDelDia: AMANECER, MAÑANA, MEDIODIA, TARDE, ATARDECER, NOCHE
Valores permitidos para mejorTemporada: Primavera, Verano, Otoño, Invierno, Todo el año
Valores permitidos para audienciaIdeal: SOLO, PAREJA, FAMILIA, AMIGOS, NIÑOS, MAYORES`;

  try {
    const text = await callGemini(apiKey, prompt);

    if (!text) {
      return NextResponse.json({ error: "Gemini no devolvió respuesta. Verifica que la API key tenga acceso a la Gemini API." }, { status: 500 });
    }

    // Extraer el JSON aunque Gemini agregue backticks o texto extra
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error("Gemini raw response (no JSON found):", text.slice(0, 300));
      return NextResponse.json({ error: "La IA no devolvió JSON válido. Intenta de nuevo." }, { status: 500 });
    }

    const data = JSON.parse(match[0]);
    return NextResponse.json(data);
  } catch (err) {
    console.error("AI fill error:", err);
    return NextResponse.json({ error: "Error al procesar la respuesta de Gemini." }, { status: 500 });
  }
}
