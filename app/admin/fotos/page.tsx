"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface PlacePhoto { id: string; placeId: string; placeName: string; imageUrl: string; uploaderName: string; uploadedAt: Timestamp | null; likes: number; }

export default function FotosPage() {
  const [photos, setPhotos] = useState<PlacePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getDocs(query(collection(db, "place_photos"), orderBy("uploadedAt", "desc"))).then((snap) => {
      setPhotos(snap.docs.map((d) => ({ id: d.id, ...d.data() } as PlacePhoto)));
      setLoading(false);
    });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta foto permanentemente?")) return;
    await deleteDoc(doc(db, "place_photos", id));
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  const filtered = photos.filter((p) =>
    p.placeName?.toLowerCase().includes(search.toLowerCase()) ||
    p.uploaderName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-title">Moderación de fotos</h1>
        <span style={{ fontSize: 13, color: "var(--fg-3)" }}>{filtered.length} fotos</span>
      </div>

      <div className="admin-search">
        <input placeholder="Buscar por lugar o usuario..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando...</p> : (
        <div className="admin-photo-grid">
          {filtered.map((photo) => (
            <div key={photo.id} className="admin-photo-card">
              <img
                src={photo.imageUrl}
                alt={photo.placeName}
                onError={(e) => { e.currentTarget.src = ""; e.currentTarget.style.background = "#f0f2f5"; }}
              />
              <div className="admin-photo-card-body">
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--navy)" }}>{photo.placeName}</div>
                  <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{photo.uploaderName} · ❤️ {photo.likes}</div>
                </div>
                <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(photo.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && filtered.length === 0 && <div className="admin-empty"><div className="admin-empty-icon">🖼️</div><p>Sin fotos.</p></div>}
    </>
  );
}
