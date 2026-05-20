"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCategories } from "@/lib/useCategories";

interface FormData { name: string; phoneNumber: string; description: string; category: string; }
const empty: FormData = { name: "", phoneNumber: "", description: "", category: "" };

export default function EmergenciaEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "nuevo";
  const [form, setForm] = useState<FormData>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { options: catOptions, loading: catsLoading } = useCategories("emergency_categories");

  useEffect(() => {
    if (isNew) return;
    getDoc(doc(db, "emergency_contacts", id)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setForm({ name: d.name ?? "", phoneNumber: d.phoneNumber ?? "", description: d.description ?? "", category: d.category ?? "" });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function set(field: keyof FormData, value: string) { setForm((prev) => ({ ...prev, [field]: value })); }

  async function handleSave() {
    if (!form.name.trim() || !form.phoneNumber.trim()) { setError("Nombre y teléfono son obligatorios."); return; }
    setSaving(true); setError("");
    const data = { name: form.name, phoneNumber: form.phoneNumber, description: form.description, category: form.category };
    try {
      if (isNew) await addDoc(collection(db, "emergency_contacts"), data);
      else await setDoc(doc(db, "emergency_contacts", id), data, { merge: true });
      router.push("/admin/emergencia");
    } catch (err) { setError("Error al guardar."); console.error(err); }
    finally { setSaving(false); }
  }

  if (loading) return <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando...</p>;

  return (
    <>
      <div className="admin-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/emergencia" className="admin-btn admin-btn-ghost admin-btn-sm">← Volver</Link>
          <h1 className="admin-title">{isNew ? "Nuevo contacto" : "Editar contacto"}</h1>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-form-section" style={{ maxWidth: 480 }}>
        <div className="admin-form-section-title">Datos del contacto</div>
        <div className="admin-form">
          <div className="admin-field"><label>Nombre *</label><input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Policía Municipal, Cruz Roja..." /></div>
          <div className="admin-field"><label>Teléfono *</label><input value={form.phoneNumber} onChange={(e) => set("phoneNumber", e.target.value)} placeholder="911, 066..." /></div>
          <div className="admin-field"><label>Descripción</label><textarea value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
          <div className="admin-field">
            <label>
              Categoría{" "}
              <Link href="/admin/emergencia/categorias" style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none" }}>
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
              <input value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="Emergencia, Policía, Bomberos..." />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
