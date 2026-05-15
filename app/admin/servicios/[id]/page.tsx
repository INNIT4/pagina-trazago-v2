"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface FormData { name: string; phoneNumber: string; description: string; category: string; iconEmoji: string; priority: string; }
const empty: FormData = { name: "", phoneNumber: "", description: "", category: "TOURISM", iconEmoji: "📞", priority: "100" };

export default function ServicioEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "nuevo";
  const [form, setForm] = useState<FormData>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return;
    getDoc(doc(db, "services", id)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setForm({ name: d.name ?? "", phoneNumber: d.phoneNumber ?? "", description: d.description ?? "", category: d.category ?? "TOURISM", iconEmoji: d.iconEmoji ?? "📞", priority: String(d.priority ?? 100) });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function set(field: keyof FormData, value: string) { setForm((prev) => ({ ...prev, [field]: value })); }

  async function handleSave() {
    if (!form.name.trim()) { setError("El nombre es obligatorio."); return; }
    setSaving(true); setError("");
    const data = { name: form.name, phoneNumber: form.phoneNumber, description: form.description, category: form.category, iconEmoji: form.iconEmoji, priority: parseInt(form.priority) || 100 };
    try {
      if (isNew) await addDoc(collection(db, "services"), data);
      else await setDoc(doc(db, "services", id), data, { merge: true });
      router.push("/admin/servicios");
    } catch (err) { setError("Error al guardar."); console.error(err); }
    finally { setSaving(false); }
  }

  if (loading) return <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando...</p>;

  return (
    <>
      <div className="admin-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/servicios" className="admin-btn admin-btn-ghost admin-btn-sm">← Volver</Link>
          <h1 className="admin-title">{isNew ? "Nuevo servicio" : "Editar servicio"}</h1>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-form-section" style={{ maxWidth: 560 }}>
        <div className="admin-form-section-title">Datos del servicio</div>
        <div className="admin-form">
          <div className="admin-form-row">
            <div className="admin-field"><label>Icono (emoji)</label><input value={form.iconEmoji} onChange={(e) => set("iconEmoji", e.target.value)} /></div>
            <div className="admin-field"><label>Prioridad (orden)</label><input type="number" value={form.priority} onChange={(e) => set("priority", e.target.value)} /></div>
          </div>
          <div className="admin-field"><label>Nombre *</label><input value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
          <div className="admin-field"><label>Teléfono</label><input value={form.phoneNumber} onChange={(e) => set("phoneNumber", e.target.value)} /></div>
          <div className="admin-field"><label>Categoría</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)}>
              {["TOURISM","LODGING","FOOD","TRANSPORT","HEALTH","UTILITIES","OTHER"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="admin-field"><label>Descripción</label><textarea value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
        </div>
      </div>
    </>
  );
}
