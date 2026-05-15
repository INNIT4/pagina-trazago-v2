"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, deleteDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Banner { id: string; titulo: string; cuerpo: string; tipo: string; activo: boolean; fechaInicio: Timestamp | null; fechaFin: Timestamp | null; }

const TIPO_BADGE: Record<string, string> = { info: "badge-blue", alerta: "badge-red", promo: "badge-green" };

export default function BannersPage() {
  const [items, setItems] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "banners")).then((snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Banner)));
      setLoading(false);
    });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este banner?")) return;
    await deleteDoc(doc(db, "banners", id));
    setItems((prev) => prev.filter((b) => b.id !== id));
  }

  async function toggleActivo(banner: Banner) {
    await updateDoc(doc(db, "banners", banner.id), { activo: !banner.activo });
    setItems((prev) => prev.map((b) => b.id === banner.id ? { ...b, activo: !b.activo } : b));
  }

  const fmt = (ts: Timestamp | null) => ts ? ts.toDate().toLocaleDateString("es-MX", { day: "numeric", month: "short" }) : "—";

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-title">Banners / Avisos</h1>
        <Link href="/admin/banners/nuevo" className="admin-btn admin-btn-primary">+ Nuevo banner</Link>
      </div>

      {loading ? <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando...</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Título</th><th>Tipo</th><th>Inicio</th><th>Fin</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>{b.titulo}</div>
                    <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>{b.cuerpo?.slice(0, 60)}{b.cuerpo?.length > 60 ? "…" : ""}</div>
                  </td>
                  <td><span className={`badge ${TIPO_BADGE[b.tipo] ?? "badge-gray"}`}>{b.tipo}</span></td>
                  <td>{fmt(b.fechaInicio)}</td>
                  <td>{fmt(b.fechaFin)}</td>
                  <td>
                    <button
                      onClick={() => toggleActivo(b)}
                      className={`badge ${b.activo ? "badge-green" : "badge-gray"}`}
                      style={{ cursor: "pointer", border: "none", fontSize: 11 }}
                    >
                      {b.activo ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <Link href={`/admin/banners/${b.id}`} className="admin-btn admin-btn-sm admin-btn-ghost">Editar</Link>
                    <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(b.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <div className="admin-empty"><div className="admin-empty-icon">📢</div><p>Sin banners. <Link href="/admin/banners/nuevo">Crear el primero</Link></p></div>}
        </div>
      )}
    </>
  );
}
