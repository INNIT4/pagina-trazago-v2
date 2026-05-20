"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection, getDocs, addDoc, setDoc, deleteDoc, doc, orderBy, query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ServiceCat { id: string; key: string; label: string; order: number; }

const emptyForm = { key: "", label: "", order: 100 };

export default function ServiceCategoriesPage() {
  const [items, setItems] = useState<ServiceCat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const snap = await getDocs(query(collection(db, "service_categories"), orderBy("order")));
    setItems(snap.docs.map((d) => ({
      id: d.id,
      key: d.data().key ?? "",
      label: d.data().label ?? "",
      order: d.data().order ?? 0,
    })));
    setLoading(false);
  }

  function startEdit(item: ServiceCat) {
    setEditId(item.id);
    setForm({ key: item.key, label: item.label, order: item.order });
    setError("");
  }

  function cancelEdit() {
    setEditId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSave() {
    if (!form.key.trim() || !form.label.trim()) {
      setError("Clave y etiqueta son obligatorias.");
      return;
    }
    setSaving(true);
    setError("");
    const data = {
      key: form.key.trim().toUpperCase(),
      label: form.label.trim(),
      order: Number(form.order) || 100,
    };
    try {
      if (editId) {
        await setDoc(doc(db, "service_categories", editId), data);
      } else {
        await addDoc(collection(db, "service_categories"), data);
      }
      cancelEdit();
      await load();
    } catch {
      setError("Error al guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta categoría?")) return;
    await deleteDoc(doc(db, "service_categories", id));
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <>
      <div className="admin-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/servicios" className="admin-btn admin-btn-ghost admin-btn-sm">← Servicios</Link>
          <h1 className="admin-title">Categorías de servicios</h1>
        </div>
      </div>

      <div className="admin-form-section" style={{ maxWidth: 540, marginBottom: 24 }}>
        <div className="admin-form-section-title">
          {editId ? "Editar categoría" : "Nueva categoría"}
        </div>
        {error && <div className="admin-error">{error}</div>}
        <div className="admin-form">
          <div className="admin-form-row">
            <div className="admin-field">
              <label>Clave (p.ej. TOURISM)</label>
              <input
                value={form.key}
                onChange={(e) => setForm((p) => ({ ...p, key: e.target.value }))}
                placeholder="TOURISM"
              />
            </div>
            <div className="admin-field">
              <label>Orden</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div className="admin-field">
            <label>Etiqueta (mostrada al usuario)</label>
            <input
              value={form.label}
              onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
              placeholder="Turismo"
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Guardando..." : editId ? "Actualizar" : "Agregar"}
            </button>
            {editId && (
              <button className="admin-btn admin-btn-ghost" onClick={cancelEdit}>Cancelar</button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando...</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Clave</th><th>Etiqueta</th><th>Orden</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td><code style={{ fontSize: 12 }}>{item.key}</code></td>
                  <td>{item.label}</td>
                  <td>{item.order}</td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <button className="admin-btn admin-btn-sm admin-btn-ghost" onClick={() => startEdit(item)}>Editar</button>
                    <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(item.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="admin-empty">
              <div className="admin-empty-icon">🏷️</div>
              <p>Sin categorías. Agrega la primera.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
