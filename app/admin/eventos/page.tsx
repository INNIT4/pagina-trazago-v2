"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, orderBy, getDocs, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Evento {
  id: string;
  title: string;
  category: string;
  location: string;
  startDate: Timestamp | null;
  isFeatured: boolean;
}

export default function EventosPage() {
  const [items, setItems] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const snap = await getDocs(query(collection(db, "eventos"), orderBy("startDate", "desc")));
    setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Evento)));
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este evento?")) return;
    await deleteDoc(doc(db, "eventos", id));
    setItems((prev) => prev.filter((e) => e.id !== id));
  }

  const fmt = (ts: Timestamp | null) =>
    ts ? ts.toDate().toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-title">Eventos</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/admin/eventos/categorias" className="admin-btn admin-btn-ghost">Categorías</Link>
          <Link href="/admin/eventos/nuevo" className="admin-btn admin-btn-primary">+ Nuevo evento</Link>
        </div>
      </div>
      {loading ? <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando...</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Título</th><th>Categoría</th><th>Lugar</th><th>Fecha inicio</th><th>Destacado</th><th>Acciones</th></tr></thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 500 }}>{e.title}</td>
                  <td><span className="badge badge-navy">{e.category}</span></td>
                  <td>{e.location}</td>
                  <td>{fmt(e.startDate)}</td>
                  <td>{e.isFeatured ? "⭐" : "—"}</td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <Link href={`/admin/eventos/${e.id}`} className="admin-btn admin-btn-sm admin-btn-ghost">Editar</Link>
                    <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(e.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <div className="admin-empty"><div className="admin-empty-icon">📅</div><p>Sin eventos.</p></div>}
        </div>
      )}
    </>
  );
}
