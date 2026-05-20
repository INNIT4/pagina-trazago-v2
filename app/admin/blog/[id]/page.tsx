"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  doc, getDoc, setDoc, addDoc, collection, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCategories } from "@/lib/useCategories";

interface FormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  authorName: string;
  locale: string;
  isFeatured: boolean;
  imageUrl: string;
  tags: string;
}

const empty: FormData = {
  title: "", excerpt: "", content: "", category: "", authorName: "",
  locale: "es", isFeatured: false, imageUrl: "", tags: "",
};

export default function BlogEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "nuevo";

  const [form, setForm] = useState<FormData>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { options: catOptions, loading: catsLoading } = useCategories("blog_categories");

  useEffect(() => {
    if (isNew) return;
    getDoc(doc(db, "blog_posts", id)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setForm({
          title: d.title ?? "",
          excerpt: d.excerpt ?? "",
          content: d.content ?? "",
          category: d.category ?? "",
          authorName: d.authorName ?? "",
          locale: d.locale ?? "es",
          isFeatured: d.isFeatured ?? false,
          imageUrl: d.imageUrl ?? "",
          tags: (d.tags ?? []).join(", "),
        });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  function set(field: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.title.trim()) { setError("El título es obligatorio."); return; }
    setSaving(true);
    setError("");

    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);

    const data = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      category: form.category,
      authorName: form.authorName,
      locale: form.locale,
      isFeatured: form.isFeatured,
      imageUrl: form.imageUrl,
      tags,
      slug,
      ...(isNew ? { publishedAt: serverTimestamp(), viewCount: 0, likes: 0 } : {}),
    };

    try {
      if (isNew) {
        await addDoc(collection(db, "blog_posts"), data);
      } else {
        await setDoc(doc(db, "blog_posts", id), data, { merge: true });
      }
      router.push("/admin/blog");
    } catch (err) {
      setError("Error al guardar. Intenta de nuevo.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando...</p>;

  return (
    <>
      <div className="admin-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/blog" className="admin-btn admin-btn-ghost admin-btn-sm">← Volver</Link>
          <h1 className="admin-title">{isNew ? "Nuevo post" : "Editar post"}</h1>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Guardando..." : "Guardar post"}
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, alignItems: "start" }}>
        <div>
          <div className="admin-form-section">
            <div className="admin-form-section-title">Contenido</div>
            <div className="admin-field" style={{ marginBottom: 16 }}>
              <label>Título *</label>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Título del artículo" />
            </div>
            <div className="admin-field" style={{ marginBottom: 16 }}>
              <label>Extracto</label>
              <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Resumen breve que aparece en la lista del blog..." style={{ minHeight: 80 }} />
            </div>
            <div className="admin-field">
              <label>Contenido (Markdown)</label>
              <textarea value={form.content} onChange={(e) => set("content", e.target.value)} placeholder="# Título&#10;&#10;Escribe tu artículo en Markdown..." style={{ minHeight: 320, fontFamily: "var(--mono)", fontSize: 14 }} />
            </div>
          </div>
        </div>

        <div>
          <div className="admin-form-section">
            <div className="admin-form-section-title">Configuración</div>
            <div className="admin-field" style={{ marginBottom: 16 }}>
              <label>Idioma</label>
              <select value={form.locale} onChange={(e) => set("locale", e.target.value)}>
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="admin-field" style={{ marginBottom: 16 }}>
              <label>
                Categoría{" "}
                <Link href="/admin/blog/categorias" style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none" }}>
                  (gestionar)
                </Link>
              </label>
              {catsLoading ? (
                <input disabled value="Cargando categorías..." />
              ) : catOptions.length > 0 ? (
                <select value={form.category} onChange={(e) => set("category", e.target.value)}>
                  <option value="">— Selecciona —</option>
                  {catOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="Crónica, Guía, Historia..." />
              )}
            </div>
            <div className="admin-field" style={{ marginBottom: 16 }}>
              <label>Autor</label>
              <input value={form.authorName} onChange={(e) => set("authorName", e.target.value)} placeholder="Nombre del autor" />
            </div>
            <div className="admin-field" style={{ marginBottom: 16 }}>
              <label>URL de imagen destacada</label>
              <input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://..." />
            </div>
            <div className="admin-field" style={{ marginBottom: 16 }}>
              <label>Tags (separados por comas)</label>
              <input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="turismo, alamos, historia" />
            </div>
            <div className="admin-check-row">
              <input type="checkbox" id="featured" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} />
              <label htmlFor="featured">Post destacado</label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
