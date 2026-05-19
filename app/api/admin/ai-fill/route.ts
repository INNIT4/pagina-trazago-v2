import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { nombre, categoria } = await req.json();

  if (!nombre?.trim()) {
    return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY no configurada" }, { status: 500 });
  }

  const prompt = `Eres un experto en turismo cultural de Álamos, Sonora, México (Pueblo Mágico).
Genera contenido para el siguiente punto de interés turístico:

Nombre: ${nombre}
Categoría: ${categoria || "General"}

Devuelve ÚNICAMENTE un JSON válido con esta estructura (sin markdown, sin explicaciones):
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

Para mejorMomentoDelDia usa solo valores de: AMANECER, MAÑANA, MEDIODIA, TARDE, ATARDECER, NOCHE
Para mejorTemporada usa solo valores de: Primavera, Verano, Otoño, Invierno, Todo el año
Para audienciaIdeal usa solo valores de: SOLO, PAREJA, FAMILIA, AMIGOS, NIÑOS, MAYORES`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // Extraer JSON aunque Gemini agregue backticks
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return NextResponse.json({ error: "Respuesta inesperada de Gemini" }, { status: 500 });
    }

    const data = JSON.parse(match[0]);
    return NextResponse.json(data);
  } catch (err) {
    console.error("AI fill error:", err);
    return NextResponse.json({ error: "Error al contactar Gemini" }, { status: 500 });
  }
}
