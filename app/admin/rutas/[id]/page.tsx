"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, setDoc, addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface FormData { name: string; theme: string; description: string; difficulty: string; estimatedDuration: string; imageUrl: string; icon: string; color: string; isFeatured: boolean; placeIds: string[]; }
interface Place { id: string; nombre: string; categoria: string; }

const empty: FormData = { name: "", theme: "", description: "", difficulty: "Fácil", estimatedDuration: "", imageUrl: "", icon: "🗺️", color: "#FF6B35", isFeatured: false, placeIds: [] };

export default function RutaEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "nuevo";
  const [form, setForm] = useState<FormData>(empty);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function init() {
      const placesSnap = await getDocs(collection(db, "lugares"));
      setPlaces(placesSnap.docs.map((d) => ({ id: d.id, nombre: d.data().nombre ?? d.id, categoria: d.data().categoria ?? "" })));
      if (!isNew) {
        const snap = await getDoc(doc(db, "themed_routes", id));
        if (snap.exists()) {
          const d = snap.data();
          setForm({ name: d.name ?? "", theme: d.theme ?? "", description: d.description ?? "", difficulty: d.difficulty ?? "Fácil", estimatedDuration: d.estimatedDuration ?? "", imageUrl: d.imageUrl ?? "", icon: d.icon ?? "🗺️", color: d.color ?? "#FF6B35", isFeatured: d.isFeatured ?? false, placeIds: d.placeIds ?? [] });
        }
      }
      setLoading(false);
    }
    init();
  }, [id, isNew]);

  function set(field: keyof FormData, value: string | boolean | string[]) { setForm((prev) => ({ ...prev, [field]: value })); }

  function togglePlace(placeId: string) {
    setForm((prev) => ({
      ...prev,
      placeIds: prev.placeIds.includes(placeId)
        ? prev.placeIds.filter((p) => p !== placeId)
        : [...prev.placeIds, placeId],
    }));
  }

  async function handleSave() {
    if (!form.name.trim()) { setError("El nombre es obligatorio."); return; }
    setSaving(true); setError("");
    const data = { name: form.name, theme: form.theme, description: form.description, difficulty: form.difficulty, estimatedDuration: form.estimatedDuration, imageUrl: form.imageUrl, icon: form.icon, color: form.color, isFeatured: form.isFeatured, placeIds: form.placeIds, authorName: "Admin" };
    try {
      if (isNew) await addDoc(collection(db, "themed_routes"), data);
      else await setDoc(doc(db, "themed_routes", id), data, { merge: true });
      router.push("/admin/rutas");
    } catch (err) { setError("Error al guardar."); console.error(err); }
    finally { setSaving(false); }
  }

  if (loading) return <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando...</p>;

  return (
    <>
      <div className="admin-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/rutas" className="admin-btn admin-btn-ghost admin-btn-sm">← Volver</Link>
          <h1 className="admin-title">{isNew ? "Nueva ruta" : "Editar ruta"}</h1>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, alignItems: "start" }}>
        <div>
          <div className="admin-form-section">
            <div className="admin-form-section-title">Información</div>
            <div className="admin-form">
              <div className="admin-form-row">
                <div className="admin-field"><label>Icono (emoji)</label><input value={form.icon} onChange={(e) => set("icon", e.target.value)} /></div>
                <div className="admin-field"><label>Color</label><input type="color" value={form.color} onChange={(e) => set("color", e.target.value)} style={{ height: 44 }} /></div>
              </div>
              <div className="admin-field"><label>Nombre *</label><input value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
              <div className="admin-form-row">
                <div className="admin-field"><label>Tema</label><input value={form.theme} onChange={(e) => set("theme", e.target.value)} placeholder="Histórica, Gastronómica..." /></div>
                <div className="admin-field"><label>Dificultad</label>
                  <select value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)}>
                    {["Fácil", "Moderado", "Difícil"].map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="admin-field"><label>Duración estimada</label><input value={form.estimatedDuration} onChange={(e) => set("estimatedDuration", e.target.value)} placeholder="2-3 horas" /></div>
              <div className="admin-field"><label>Descripción</label><textarea value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
              <div className="admin-field"><label>URL imagen</label><input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} /></div>
              <div className="admin-check-row">
                <input type="checkbox" id="feat" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} />
                <label htmlFor="feat">Ruta destacada</label>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-form-section">
          <div className="admin-form-section-title">Lugares incluidos ({form.placeIds.length})</div>
          <div style={{ maxHeight: 480, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
            {places.map((p) => (
              <label key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 4px", cursor: "pointer", fontSize: 13, borderRadius: 6, background: form.placeIds.includes(p.id) ? "rgba(28,46,74,.06)" : "transparent" }}>
                <input type="checkbox" checked={form.placeIds.includes(p.id)} onChange={() => togglePlace(p.id)} style={{ accentColor: "var(--navy)" }} />
                <span style={{ fontWeight: 500 }}>{p.nombre}</span>
                <span style={{ color: "var(--fg-3)", fontSize: 11 }}>{p.categoria}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
