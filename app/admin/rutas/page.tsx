"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { collection, getDocs, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Ruta { id: string; name: string; theme: string; difficulty: string; isFeatured: boolean; icon: string; color: string; placeIds: string[]; order: number; }

export default function RutasPage() {
  const [items, setItems] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const dragIndex = useRef<number | null>(null);

  useEffect(() => {
    getDocs(collection(db, "themed_routes")).then((snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Ruta));
      rows.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setItems(rows);
      setLoading(false);
    });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta ruta?")) return;
    await deleteDoc(doc(db, "themed_routes", id));
    setItems((prev) => prev.filter((r) => r.id !== id));
  }

  function onDragStart(index: number) {
    dragIndex.current = index;
  }

  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === index) return;
    const next = [...items];
    const [moved] = next.splice(dragIndex.current, 1);
    next.splice(index, 0, moved);
    dragIndex.current = index;
    setItems(next);
  }

  async function onDrop() {
    if (dragIndex.current === null) return;
    dragIndex.current = null;
    setSaving(true);
    const batch = writeBatch(db);
    items.forEach((r, i) => {
      batch.update(doc(db, "themed_routes", r.id), { order: i });
    });
    await batch.commit();
    setSaving(false);
  }

  const diffBadge: Record<string, string> = { Fácil: "badge-green", Moderado: "badge-orange", Difícil: "badge-red" };

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-title">Rutas temáticas</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {saving && <span style={{ fontSize: 13, color: "var(--fg-3)" }}>Guardando orden...</span>}
          <Link href="/admin/rutas/nuevo" className="admin-btn admin-btn-primary">+ Nueva ruta</Link>
        </div>
      </div>
      {loading ? <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando...</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th style={{ width: 32 }}></th><th>Ruta</th><th>Tema</th><th>Dificultad</th><th>Lugares</th><th>Destacada</th><th>Acciones</th></tr></thead>
            <tbody>
              {items.map((r, i) => (
                <tr
                  key={r.id}
                  draggable
                  onDragStart={() => onDragStart(i)}
                  onDragOver={(e) => onDragOver(e, i)}
                  onDrop={onDrop}
                  style={{ cursor: "grab" }}
                >
                  <td style={{ color: "var(--fg-3)", fontSize: 16, userSelect: "none" }}>⠿</td>
                  <td style={{ fontWeight: 500 }}>{r.icon} {r.name}</td>
                  <td><span className="badge badge-navy">{r.theme}</span></td>
                  <td><span className={`badge ${diffBadge[r.difficulty] ?? "badge-gray"}`}>{r.difficulty}</span></td>
                  <td>{r.placeIds?.length ?? 0} lugares</td>
                  <td>{r.isFeatured ? "⭐" : "—"}</td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <Link href={`/admin/rutas/${r.id}`} className="admin-btn admin-btn-sm admin-btn-ghost">Editar</Link>
                    <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(r.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <div className="admin-empty"><div className="admin-empty-icon">🗺️</div><p>Sin rutas temáticas.</p></div>}
        </div>
      )}
    </>
  );
}
