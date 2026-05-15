"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Lugar { id: string; nombre: string; categoria: string; barrio: string; rating: number; cerradoTemporalmente: boolean; geofenceActivo?: boolean; }

const CATS = ["Todos", "Museo", "Restaurante", "Hotel", "Iglesia", "Parque", "Tienda", "General"];

export default function LugaresPage() {
  const [items, setItems] = useState<Lugar[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("Todos");

  useEffect(() => {
    getDocs(query(collection(db, "lugares"), orderBy("nombre"))).then((snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Lugar)));
      setLoading(false);
    });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este lugar permanentemente?")) return;
    await deleteDoc(doc(db, "lugares", id));
    setItems((prev) => prev.filter((l) => l.id !== id));
  }

  const filtered = items.filter((l) => {
    const matchSearch = l.nombre?.toLowerCase().includes(search.toLowerCase()) || l.barrio?.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "Todos" || l.categoria === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-title">Lugares / POI</h1>
        <Link href="/admin/lugares/nuevo" className="admin-btn admin-btn-primary">+ Nuevo lugar</Link>
      </div>

      <div className="admin-search">
        <input placeholder="Buscar por nombre o barrio..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={{ border: "1px solid #dde1e7", borderRadius: 8, padding: "9px 14px", fontSize: 14, fontFamily: "var(--sans)", background: "#fff" }}>
          {CATS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <span style={{ fontSize: 13, color: "var(--fg-3)" }}>{filtered.length} lugares</span>
      </div>

      {loading ? <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando...</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th><th>Categoría</th><th>Barrio</th><th>Rating</th>
                <th>Estado</th><th>Geofence</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 500 }}>{l.nombre}</td>
                  <td><span className="badge badge-navy">{l.categoria}</span></td>
                  <td style={{ color: "var(--fg-2)", fontSize: 13 }}>{l.barrio || "—"}</td>
                  <td>{l.rating ? `⭐ ${Number(l.rating).toFixed(1)}` : "—"}</td>
                  <td>
                    {l.cerradoTemporalmente
                      ? <span className="badge badge-red">Cerrado</span>
                      : <span className="badge badge-green">Abierto</span>}
                  </td>
                  <td>{l.geofenceActivo ? <span className="badge badge-blue">Activo</span> : "—"}</td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <Link href={`/admin/lugares/${l.id}`} className="admin-btn admin-btn-sm admin-btn-ghost">Editar</Link>
                    <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(l.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="admin-empty"><div className="admin-empty-icon">📍</div><p>No se encontraron lugares.</p></div>}
        </div>
      )}
    </>
  );
}
