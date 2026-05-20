"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection, getDocs, addDoc, setDoc, deleteDoc, doc, orderBy, query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Cat { id: string; name: string; order: number; }

const emptyForm = { name: "", order: 100 };

export default function EmergenciaCategoriesPage() {
  const [items, setItems] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const snap = await getDocs(query(collection(db, "emergency_categories"), orderBy("order")));
    setItems(snap.docs.map((d) => ({ id: d.id, name: d.data().name ?? "", order: d.data().order ?? 0 })));
    setLoading(false);
  }

  function startEdit(item: Cat) {
    setEditId(item.id);
    setForm({ name: item.name, order: item.order });
    setError("");
  }

  function cancelEdit() {
    setEditId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSave() {
    if (!form.name.trim()) { setError("El nombre es obligatorio."); return; }
    setSaving(true);
    setError("");
    const data = { name: form.name.trim(), order: Number(form.order) || 100 };
    try {
      if (editId) {
        await setDoc(doc(db, "emergency_categories", editId), data);
      } else {
        await addDoc(collection(db, "emergency_categories"), data);
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
    await deleteDoc(doc(db, "emergency_categories", id));
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <>
      <div className="admin-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/emergencia" className="admin-btn admin-btn-ghost admin-btn-sm">← Emergencia</Link>
          <h1 className="admin-title">Categorías de emergencia</h1>
        </div>
      </div>

      <div className="admin-form-section" style={{ maxWidth: 480, marginBottom: 24 }}>
        <div className="admin-form-section-title">
          {editId ? "Editar categoría" : "Nueva categoría"}
        </div>
        {error && <div className="admin-error">{error}</div>}
        <div className="admin-form">
          <div className="admin-form-row">
            <div className="admin-field">
              <label>Nombre</label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Emergencia, Policía, Bomberos..."
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
              <tr><th>Nombre</th><th>Orden</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
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
