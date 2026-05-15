"use client";

import { useState } from "react";
import { collection, writeBatch, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface PreviewRow { nombre: string; categoria: string; descripcion: string; direccion: string; [key: string]: unknown; }

export default function ImportarPage() {
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [raw, setRaw] = useState<PreviewRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [coleccion, setColeccion] = useState("lugares");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        let data: PreviewRow[] = [];
        if (file.name.endsWith(".json")) {
          const parsed = JSON.parse(text);
          data = Array.isArray(parsed) ? parsed : parsed.lugares ?? parsed.data ?? [];
        } else if (file.name.endsWith(".csv")) {
          const lines = text.split("\n").filter(Boolean);
          const headers = lines[0].split(",").map((h) => h.trim());
          data = lines.slice(1).map((line) => {
            const values = line.split(",");
            return Object.fromEntries(headers.map((h, i) => [h, values[i]?.trim() ?? ""])) as PreviewRow;
          });
        }
        setRaw(data);
        setPreview(data.slice(0, 5));
      } catch {
        setResult({ ok: false, message: "Error al parsear el archivo. Verifica el formato JSON/CSV." });
      }
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    if (!raw.length) return;
    if (!confirm(`¿Importar ${raw.length} documentos a la colección "${coleccion}"?`)) return;
    setImporting(true);
    setResult(null);

    try {
      const BATCH_SIZE = 500;
      let imported = 0;
      for (let i = 0; i < raw.length; i += BATCH_SIZE) {
        const batch = writeBatch(db);
        const chunk = raw.slice(i, i + BATCH_SIZE);
        chunk.forEach((item) => {
          const ref = doc(collection(db, coleccion));
          batch.set(ref, item);
        });
        await batch.commit();
        imported += chunk.length;
      }
      setResult({ ok: true, message: `✓ ${imported} documentos importados correctamente a "${coleccion}".` });
      setRaw([]);
      setPreview([]);
    } catch (err) {
      setResult({ ok: false, message: "Error durante la importación. Verifica los datos." });
      console.error(err);
    } finally {
      setImporting(false);
    }
  }

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-title">Importación masiva</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, alignItems: "start" }}>
        <div>
          <div className="admin-form-section">
            <div className="admin-form-section-title">Configuración</div>
            <div className="admin-form">
              <div className="admin-field">
                <label>Colección de destino</label>
                <select value={coleccion} onChange={(e) => setColeccion(e.target.value)}>
                  <option value="lugares">lugares</option>
                  <option value="eventos">eventos</option>
                  <option value="services">services</option>
                  <option value="emergency_contacts">emergency_contacts</option>
                  <option value="themed_routes">themed_routes</option>
                </select>
              </div>
              <div className="admin-field">
                <label>Archivo JSON o CSV</label>
                <input type="file" accept=".json,.csv" onChange={handleFile} />
              </div>
            </div>
          </div>

          {result && (
            <div className={result.ok ? "admin-card" : "admin-error"} style={result.ok ? { background: "#e8f5e9", color: "#2e7d32", border: "1px solid #c8e6c9", marginBottom: 16 } : { marginBottom: 16 }}>
              {result.message}
            </div>
          )}

          {preview.length > 0 && (
            <div className="admin-form-section">
              <div className="admin-form-section-title">Preview — primeros {preview.length} de {raw.length} registros</div>
              <div style={{ overflowX: "auto" }}>
                <table className="admin-table">
                  <thead>
                    <tr>{Object.keys(preview[0]).slice(0, 6).map((k) => <th key={k}>{k}</th>)}</tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i}>
                        {Object.values(row).slice(0, 6).map((v, j) => (
                          <td key={j} style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>
                            {String(v)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 16 }}>
                <button className="admin-btn admin-btn-green" onClick={handleImport} disabled={importing}>
                  {importing ? "Importando..." : `Importar ${raw.length} documentos →`}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="admin-card">
          <div className="admin-section-title" style={{ marginBottom: 12 }}>Formato esperado</div>
          <p style={{ fontSize: 13, color: "var(--fg-2)", marginBottom: 12, lineHeight: 1.6 }}>
            <strong>JSON:</strong> Array de objetos o <code>{`{"lugares": [...]}`}</code>
          </p>
          <pre style={{ fontSize: 11, background: "#f0f2f5", padding: 12, borderRadius: 8, overflow: "auto" }}>{`[
  {
    "nombre": "Templo...",
    "categoria": "Iglesia",
    "descripcion": "...",
    "direccion": "..."
  }
]`}</pre>
          <p style={{ fontSize: 13, color: "var(--fg-2)", marginTop: 12, marginBottom: 8, lineHeight: 1.6 }}>
            <strong>CSV:</strong> Primera fila = headers
          </p>
          <pre style={{ fontSize: 11, background: "#f0f2f5", padding: 12, borderRadius: 8 }}>{`nombre,categoria,descripcion
Templo,Iglesia,Descripción`}</pre>
          <p style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 12, lineHeight: 1.6 }}>⚠️ Los documentos se crean con IDs autogenerados. Operación no reversible.</p>
        </div>
      </div>
    </>
  );
}
