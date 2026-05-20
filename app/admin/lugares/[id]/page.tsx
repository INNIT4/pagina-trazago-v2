"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, setDoc, addDoc, collection, GeoPoint } from "firebase/firestore";
import { db } from "@/lib/firebase";
import MapPicker from "@/components/admin/MapPicker";
import ImageUploader from "@/components/admin/ImageUploader";

interface LatLng { lat: number; lng: number }

type TipoActividad = "INTERIOR" | "EXTERIOR" | "MIXTO";

interface FormData {
  nombre: string;
  tipoActividad: TipoActividad;
  descripcionCorta: string; descripcion: string; descripcionLarga: string;
  descripcionCortaEn: string; descripcionEn: string; descripcionLargaEn: string;
  categoria: string; subcategorias: string; barrio: string; direccion: string;
  telefono: string; sitioWeb: string; imagenUrl: string;
  imagenesGaleria: string[];
  ubicacion: LatLng | null;
  googlePlaceId: string;
  rating: number;
  reviewCount: number;
  horarios: string; cerradoTemporalmente: boolean;
  precioNivel: string; precioPromedioMxn: string; entradaGratuita: boolean;
  duracionMinSugeridaMin: string; duracionMaxSugeridaMin: string;
  mejorMomentoDelDia: string[]; mejorTemporada: string[];
  audienciaIdeal: string[]; aptoNiños: boolean; aptoMascotas: boolean;
  nivelDificultadFisica: string;
  wifi: boolean; aireAcondicionado: boolean; aceptaTarjeta: boolean;
  reservacionRequerida: boolean; tourGuiado: boolean;
  sillaRuedas: boolean; banoAccesible: boolean; estacionamiento: boolean;
  notasAccesibilidad: string;
  tipoCocina: string; opcionesDieteticas: string[]; tieneTerraza: boolean;
  tipsVisita: string; historiaResumen: string; tags: string;
  geofenceActivo: boolean; geofenceRadio: string; geofenceMensaje: string;
}

const empty: FormData = {
  nombre: "",
  tipoActividad: "EXTERIOR",
  descripcionCorta: "", descripcion: "", descripcionLarga: "",
  descripcionCortaEn: "", descripcionEn: "", descripcionLargaEn: "",
  categoria: "General", subcategorias: "", barrio: "", direccion: "",
  telefono: "", sitioWeb: "", imagenUrl: "",
  imagenesGaleria: [],
  ubicacion: null,
  googlePlaceId: "",
  rating: 0,
  reviewCount: 0,
  horarios: "", cerradoTemporalmente: false,
  precioNivel: "0", precioPromedioMxn: "0", entradaGratuita: true,
  duracionMinSugeridaMin: "30", duracionMaxSugeridaMin: "90",
  mejorMomentoDelDia: [], mejorTemporada: [], audienciaIdeal: [],
  aptoNiños: true, aptoMascotas: false, nivelDificultadFisica: "1",
  wifi: false, aireAcondicionado: false, aceptaTarjeta: false,
  reservacionRequerida: false, tourGuiado: false,
  sillaRuedas: false, banoAccesible: false, estacionamiento: false,
  notasAccesibilidad: "",
  tipoCocina: "", opcionesDieteticas: [], tieneTerraza: false,
  tipsVisita: "", historiaResumen: "", tags: "",
  geofenceActivo: false, geofenceRadio: "150", geofenceMensaje: "",
};

const MOMENTOS = ["AMANECER", "MAÑANA", "MEDIODIA", "TARDE", "ATARDECER", "NOCHE"];
const TEMPORADAS = ["Primavera", "Verano", "Otoño", "Invierno", "Todo el año"];
const AUDIENCIAS = ["SOLO", "PAREJA", "FAMILIA", "AMIGOS", "NIÑOS", "MAYORES"];
const OPCIONES_DIETETICAS = ["Vegetariano", "Vegano", "Sin gluten", "Bajo en calorías", "Halal"];
const CATEGORIAS = ["General", "Museo", "Restaurante", "Hotel", "Iglesia", "Parque", "Tienda", "Bar", "Spa", "Mercado", "Galería", "Teatro"];

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="admin-check-row">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <label>{label}</label>
    </div>
  );
}

function MultiCheck({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  function toggle(opt: string) {
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {options.map((opt) => (
        <button key={opt} type="button" onClick={() => toggle(opt)}
          className={`admin-btn admin-btn-sm ${selected.includes(opt) ? "admin-btn-primary" : "admin-btn-ghost"}`}>
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function LugarEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = id === "nuevo";
  const [form, setForm] = useState<FormData>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const [aiFilling, setAiFilling] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlMessage, setUrlMessage] = useState("");
  const [editorialSummary, setEditorialSummary] = useState("");
  const [pendingAiFill, setPendingAiFill] = useState(false);

  useEffect(() => {
    if (isNew) return;
    getDoc(doc(db, "lugares", id)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        const ubicacion: LatLng | null = d.ubicacion
          ? typeof d.ubicacion.latitude === "number"
            ? { lat: d.ubicacion.latitude, lng: d.ubicacion.longitude }
            : (d.ubicacion.lat != null && d.ubicacion.lng != null)
              ? { lat: d.ubicacion.lat, lng: d.ubicacion.lng }
              : null
          : null;
        const tipoAct = d.tipoActividad;
        setForm({
          nombre: d.nombre ?? "",
          tipoActividad: (tipoAct === "INTERIOR" || tipoAct === "EXTERIOR" || tipoAct === "MIXTO") ? tipoAct : "EXTERIOR",
          descripcionCorta: d.descripcionCorta ?? "",
          descripcion: d.descripcion ?? "", descripcionLarga: d.descripcionLarga ?? "",
          descripcionCortaEn: d.descripcionCortaEn ?? "", descripcionEn: d.descripcionEn ?? "", descripcionLargaEn: d.descripcionLargaEn ?? "",
          categoria: d.categoria ?? "General", subcategorias: (d.subcategorias ?? []).join(", "),
          barrio: d.barrio ?? "", direccion: d.direccion ?? "",
          telefono: d.telefono ?? "", sitioWeb: d.sitioWeb ?? "", imagenUrl: d.imagenUrl ?? "",
          imagenesGaleria: Array.isArray(d.imagenesGaleria) ? d.imagenesGaleria : [],
          ubicacion,
          googlePlaceId: d.googlePlaceId ?? "",
          rating: typeof d.rating === "number" ? d.rating : 0,
          reviewCount: typeof d.reviewCount === "number" ? d.reviewCount : 0,
          horarios: d.horarios ?? "", cerradoTemporalmente: d.cerradoTemporalmente ?? false,
          precioNivel: String(d.precioNivel ?? 0), precioPromedioMxn: String(d.precioPromedioMxn ?? 0),
          entradaGratuita: d.entradaGratuita ?? true,
          duracionMinSugeridaMin: String(d.duracionMinSugeridaMin ?? 30),
          duracionMaxSugeridaMin: String(d.duracionMaxSugeridaMin ?? 90),
          mejorMomentoDelDia: d.mejorMomentoDelDia ?? [], mejorTemporada: d.mejorTemporada ?? [],
          audienciaIdeal: d.audienciaIdeal ?? [], aptoNiños: d.aptoNiños ?? true,
          aptoMascotas: d.aptoMascotas ?? false, nivelDificultadFisica: String(d.nivelDificultadFisica ?? 1),
          wifi: d.servicios?.wifi ?? false, aireAcondicionado: d.servicios?.aireAcondicionado ?? false,
          aceptaTarjeta: d.servicios?.aceptaTarjeta ?? false,
          reservacionRequerida: d.servicios?.reservacionRequerida ?? false,
          tourGuiado: d.servicios?.tourGuiado ?? false,
          sillaRuedas: d.accesibilidad?.sillaRuedas ?? false,
          banoAccesible: d.accesibilidad?.banoAccesible ?? false,
          estacionamiento: d.accesibilidad?.estacionamiento ?? false,
          notasAccesibilidad: d.accesibilidad?.notas ?? "",
          tipoCocina: d.restaurante?.tipoCocina ?? "",
          opcionesDieteticas: d.restaurante?.opcionesDieteticas ?? [],
          tieneTerraza: d.restaurante?.tieneTerraza ?? false,
          tipsVisita: (d.tipsVisita ?? []).join("\n"),
          historiaResumen: d.historiaResumen ?? "", tags: (d.tags ?? []).join(", "),
          geofenceActivo: d.geofenceActivo ?? false,
          geofenceRadio: String(d.geofenceRadio ?? 150),
          geofenceMensaje: d.geofenceMensaje ?? "",
        });
      }
      setLoading(false);
    });
  }, [id, isNew]);

  // Auto AI fill tras import exitoso desde Maps
  useEffect(() => {
    if (!pendingAiFill || !form.nombre) return;
    setPendingAiFill(false);
    handleAiFill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingAiFill, form.nombre]);

  function set<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImportFromUrl() {
    if (!mapsUrl.trim()) return;
    setUrlLoading(true);
    setUrlMessage("");
    setError("");
    try {
      const res = await fetch("/api/admin/maps-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: mapsUrl.trim() }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error ?? "No se pudo importar"); return; }

      setEditorialSummary(d._editorialSummary ?? "");
      setForm((prev) => ({
        ...prev,
        nombre: d.nombre || prev.nombre,
        direccion: d.direccion || prev.direccion,
        telefono: d.telefono || prev.telefono,
        sitioWeb: d.sitioWeb || prev.sitioWeb,
        horarios: d.horarios || prev.horarios,
        rating: typeof d.rating === "number" ? d.rating : prev.rating,
        reviewCount: typeof d.reviewCount === "number" ? d.reviewCount : prev.reviewCount,
        googlePlaceId: d.googlePlaceId || prev.googlePlaceId,
        ubicacion: d.ubicacion ?? prev.ubicacion,
        imagenUrl: d.imagenUrl || prev.imagenUrl,
        imagenesGaleria: Array.isArray(d.imagenesGaleria) && d.imagenesGaleria.length > 0
          ? d.imagenesGaleria : prev.imagenesGaleria,
      }));
      setMapsUrl("");

      if (d.nombre) {
        setUrlMessage(`Importado: ${d.nombre}. Generando descripciones con IA...`);
        setPendingAiFill(true);
      } else {
        setUrlMessage("Importado. Escribe el nombre del lugar y usa ✨ Rellenar con IA.");
      }
    } catch {
      setError("Error de conexión al importar.");
    } finally {
      setUrlLoading(false);
    }
  }

  async function handleAiFill() {
    if (!form.nombre.trim()) {
      setError("Escribe el nombre del lugar antes de usar la IA.");
      return;
    }
    setAiFilling(true);
    setAiMessage("");
    setError("");
    try {
      const res = await fetch("/api/admin/ai-fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          categoria: form.categoria,
          direccion: form.direccion,
          horariosTexto: form.horarios,
          editorialSummary,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Error de IA"); return; }

      setForm((prev) => ({
        ...prev,
        descripcionCorta: data.descripcionCorta ?? prev.descripcionCorta,
        descripcion: data.descripcion ?? prev.descripcion,
        descripcionLarga: data.descripcionLarga ?? prev.descripcionLarga,
        descripcionCortaEn: data.descripcionCortaEn ?? prev.descripcionCortaEn,
        descripcionEn: data.descripcionEn ?? prev.descripcionEn,
        descripcionLargaEn: data.descripcionLargaEn ?? prev.descripcionLargaEn,
        historiaResumen: data.historiaResumen ?? prev.historiaResumen,
        tipsVisita: Array.isArray(data.tipsVisita) ? data.tipsVisita.join("\n") : prev.tipsVisita,
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : prev.tags,
        mejorMomentoDelDia: Array.isArray(data.mejorMomentoDelDia) ? data.mejorMomentoDelDia : prev.mejorMomentoDelDia,
        mejorTemporada: Array.isArray(data.mejorTemporada) ? data.mejorTemporada : prev.mejorTemporada,
        audienciaIdeal: Array.isArray(data.audienciaIdeal) ? data.audienciaIdeal : prev.audienciaIdeal,
        tipoActividad: (data.tipoActividad === "INTERIOR" || data.tipoActividad === "EXTERIOR" || data.tipoActividad === "MIXTO")
          ? data.tipoActividad : prev.tipoActividad,
      }));
      setAiMessage("✓ Campos generados. Revisa y ajusta lo que necesites.");
      setUrlMessage("");
    } catch {
      setError("No se pudo conectar con la IA.");
    } finally {
      setAiFilling(false);
    }
  }

  async function handleSave() {
    if (!form.nombre.trim()) { setError("El nombre es obligatorio."); return; }
    setSaving(true); setError("");

    const slug = form.nombre.toLowerCase().replace(/[^a-z0-9à-ü]+/gi, "-").replace(/(^-|-$)/g, "");

    const data: Record<string, unknown> = {
      nombre: form.nombre, slug,
      tipoActividad: form.tipoActividad,
      descripcionCorta: form.descripcionCorta,
      descripcion: form.descripcion, descripcionLarga: form.descripcionLarga,
      descripcionCortaEn: form.descripcionCortaEn, descripcionEn: form.descripcionEn, descripcionLargaEn: form.descripcionLargaEn,
      categoria: form.categoria, subcategorias: form.subcategorias.split(",").map((s) => s.trim()).filter(Boolean),
      barrio: form.barrio, direccion: form.direccion, telefono: form.telefono,
      sitioWeb: form.sitioWeb, imagenUrl: form.imagenUrl,
      imagenesGaleria: form.imagenesGaleria,
      ubicacion: form.ubicacion ? new GeoPoint(form.ubicacion.lat, form.ubicacion.lng) : null,
      googlePlaceId: form.googlePlaceId || null,
      horarios: form.horarios,
      cerradoTemporalmente: form.cerradoTemporalmente,
      precioNivel: parseInt(form.precioNivel) || 0,
      precioPromedioMxn: parseInt(form.precioPromedioMxn) || 0,
      entradaGratuita: form.entradaGratuita,
      duracionMinSugeridaMin: parseInt(form.duracionMinSugeridaMin) || 30,
      duracionMaxSugeridaMin: parseInt(form.duracionMaxSugeridaMin) || 90,
      mejorMomentoDelDia: form.mejorMomentoDelDia, mejorTemporada: form.mejorTemporada,
      audienciaIdeal: form.audienciaIdeal, aptoNiños: form.aptoNiños,
      aptoMascotas: form.aptoMascotas, nivelDificultadFisica: parseInt(form.nivelDificultadFisica) || 1,
      servicios: { wifi: form.wifi, aireAcondicionado: form.aireAcondicionado, aceptaTarjeta: form.aceptaTarjeta, reservacionRequerida: form.reservacionRequerida, tourGuiado: form.tourGuiado },
      accesibilidad: { sillaRuedas: form.sillaRuedas, banoAccesible: form.banoAccesible, estacionamiento: form.estacionamiento, notas: form.notasAccesibilidad },
      tipsVisita: form.tipsVisita.split("\n").map((t) => t.trim()).filter(Boolean),
      historiaResumen: form.historiaResumen,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      geofenceActivo: form.geofenceActivo,
      geofenceRadio: parseInt(form.geofenceRadio) || 150,
      geofenceMensaje: form.geofenceMensaje,
    };

    // Sección restaurante solo si aplica
    if (form.categoria === "Restaurante") {
      data.restaurante = {
        tipoCocina: form.tipoCocina,
        opcionesDieteticas: form.opcionesDieteticas,
        tieneTerraza: form.tieneTerraza,
      };
    }

    // rating/reviewCount solo para lugares nuevos (en edición los mantiene Firestore)
    if (isNew) {
      data.rating = 0;
      data.reviewCount = 0;
      data.visitCount = 0;
    }

    try {
      if (isNew) await addDoc(collection(db, "lugares"), data);
      else await setDoc(doc(db, "lugares", id), data, { merge: true });
      router.push("/admin/lugares");
    } catch (err) { setError("Error al guardar."); console.error(err); }
    finally { setSaving(false); }
  }

  if (loading) return <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando...</p>;

  const tabs = ["general", "horarios", "visita", "experiencia", "contenido", "geofence"];
  const tabLabels: Record<string, string> = {
    general: "General",
    horarios: "Horarios",
    visita: "Visita",
    experiencia: "Experiencia",
    contenido: "Contenido",
    geofence: "Geofence",
  };

  return (
    <>
      <div className="admin-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/lugares" className="admin-btn admin-btn-ghost admin-btn-sm">← Volver</Link>
          <h1 className="admin-title">{isNew ? "Nuevo lugar" : `Editar: ${form.nombre}`}</h1>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Guardando..." : "Guardar lugar"}
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {/* Importar desde Google Maps */}
      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>📎 Importar desde Google Maps</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            style={{ flex: "1 1 280px", minWidth: 0 }}
            placeholder="Pega aquí el link de Google Maps"
            value={mapsUrl}
            onChange={(e) => setMapsUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleImportFromUrl()}
          />
          <button
            className="admin-btn admin-btn-primary"
            onClick={handleImportFromUrl}
            disabled={urlLoading || aiFilling || !mapsUrl.trim()}
            style={{ whiteSpace: "nowrap" }}
          >
            {urlLoading ? "Importando…" : aiFilling ? "Generando IA…" : "Importar + IA"}
          </button>
        </div>
        {urlMessage && (
          <div style={{ marginTop: 8, padding: "8px 12px", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, fontSize: 13, color: "#166534" }}>
            {urlMessage}
          </div>
        )}
        {aiMessage && (
          <div style={{ marginTop: 8, padding: "8px 12px", background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, fontSize: 13, color: "#166534" }}>
            {aiMessage}
          </div>
        )}
      </div>

      <div className="admin-tabs" style={{ width: "100%" }}>
        {tabs.map((t) => (
          <button key={t} className={`admin-tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
            {tabLabels[t]}
          </button>
        ))}
      </div>

      {/* ── TAB: GENERAL ── */}
      {activeTab === "general" && (
        <div className="admin-form-section">
          <div className="admin-form-section-title">Información general</div>
          <div className="admin-form">
            <div className="admin-field">
              <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Nombre *</span>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={handleAiFill}
                  disabled={aiFilling || !form.nombre.trim()}
                >
                  {aiFilling ? "Generando…" : "✨ Rellenar con IA"}
                </button>
              </label>
              <input
                value={form.nombre}
                onChange={(e) => set("nombre", e.target.value)}
                placeholder="Ej: Catedral de La Purísima Concepción"
              />
            </div>

            {/* Categoría + Tipo de actividad */}
            <div className="admin-form-row">
              <div className="admin-field">
                <label>Categoría</label>
                <select value={form.categoria} onChange={(e) => set("categoria", e.target.value)}>
                  {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="admin-field">
                <label>Tipo de actividad</label>
                <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                  {(["INTERIOR", "EXTERIOR", "MIXTO"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`admin-btn admin-btn-sm ${form.tipoActividad === t ? "admin-btn-primary" : "admin-btn-ghost"}`}
                      onClick={() => set("tipoActividad", t)}
                    >
                      {t === "INTERIOR" ? "Interior" : t === "EXTERIOR" ? "Exterior" : "Mixto"}
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 4 }}>
                  Interior = cerrado · Exterior = aire libre · Mixto = ambos
                </span>
              </div>
            </div>

            {/* Badges de rating (solo en modo edición) */}
            {!isNew && form.rating > 0 && (
              <div style={{ fontSize: 13, color: "var(--fg-3)", padding: "8px 12px", background: "#f8f9fa", borderRadius: 8 }}>
                ⭐ {form.rating.toFixed(1)} ({form.reviewCount} reseñas) — actualizado por usuarios y Google
              </div>
            )}

            {/* Descripciones bilingüe */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: "var(--fg-2)", marginBottom: 10, paddingBottom: 6, borderBottom: "2px solid var(--primary)", display: "inline-block" }}>🇲🇽 Español</div>
                <div className="admin-field"><label>Descripción corta (≤140)</label><input value={form.descripcionCorta} onChange={(e) => set("descripcionCorta", e.target.value)} maxLength={140} /></div>
                <div className="admin-field"><label>Descripción</label><textarea value={form.descripcion} onChange={(e) => set("descripcion", e.target.value)} /></div>
                <div className="admin-field"><label>Descripción larga</label><textarea value={form.descripcionLarga} onChange={(e) => set("descripcionLarga", e.target.value)} style={{ minHeight: 160 }} /></div>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: "var(--fg-2)", marginBottom: 10, paddingBottom: 6, borderBottom: "2px solid #3b82f6", display: "inline-block" }}>🇺🇸 English</div>
                <div className="admin-field"><label>Short description (≤140)</label><input value={form.descripcionCortaEn} onChange={(e) => set("descripcionCortaEn", e.target.value)} maxLength={140} /></div>
                <div className="admin-field"><label>Description</label><textarea value={form.descripcionEn} onChange={(e) => set("descripcionEn", e.target.value)} /></div>
                <div className="admin-field"><label>Long description</label><textarea value={form.descripcionLargaEn} onChange={(e) => set("descripcionLargaEn", e.target.value)} style={{ minHeight: 160 }} /></div>
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-field"><label>Barrio / Zona</label><input value={form.barrio} onChange={(e) => set("barrio", e.target.value)} /></div>
              <div className="admin-field"><label>Dirección</label><input value={form.direccion} onChange={(e) => set("direccion", e.target.value)} /></div>
            </div>
            <div className="admin-form-row">
              <div className="admin-field"><label>Teléfono</label><input value={form.telefono} onChange={(e) => set("telefono", e.target.value)} /></div>
              <div className="admin-field"><label>Sitio web</label><input value={form.sitioWeb} onChange={(e) => set("sitioWeb", e.target.value)} /></div>
            </div>

            <div className="admin-field">
              <label>Ubicación en el mapa</label>
              <MapPicker value={form.ubicacion} onChange={(v) => set("ubicacion", v)} />
            </div>

            <ImageUploader
              lugarId={isNew ? "nuevo" : id}
              imagenUrl={form.imagenUrl}
              imagenesGaleria={form.imagenesGaleria}
              onChangeUrl={(url) => set("imagenUrl", url)}
              onChangeGaleria={(urls) => set("imagenesGaleria", urls)}
            />

            {/* Subcategorías — colapsable */}
            <details style={{ marginTop: 8 }}>
              <summary style={{ fontSize: 12, fontWeight: 600, color: "var(--fg-3)", cursor: "pointer", userSelect: "none" }}>
                Subcategorías (opcional)
              </summary>
              <div className="admin-field" style={{ marginTop: 8 }}>
                <input
                  value={form.subcategorias}
                  onChange={(e) => set("subcategorias", e.target.value)}
                  placeholder="Ej: arqueología, colonial, arte sacro (separadas por comas)"
                />
              </div>
            </details>
          </div>
        </div>
      )}

      {/* ── TAB: HORARIOS ── */}
      {activeTab === "horarios" && (
        <div className="admin-form-section">
          <div className="admin-form-section-title">Horarios y precio</div>
          <div className="admin-form">
            <div className="admin-field"><label>Horarios (texto)</label><textarea value={form.horarios} onChange={(e) => set("horarios", e.target.value)} placeholder="Lun-Vie 9:00-18:00, Sáb 10:00-14:00..." /></div>
            <Toggle label="Cerrado temporalmente" checked={form.cerradoTemporalmente} onChange={(v) => set("cerradoTemporalmente", v)} />
            <Toggle label="Entrada gratuita" checked={form.entradaGratuita} onChange={(v) => set("entradaGratuita", v)} />
            <div className="admin-form-row">
              <div className="admin-field">
                <label>Nivel de precio</label>
                <select value={form.precioNivel} onChange={(e) => set("precioNivel", e.target.value)}>
                  {[["0","Gratis"],["1","$ (económico)"],["2","$$ (moderado)"],["3","$$$ (caro)"],["4","$$$$ (premium)"]].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div className="admin-field"><label>Precio promedio (MXN)</label><input type="number" value={form.precioPromedioMxn} onChange={(e) => set("precioPromedioMxn", e.target.value)} /></div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: VISITA ── */}
      {activeTab === "visita" && (
        <div className="admin-form-section">
          <div className="admin-form-section-title">Información de visita</div>
          <div className="admin-form">
            <div className="admin-form-row">
              <div className="admin-field"><label>Duración mín (min)</label><input type="number" value={form.duracionMinSugeridaMin} onChange={(e) => set("duracionMinSugeridaMin", e.target.value)} /></div>
              <div className="admin-field"><label>Duración máx (min)</label><input type="number" value={form.duracionMaxSugeridaMin} onChange={(e) => set("duracionMaxSugeridaMin", e.target.value)} /></div>
            </div>
            <div className="admin-field">
              <label>Dificultad física (1-5)</label>
              <input type="range" min="1" max="5" value={form.nivelDificultadFisica} onChange={(e) => set("nivelDificultadFisica", e.target.value)} />
              <span style={{ fontSize: 13, color: "var(--fg-2)" }}>{form.nivelDificultadFisica} / 5</span>
            </div>
            <div className="admin-field"><label>Mejor momento del día</label><MultiCheck options={MOMENTOS} selected={form.mejorMomentoDelDia} onChange={(v) => set("mejorMomentoDelDia", v)} /></div>
            <div className="admin-field"><label>Mejor temporada</label><MultiCheck options={TEMPORADAS} selected={form.mejorTemporada} onChange={(v) => set("mejorTemporada", v)} /></div>
            <div className="admin-field"><label>Audiencia ideal</label><MultiCheck options={AUDIENCIAS} selected={form.audienciaIdeal} onChange={(v) => set("audienciaIdeal", v)} /></div>
            <Toggle label="Apto para niños" checked={form.aptoNiños} onChange={(v) => set("aptoNiños", v)} />
            <Toggle label="Apto para mascotas" checked={form.aptoMascotas} onChange={(v) => set("aptoMascotas", v)} />
          </div>
        </div>
      )}

      {/* ── TAB: EXPERIENCIA (Servicios + Accesibilidad + Restaurante) ── */}
      {activeTab === "experiencia" && (
        <div className="admin-form-section">
          <div className="admin-form-section-title">Servicios disponibles</div>
          <div className="admin-form">
            <Toggle label="Wi-Fi" checked={form.wifi} onChange={(v) => set("wifi", v)} />
            <Toggle label="Aire acondicionado" checked={form.aireAcondicionado} onChange={(v) => set("aireAcondicionado", v)} />
            <Toggle label="Acepta tarjeta" checked={form.aceptaTarjeta} onChange={(v) => set("aceptaTarjeta", v)} />
            <Toggle label="Requiere reservación" checked={form.reservacionRequerida} onChange={(v) => set("reservacionRequerida", v)} />
            <Toggle label="Tour guiado disponible" checked={form.tourGuiado} onChange={(v) => set("tourGuiado", v)} />
          </div>

          <div className="admin-form-section-title" style={{ marginTop: 24 }}>Accesibilidad</div>
          <div className="admin-form">
            <Toggle label="Acceso en silla de ruedas" checked={form.sillaRuedas} onChange={(v) => set("sillaRuedas", v)} />
            <Toggle label="Baño accesible" checked={form.banoAccesible} onChange={(v) => set("banoAccesible", v)} />
            <Toggle label="Estacionamiento" checked={form.estacionamiento} onChange={(v) => set("estacionamiento", v)} />
            <div className="admin-field"><label>Notas de accesibilidad</label><textarea value={form.notasAccesibilidad} onChange={(e) => set("notasAccesibilidad", e.target.value)} /></div>
          </div>

          {/* Sección Restaurante — solo visible cuando aplica */}
          {form.categoria === "Restaurante" && (
            <>
              <div className="admin-form-section-title" style={{ marginTop: 24 }}>Restaurante</div>
              <div className="admin-form">
                <div className="admin-field">
                  <label>Tipo de cocina</label>
                  <input value={form.tipoCocina} onChange={(e) => set("tipoCocina", e.target.value)} placeholder="Ej: Mexicana tradicional, Mariscos" />
                </div>
                <div className="admin-field">
                  <label>Opciones dietéticas</label>
                  <MultiCheck options={OPCIONES_DIETETICAS} selected={form.opcionesDieteticas} onChange={(v) => set("opcionesDieteticas", v)} />
                </div>
                <Toggle label="Tiene terraza / área exterior" checked={form.tieneTerraza} onChange={(v) => set("tieneTerraza", v)} />
              </div>
            </>
          )}
        </div>
      )}

      {/* ── TAB: CONTENIDO ── */}
      {activeTab === "contenido" && (
        <div className="admin-form-section">
          <div className="admin-form-section-title">Contenido editorial</div>
          <div className="admin-form">
            <div className="admin-field"><label>Tips de visita (uno por línea)</label><textarea value={form.tipsVisita} onChange={(e) => set("tipsVisita", e.target.value)} placeholder="Llega temprano para evitar el sol&#10;Lleva sombrero&#10;..." style={{ minHeight: 120 }} /></div>
            <div className="admin-field"><label>Historia / Resumen histórico</label><textarea value={form.historiaResumen} onChange={(e) => set("historiaResumen", e.target.value)} style={{ minHeight: 120 }} /></div>
            <div className="admin-field"><label>Tags (separados por comas)</label><input value={form.tags} onChange={(e) => set("tags", e.target.value)} /></div>
          </div>
        </div>
      )}

      {/* ── TAB: GEOFENCE ── */}
      {activeTab === "geofence" && (
        <div className="admin-form-section">
          <div className="admin-form-section-title">Notificación de proximidad (Geofence)</div>
          <p style={{ fontSize: 13, color: "var(--fg-3)", marginBottom: 20 }}>
            Cuando un turista se acerque a las coordenadas de este lugar, recibirá una notificación automática.
          </p>
          <div className="admin-form">
            <Toggle label="Activar geofence para este lugar" checked={form.geofenceActivo} onChange={(v) => set("geofenceActivo", v)} />
            {form.geofenceActivo && (
              <>
                <div className="admin-field">
                  <label>Radio (metros)</label>
                  <input type="number" value={form.geofenceRadio} onChange={(e) => set("geofenceRadio", e.target.value)} placeholder="150" />
                  <span style={{ fontSize: 12, color: "var(--fg-3)" }}>Recomendado: 100-300m según el tamaño del lugar</span>
                </div>
                <div className="admin-field">
                  <label>Mensaje de la notificación</label>
                  <input value={form.geofenceMensaje} onChange={(e) => set("geofenceMensaje", e.target.value)} placeholder="¿Sabías que este templo data de 1786? Toca para saber más" />
                  <span style={{ fontSize: 12, color: "var(--fg-3)" }}>{form.geofenceMensaje.length}/100 caracteres recomendados</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
