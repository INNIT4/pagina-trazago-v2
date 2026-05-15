"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, setDoc, addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface FormData { titulo: string; cuerpo: string; tipo: string; activo: boolean; fechaInicio: string; fechaFin: string; }
const empty: FormData = { titulo: "", cuerpo: "", tipo: "info", activo: true, fechaInicio: "", fechaFin: "" };

function tsToInput(ts: Timestamp | null): string {
  return ts ? ts.toDate().toISOString().slice(0, 10) : "";
}

export default function BannerEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "nuevo";
  const [form, setForm] = useState<FormData>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isNew) return;
    getDoc(doc(db, "banners", id)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setForm({ titulo: d.titulo ?? "", cuerpo: d.cuerpo ?? "", tipo: d.tipo ?? "info", activo: d.activo ?? true, fechaInicio: tsToInput(d.fechaInicio ?? null), fechaFin: tsToInput(d.fechaFin ?? null) });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function set(field: keyof FormData, value: string | boolean) { setForm((prev) => ({ ...prev, [field]: value })); }

  async function handleSave() {
    if (!form.titulo.trim()) { setError("El título es obligatorio."); return; }
    setSaving(true); setError("");
    const data = {
      titulo: form.titulo, cuerpo: form.cuerpo, tipo: form.tipo, activo: form.activo,
      fechaInicio: form.fechaInicio ? Timestamp.fromDate(new Date(form.fechaInicio)) : null,
      fechaFin: form.fechaFin ? Timestamp.fromDate(new Date(form.fechaFin)) : null,
    };
    try {
      if (isNew) await addDoc(collection(db, "banners"), data);
      else await setDoc(doc(db, "banners", id), data, { merge: true });
      router.push("/admin/banners");
    } catch (err) { setError("Error al guardar."); console.error(err); }
    finally { setSaving(false); }
  }

  if (loading) return <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando...</p>;

  return (
    <>
      <div className="admin-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/banners" className="admin-btn admin-btn-ghost admin-btn-sm">← Volver</Link>
          <h1 className="admin-title">{isNew ? "Nuevo banner" : "Editar banner"}</h1>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-form-section" style={{ maxWidth: 560 }}>
        <div className="admin-form-section-title">Datos del banner</div>
        <div className="admin-form">
          <div className="admin-field"><label>Título *</label><input value={form.titulo} onChange={(e) => set("titulo", e.target.value)} placeholder="Feria del Queso este fin de semana" /></div>
          <div className="admin-field"><label>Mensaje</label><textarea value={form.cuerpo} onChange={(e) => set("cuerpo", e.target.value)} placeholder="No te pierdas el evento más esperado del año..." /></div>
          <div className="admin-field"><label>Tipo</label>
            <select value={form.tipo} onChange={(e) => set("tipo", e.target.value)}>
              <option value="info">Info</option>
              <option value="alerta">Alerta</option>
              <option value="promo">Promoción</option>
            </select>
          </div>
          <div className="admin-form-row">
            <div className="admin-field"><label>Fecha inicio</label><input type="date" value={form.fechaInicio} onChange={(e) => set("fechaInicio", e.target.value)} /></div>
            <div className="admin-field"><label>Fecha fin</label><input type="date" value={form.fechaFin} onChange={(e) => set("fechaFin", e.target.value)} /></div>
          </div>
          <div className="admin-check-row">
            <input type="checkbox" id="activo" checked={form.activo} onChange={(e) => set("activo", e.target.checked)} />
            <label htmlFor="activo">Banner activo (visible en la app)</label>
          </div>
        </div>
      </div>
    </>
  );
}
