"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, query, orderBy, getDocs, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface BlogPost {
  id: string;
  title: string;
  category: string;
  authorName: string;
  isFeatured: boolean;
  locale: string;
  publishedAt: Timestamp | null;
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const snap = await getDocs(query(collection(db, "blog_posts"), orderBy("publishedAt", "desc")));
    setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost)));
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este post permanentemente?")) return;
    await deleteDoc(doc(db, "blog_posts", id));
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  const filtered = posts.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.authorName?.toLowerCase().includes(search.toLowerCase())
  );

  const fmt = (ts: Timestamp | null) =>
    ts ? ts.toDate().toLocaleDateString("es-MX") : "Borrador";

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-title">Blog</h1>
        <Link href="/admin/blog/nuevo" className="admin-btn admin-btn-primary">+ Nuevo post</Link>
      </div>

      <div className="admin-search">
        <input placeholder="Buscar por título o autor..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando...</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoría</th>
                <th>Autor</th>
                <th>Idioma</th>
                <th>Publicado</th>
                <th>Destacado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id}>
                  <td style={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>
                    {post.title}
                  </td>
                  <td><span className="badge badge-navy">{post.category}</span></td>
                  <td>{post.authorName}</td>
                  <td><span className="badge badge-gray">{post.locale?.toUpperCase() ?? "ES"}</span></td>
                  <td>{fmt(post.publishedAt)}</td>
                  <td>{post.isFeatured ? "⭐" : "—"}</td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <Link href={`/admin/blog/${post.id}`} className="admin-btn admin-btn-sm admin-btn-ghost">Editar</Link>
                    <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(post.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="admin-empty"><div className="admin-empty-icon">✍️</div><p>No hay posts aún. <Link href="/admin/blog/nuevo">Crear el primero</Link></p></div>
          )}
        </div>
      )}
    </>
  );
}
