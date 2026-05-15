"use client";

import { useEffect, useState } from "react";
import {
  collection, getDocs, query, orderBy, deleteDoc, doc, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Place { id: string; nombre: string; }
interface Review { id: string; userId: string; userName: string; rating: number; comment: string; timestamp: Timestamp | null; }

export default function OpinionesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDocs(query(collection(db, "lugares"), orderBy("nombre"))).then((snap) => {
      setPlaces(snap.docs.map((d) => ({ id: d.id, nombre: d.data().nombre ?? d.id })));
    });
  }, []);

  async function loadReviews(placeId: string) {
    setLoading(true);
    setSelectedPlace(placeId);
    const snap = await getDocs(
      query(collection(db, "lugares", placeId, "reviews"), orderBy("timestamp", "desc"))
    );
    setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Review)));
    setLoading(false);
  }

  async function handleDelete(reviewId: string) {
    if (!confirm("¿Eliminar esta reseña?")) return;
    await deleteDoc(doc(db, "lugares", selectedPlace, "reviews", reviewId));
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  }

  const fmt = (ts: Timestamp | null) =>
    ts ? ts.toDate().toLocaleDateString("es-MX") : "—";

  const stars = (n: number) => "⭐".repeat(Math.round(n));

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-title">Opiniones / Reseñas</h1>
      </div>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-field">
          <label>Selecciona un lugar para ver sus reseñas</label>
          <select
            value={selectedPlace}
            onChange={(e) => loadReviews(e.target.value)}
            style={{ maxWidth: 400 }}
          >
            <option value="">— Elige un lugar —</option>
            {places.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>
      </div>

      {selectedPlace && (
        loading ? <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando...</p> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Usuario</th><th>Rating</th><th>Comentario</th><th>Fecha</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id}>
                    <td>{r.userName || "Anónimo"}</td>
                    <td>{stars(r.rating)} <span style={{ fontSize: 12, color: "var(--fg-3)" }}>{Number(r.rating).toFixed(1)}</span></td>
                    <td style={{ maxWidth: 360, fontSize: 13, color: "var(--fg-2)" }}>{r.comment || "—"}</td>
                    <td>{fmt(r.timestamp)}</td>
                    <td>
                      <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleDelete(r.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reviews.length === 0 && <div className="admin-empty"><div className="admin-empty-icon">⭐</div><p>Sin reseñas para este lugar.</p></div>}
          </div>
        )
      )}
    </>
  );
}
