"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Contact { id: string; name: string; phoneNumber: string; description: string; category: string; }

export default function EmergenciaPage() {
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "emergency_contacts")).then((snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Contact)));
      setLoading(false);
    });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este contacto de emergencia?")) return;
    await deleteDoc(doc(db, "emergency_contacts", id));
    setItems((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-title">Contactos de Emergencia</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/admin/emergencia/categorias" className="admin-btn admin-btn-ghost">Categorías</Link>
          <Link href="/admin/emergencia/nuevo" className="admin-btn admin-btn-primary">+ Nuevo contacto</Link>
        </div>
      </div>
      {loading ? <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando...</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Nombre</th><th>Teléfono</th><th>Categoría</th><th>Descripción</th><th>Acciones</th></tr></thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                  <td style={{ fontFamily: "var(--mono)", fontSize: 15 }}><strong>{c.phoneNumber}</strong></td>
                  <td><span className="badge badge-blue">{c.category || "—"}</span></td>
                  <td style={{ color: "var(--fg-2)", fontSize: 13 }}>{c.description}</td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <Link href={`/admin/emergencia/${c.id}`} className="admin-btn admin-btn-sm admin-btn-ghost">Editar</Link>
                    <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(c.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <div className="admin-empty"><div className="admin-empty-icon">🚨</div><p>Sin contactos.</p></div>}
        </div>
      )}
    </>
  );
}
