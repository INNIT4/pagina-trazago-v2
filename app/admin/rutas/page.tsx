"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Ruta { id: string; name: string; theme: string; difficulty: string; isFeatured: boolean; icon: string; color: string; placeIds: string[]; }

export default function RutasPage() {
  const [items, setItems] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "themed_routes")).then((snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Ruta)));
      setLoading(false);
    });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta ruta?")) return;
    await deleteDoc(doc(db, "themed_routes", id));
    setItems((prev) => prev.filter((r) => r.id !== id));
  }

  const diffBadge: Record<string, string> = { Fácil: "badge-green", Moderado: "badge-orange", Difícil: "badge-red" };

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-title">Rutas temáticas</h1>
        <Link href="/admin/rutas/nuevo" className="admin-btn admin-btn-primary">+ Nueva ruta</Link>
      </div>
      {loading ? <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando...</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Ruta</th><th>Tema</th><th>Dificultad</th><th>Lugares</th><th>Destacada</th><th>Acciones</th></tr></thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
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
