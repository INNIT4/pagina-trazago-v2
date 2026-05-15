"use client";

import { useEffect, useState } from "react";
import {
  collection, query, orderBy, getDocs, updateDoc, doc,
  where, deleteDoc, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Post {
  id: string;
  authorName: string;
  title: string;
  content: string;
  hidden: boolean;
  likeCount: number;
  commentCount: number;
  reportCount: number;
  createdAt: Timestamp | null;
}

interface Report {
  id: string;
  postId: string;
  reporterId: string;
  reason: string;
  detail: string;
  status: string;
  createdAt: Timestamp | null;
}

export default function ComunidadPage() {
  const [tab, setTab] = useState<"posts" | "reports">("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [postsSnap, reportsSnap] = await Promise.all([
      getDocs(query(collection(db, "publicaciones_comunidad"), orderBy("createdAt", "desc"))),
      getDocs(query(collection(db, "reportes_publicaciones"), where("status", "==", "pending"), orderBy("createdAt", "desc"))),
    ]);

    setPosts(postsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Post)));
    setReports(reportsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Report)));
    setLoading(false);
  }

  async function toggleHidden(post: Post) {
    await updateDoc(doc(db, "publicaciones_comunidad", post.id), { hidden: !post.hidden });
    setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, hidden: !p.hidden } : p));
  }

  async function deletePost(id: string) {
    if (!confirm("¿Eliminar esta publicación permanentemente?")) return;
    await deleteDoc(doc(db, "publicaciones_comunidad", id));
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  async function resolveReport(report: Report) {
    await updateDoc(doc(db, "reportes_publicaciones", report.id), { status: "resolved" });
    setReports((prev) => prev.filter((r) => r.id !== report.id));
  }

  const filtered = posts.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.authorName?.toLowerCase().includes(search.toLowerCase())
  );

  const fmt = (ts: Timestamp | null) =>
    ts ? ts.toDate().toLocaleDateString("es-MX") : "—";

  const reasonLabel: Record<string, string> = {
    SPAM: "Spam",
    OFFENSIVE: "Ofensivo",
    FAKE_INFO: "Info falsa",
    OTHER: "Otro",
  };

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-title">Comunidad</h1>
        <button onClick={loadData} className="admin-btn admin-btn-ghost admin-btn-sm">↺ Actualizar</button>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${tab === "posts" ? "active" : ""}`} onClick={() => setTab("posts")}>
          Publicaciones ({posts.length})
        </button>
        <button className={`admin-tab ${tab === "reports" ? "active" : ""}`} onClick={() => setTab("reports")}>
          Reportes pendientes {reports.length > 0 && <span className="badge badge-red" style={{ marginLeft: 6 }}>{reports.length}</span>}
        </button>
      </div>

      {loading ? (
        <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando...</p>
      ) : tab === "posts" ? (
        <>
          <div className="admin-search">
            <input
              placeholder="Buscar por título o autor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Fecha</th>
                  <th>❤️</th>
                  <th>💬</th>
                  <th>🚨</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <tr key={post.id}>
                    <td style={{ maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {post.title}
                    </td>
                    <td>{post.authorName}</td>
                    <td>{fmt(post.createdAt)}</td>
                    <td>{post.likeCount}</td>
                    <td>{post.commentCount}</td>
                    <td>{post.reportCount > 0 ? <span className="badge badge-red">{post.reportCount}</span> : 0}</td>
                    <td>
                      <span className={`badge ${post.hidden ? "badge-gray" : "badge-green"}`}>
                        {post.hidden ? "Oculto" : "Visible"}
                      </span>
                    </td>
                    <td style={{ display: "flex", gap: 6 }}>
                      <button
                        className={`admin-btn admin-btn-sm ${post.hidden ? "admin-btn-green" : "admin-btn-ghost"}`}
                        onClick={() => toggleHidden(post)}
                      >
                        {post.hidden ? "Mostrar" : "Ocultar"}
                      </button>
                      <button
                        className="admin-btn admin-btn-sm admin-btn-danger"
                        onClick={() => deletePost(post.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="admin-empty"><div className="admin-empty-icon">💬</div><p>No hay publicaciones.</p></div>
            )}
          </div>
        </>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Post ID</th>
                <th>Razón</th>
                <th>Detalle</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{r.postId.slice(0, 12)}…</td>
                  <td><span className="badge badge-orange">{reasonLabel[r.reason] ?? r.reason}</span></td>
                  <td style={{ maxWidth: 280, fontSize: 13, color: "var(--fg-2)" }}>{r.detail || "—"}</td>
                  <td>{fmt(r.createdAt)}</td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <button className="admin-btn admin-btn-sm admin-btn-green" onClick={() => resolveReport(r)}>
                      Resolver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reports.length === 0 && (
            <div className="admin-empty"><div className="admin-empty-icon">✅</div><p>No hay reportes pendientes.</p></div>
          )}
        </div>
      )}
    </>
  );
}
