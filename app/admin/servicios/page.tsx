"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCategories } from "@/lib/useCategories";

interface Servicio { id: string; name: string; category: string; phoneNumber: string; iconEmoji: string; priority: number; }

const DEFAULT_CAT_LABELS: Record<string, string> = {
  TOURISM: "Turismo", LODGING: "Hospedaje", FOOD: "Comida", TRANSPORT: "Transporte",
  HEALTH: "Salud", UTILITIES: "Servicios", OTHER: "Otro",
};

export default function ServiciosPage() {
  const [items, setItems] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const { options: catOptions } = useCategories("service_categories", "key", "label");
  const catLabels: Record<string, string> = catOptions.length > 0
    ? Object.fromEntries(catOptions.map((o) => [o.value, o.label]))
    : DEFAULT_CAT_LABELS;

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const snap = await getDocs(query(collection(db, "services"), orderBy("priority")));
    setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Servicio)));
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este servicio?")) return;
    await deleteDoc(doc(db, "services", id));
    setItems((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-title">Servicios</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/admin/servicios/categorias" className="admin-btn admin-btn-ghost">Categorías</Link>
          <Link href="/admin/servicios/nuevo" className="admin-btn admin-btn-primary">+ Nuevo servicio</Link>
        </div>
      </div>
      {loading ? <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando...</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Icono</th><th>Nombre</th><th>Categoría</th><th>Teléfono</th><th>Prioridad</th><th>Acciones</th></tr></thead>
            <tbody>
              {items.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontSize: 20 }}>{s.iconEmoji}</td>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td><span className="badge badge-blue">{catLabels[s.category] ?? s.category}</span></td>
                  <td style={{ fontFamily: "var(--mono)" }}>{s.phoneNumber}</td>
                  <td>{s.priority}</td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <Link href={`/admin/servicios/${s.id}`} className="admin-btn admin-btn-sm admin-btn-ghost">Editar</Link>
                    <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(s.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <div className="admin-empty"><div className="admin-empty-icon">🏪</div><p>Sin servicios.</p></div>}
        </div>
      )}
    </>
  );
}
