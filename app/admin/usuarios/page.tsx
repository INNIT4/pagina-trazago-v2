"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, Timestamp, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface User { id: string; nombre_usuario: string; email: string; idioma_preferido: string; fecha_registro: Timestamp | null; ultimo_acceso: Timestamp | null; }

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getDocs(query(collection(db, "users"), orderBy("fecha_registro", "desc"), limit(500))).then((snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as User)));
      setLoading(false);
    });
  }, []);

  const filtered = users.filter((u) =>
    u.nombre_usuario?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const fmt = (ts: Timestamp | null) => ts ? ts.toDate().toLocaleDateString("es-MX") : "—";

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-title">Usuarios</h1>
        <span style={{ fontSize: 13, color: "var(--fg-3)" }}>{users.length} registrados</span>
      </div>

      <div className="admin-search">
        <input placeholder="Buscar por nombre o email..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando...</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Nombre</th><th>Email</th><th>Idioma</th><th>Registro</th><th>Último acceso</th></tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500 }}>{u.nombre_usuario || "—"}</td>
                  <td style={{ fontSize: 13, color: "var(--fg-2)" }}>{u.email}</td>
                  <td><span className="badge badge-gray">{(u.idioma_preferido ?? "es").toUpperCase()}</span></td>
                  <td>{fmt(u.fecha_registro)}</td>
                  <td>{fmt(u.ultimo_acceso)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="admin-empty"><div className="admin-empty-icon">👥</div><p>Sin usuarios.</p></div>}
        </div>
      )}
    </>
  );
}
