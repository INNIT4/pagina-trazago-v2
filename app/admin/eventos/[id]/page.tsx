"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCategories } from "@/lib/useCategories";

interface FormData {
  title: string; description: string; category: string; location: string;
  startDate: string; endDate: string; imageUrl: string; websiteUrl: string;
  priceInfo: string; organizerName: string; organizerContact: string;
  isFeatured: boolean; tags: string;
}

const empty: FormData = {
  title: "", description: "", category: "", location: "", startDate: "",
  endDate: "", imageUrl: "", websiteUrl: "", priceInfo: "", organizerName: "",
  organizerContact: "", isFeatured: false, tags: "",
};

function tsToInput(ts: Timestamp | null): string {
  if (!ts) return "";
  const d = ts.toDate();
  return d.toISOString().slice(0, 16);
}

export default function EventoEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "nuevo";
  const [form, setForm] = useState<FormData>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { options: catOptions, loading: catsLoading } = useCategories("event_categories");

  useEffect(() => {
    if (isNew) return;
    getDoc(doc(db, "eventos", id)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setForm({
          title: d.title ?? "", description: d.description ?? "", category: d.category ?? "",
          location: d.location ?? "", startDate: tsToInput(d.startDate ?? null),
          endDate: tsToInput(d.endDate ?? null), imageUrl: d.imageUrl ?? "",
          websiteUrl: d.websiteUrl ?? "", priceInfo: d.priceInfo ?? "",
          organizerName: d.organizerName ?? "", organizerContact: d.organizerContact ?? "",
          isFeatured: d.isFeatured ?? false, tags: (d.tags ?? []).join(", "),
        });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function set(field: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.title.trim()) { setError("El título es obligatorio."); return; }
    setSaving(true); setError("");
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const data = {
      title: form.title, description: form.description, category: form.category,
      location: form.location, imageUrl: form.imageUrl, websiteUrl: form.websiteUrl,
      priceInfo: form.priceInfo, organizerName: form.organizerName,
      organizerContact: form.organizerContact, isFeatured: form.isFeatured, tags,
      startDate: form.startDate ? Timestamp.fromDate(new Date(form.startDate)) : null,
      endDate: form.endDate ? Timestamp.fromDate(new Date(form.endDate)) : null,
    };
    try {
      if (isNew) await addDoc(collection(db, "eventos"), { ...data, createdAt: serverTimestamp() });
      else await setDoc(doc(db, "eventos", id), data, { merge: true });
      router.push("/admin/eventos");
    } catch (err) { setError("Error al guardar."); console.error(err); }
    finally { setSaving(false); }
  }

  if (loading) return <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando...</p>;

  return (
    <>
      <div className="admin-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/eventos" className="admin-btn admin-btn-ghost admin-btn-sm">← Volver</Link>
          <h1 className="admin-title">{isNew ? "Nuevo evento" : "Editar evento"}</h1>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-form-section">
        <div className="admin-form-section-title">Información del evento</div>
        <div className="admin-form">
          <div className="admin-field"><label>Título *</label><input value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
          <div className="admin-field"><label>Descripción</label><textarea value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label>
                Categoría{" "}
                <Link href="/admin/eventos/categorias" style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none" }}>
                  (gestionar)
                </Link>
              </label>
              {catsLoading ? (
                <input disabled value="Cargando categorías..." />
              ) : catOptions.length > 0 ? (
                <select value={form.category} onChange={(e) => set("category", e.target.value)}>
                  <option value="">— Selecciona —</option>
                  {catOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="Festival, Cultural, Religioso..." />
              )}
            </div>
            <div className="admin-field"><label>Lugar</label><input value={form.location} onChange={(e) => set("location", e.target.value)} /></div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field"><label>Fecha inicio</label><input type="datetime-local" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} /></div>
            <div className="admin-field"><label>Fecha fin</label><input type="datetime-local" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} /></div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field"><label>Organizador</label><input value={form.organizerName} onChange={(e) => set("organizerName", e.target.value)} /></div>
            <div className="admin-field"><label>Contacto organizador</label><input value={form.organizerContact} onChange={(e) => set("organizerContact", e.target.value)} /></div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field"><label>Precio / Info de acceso</label><input value={form.priceInfo} onChange={(e) => set("priceInfo", e.target.value)} placeholder="Entrada libre, $150 MXN..." /></div>
            <div className="admin-field"><label>Sitio web</label><input value={form.websiteUrl} onChange={(e) => set("websiteUrl", e.target.value)} placeholder="https://..." /></div>
          </div>
          <div className="admin-field"><label>URL imagen</label><input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} /></div>
          <div className="admin-field"><label>Tags (separados por comas)</label><input value={form.tags} onChange={(e) => set("tags", e.target.value)} /></div>
          <div className="admin-check-row">
            <input type="checkbox" id="feat" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} />
            <label htmlFor="feat">Evento destacado</label>
          </div>
        </div>
      </div>
    </>
  );
}
