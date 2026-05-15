"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface FormData {
  nombre: string; descripcionCorta: string; descripcion: string; descripcionLarga: string;
  categoria: string; subcategorias: string; barrio: string; direccion: string;
  telefono: string; sitioWeb: string; imagenUrl: string;
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
  tipsVisita: string; historiaResumen: string; tags: string;
  geofenceActivo: boolean; geofenceRadio: string; geofenceMensaje: string;
}

const empty: FormData = {
  nombre: "", descripcionCorta: "", descripcion: "", descripcionLarga: "",
  categoria: "General", subcategorias: "", barrio: "", direccion: "",
  telefono: "", sitioWeb: "", imagenUrl: "",
  horarios: "", cerradoTemporalmente: false,
  precioNivel: "0", precioPromedioMxn: "0", entradaGratuita: true,
  duracionMinSugeridaMin: "30", duracionMaxSugeridaMin: "90",
  mejorMomentoDelDia: [], mejorTemporada: [], audienciaIdeal: [],
  aptoNiños: true, aptoMascotas: false, nivelDificultadFisica: "1",
  wifi: false, aireAcondicionado: false, aceptaTarjeta: false,
  reservacionRequerida: false, tourGuiado: false,
  sillaRuedas: false, banoAccesible: false, estacionamiento: false,
  notasAccesibilidad: "",
  tipsVisita: "", historiaResumen: "", tags: "",
  geofenceActivo: false, geofenceRadio: "150", geofenceMensaje: "",
};

const MOMENTOS = ["AMANECER", "MAÑANA", "MEDIODIA", "TARDE", "ATARDECER", "NOCHE"];
const TEMPORADAS = ["Primavera", "Verano", "Otoño", "Invierno", "Todo el año"];
const AUDIENCIAS = ["SOLO", "PAREJA", "FAMILIA", "AMIGOS", "NIÑOS", "MAYORES"];
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

  useEffect(() => {
    if (isNew) return;
    getDoc(doc(db, "lugares", id)).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setForm({
          nombre: d.nombre ?? "", descripcionCorta: d.descripcionCorta ?? "",
          descripcion: d.descripcion ?? "", descripcionLarga: d.descripcionLarga ?? "",
          categoria: d.categoria ?? "General", subcategorias: (d.subcategorias ?? []).join(", "),
          barrio: d.barrio ?? "", direccion: d.direccion ?? "",
          telefono: d.telefono ?? "", sitioWeb: d.sitioWeb ?? "", imagenUrl: d.imagenUrl ?? "",
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

  function set<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.nombre.trim()) { setError("El nombre es obligatorio."); return; }
    setSaving(true); setError("");

    const slug = form.nombre.toLowerCase().replace(/[^a-z0-9à-ü]+/gi, "-").replace(/(^-|-$)/g, "");

    const data = {
      nombre: form.nombre, slug, descripcionCorta: form.descripcionCorta,
      descripcion: form.descripcion, descripcionLarga: form.descripcionLarga,
      categoria: form.categoria, subcategorias: form.subcategorias.split(",").map((s) => s.trim()).filter(Boolean),
      barrio: form.barrio, direccion: form.direccion, telefono: form.telefono,
      sitioWeb: form.sitioWeb, imagenUrl: form.imagenUrl, horarios: form.horarios,
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

    try {
      if (isNew) await addDoc(collection(db, "lugares"), { ...data, rating: 0, reviewCount: 0, visitCount: 0 });
      else await setDoc(doc(db, "lugares", id), data, { merge: true });
      router.push("/admin/lugares");
    } catch (err) { setError("Error al guardar."); console.error(err); }
    finally { setSaving(false); }
  }

  if (loading) return <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando...</p>;

  const tabs = ["general", "horarios", "visita", "servicios", "accesibilidad", "contenido", "geofence"];

  return (
    <>
      <div className="admin-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/admin/lugares" className="admin-btn admin-btn-ghost admin-btn-sm">← Volver</Link>
          <h1 className="admin-title">{isNew ? "Nuevo lugar" : `Editar: ${form.nombre}`}</h1>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar lugar"}</button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-tabs" style={{ width: "100%" }}>
        {tabs.map((t) => (
          <button key={t} className={`admin-tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "general" && (
        <div className="admin-form-section">
          <div className="admin-form-section-title">Información general</div>
          <div className="admin-form">
            <div className="admin-field"><label>Nombre *</label><input value={form.nombre} onChange={(e) => set("nombre", e.target.value)} /></div>
            <div className="admin-form-row">
              <div className="admin-field"><label>Categoría</label>
                <select value={form.categoria} onChange={(e) => set("categoria", e.target.value)}>
                  {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="admin-field"><label>Subcategorías (comas)</label><input value={form.subcategorias} onChange={(e) => set("subcategorias", e.target.value)} /></div>
            </div>
            <div className="admin-field"><label>Descripción corta (≤140 chars)</label><input value={form.descripcionCorta} onChange={(e) => set("descripcionCorta", e.target.value)} maxLength={140} /></div>
            <div className="admin-field"><label>Descripción</label><textarea value={form.descripcion} onChange={(e) => set("descripcion", e.target.value)} /></div>
            <div className="admin-field"><label>Descripción larga</label><textarea value={form.descripcionLarga} onChange={(e) => set("descripcionLarga", e.target.value)} style={{ minHeight: 160 }} /></div>
            <div className="admin-form-row">
              <div className="admin-field"><label>Barrio / Zona</label><input value={form.barrio} onChange={(e) => set("barrio", e.target.value)} /></div>
              <div className="admin-field"><label>Dirección</label><input value={form.direccion} onChange={(e) => set("direccion", e.target.value)} /></div>
            </div>
            <div className="admin-form-row">
              <div className="admin-field"><label>Teléfono</label><input value={form.telefono} onChange={(e) => set("telefono", e.target.value)} /></div>
              <div className="admin-field"><label>Sitio web</label><input value={form.sitioWeb} onChange={(e) => set("sitioWeb", e.target.value)} /></div>
            </div>
            <div className="admin-field"><label>URL imagen principal</label><input value={form.imagenUrl} onChange={(e) => set("imagenUrl", e.target.value)} /></div>
            {form.imagenUrl && <img src={form.imagenUrl} alt="" style={{ width: 200, height: 120, objectFit: "cover", borderRadius: 8 }} onError={(e) => (e.currentTarget.style.display = "none")} />}
          </div>
        </div>
      )}

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

      {activeTab === "visita" && (
        <div className="admin-form-section">
          <div className="admin-form-section-title">Información de visita</div>
          <div className="admin-form">
            <div className="admin-form-row">
              <div className="admin-field"><label>Duración mín (min)</label><input type="number" value={form.duracionMinSugeridaMin} onChange={(e) => set("duracionMinSugeridaMin", e.target.value)} /></div>
              <div className="admin-field"><label>Duración máx (min)</label><input type="number" value={form.duracionMaxSugeridaMin} onChange={(e) => set("duracionMaxSugeridaMin", e.target.value)} /></div>
            </div>
            <div className="admin-field"><label>Dificultad física (1-5)</label><input type="range" min="1" max="5" value={form.nivelDificultadFisica} onChange={(e) => set("nivelDificultadFisica", e.target.value)} /><span style={{ fontSize: 13, color: "var(--fg-2)" }}>{form.nivelDificultadFisica} / 5</span></div>
            <div className="admin-field"><label>Mejor momento del día</label><MultiCheck options={MOMENTOS} selected={form.mejorMomentoDelDia} onChange={(v) => set("mejorMomentoDelDia", v)} /></div>
            <div className="admin-field"><label>Mejor temporada</label><MultiCheck options={TEMPORADAS} selected={form.mejorTemporada} onChange={(v) => set("mejorTemporada", v)} /></div>
            <div className="admin-field"><label>Audiencia ideal</label><MultiCheck options={AUDIENCIAS} selected={form.audienciaIdeal} onChange={(v) => set("audienciaIdeal", v)} /></div>
            <Toggle label="Apto para niños" checked={form.aptoNiños} onChange={(v) => set("aptoNiños", v)} />
            <Toggle label="Apto para mascotas" checked={form.aptoMascotas} onChange={(v) => set("aptoMascotas", v)} />
          </div>
        </div>
      )}

      {activeTab === "servicios" && (
        <div className="admin-form-section">
          <div className="admin-form-section-title">Servicios disponibles</div>
          <div className="admin-form">
            <Toggle label="Wi-Fi" checked={form.wifi} onChange={(v) => set("wifi", v)} />
            <Toggle label="Aire acondicionado" checked={form.aireAcondicionado} onChange={(v) => set("aireAcondicionado", v)} />
            <Toggle label="Acepta tarjeta" checked={form.aceptaTarjeta} onChange={(v) => set("aceptaTarjeta", v)} />
            <Toggle label="Requiere reservación" checked={form.reservacionRequerida} onChange={(v) => set("reservacionRequerida", v)} />
            <Toggle label="Tour guiado disponible" checked={form.tourGuiado} onChange={(v) => set("tourGuiado", v)} />
          </div>
        </div>
      )}

      {activeTab === "accesibilidad" && (
        <div className="admin-form-section">
          <div className="admin-form-section-title">Accesibilidad</div>
          <div className="admin-form">
            <Toggle label="Acceso en silla de ruedas" checked={form.sillaRuedas} onChange={(v) => set("sillaRuedas", v)} />
            <Toggle label="Baño accesible" checked={form.banoAccesible} onChange={(v) => set("banoAccesible", v)} />
            <Toggle label="Estacionamiento" checked={form.estacionamiento} onChange={(v) => set("estacionamiento", v)} />
            <div className="admin-field"><label>Notas de accesibilidad</label><textarea value={form.notasAccesibilidad} onChange={(e) => set("notasAccesibilidad", e.target.value)} /></div>
          </div>
        </div>
      )}

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

      {activeTab === "geofence" && (
        <div className="admin-form-section">
          <div className="admin-form-section-title">Notificación de proximidad (Geofence)</div>
          <p style={{ fontSize: 13, color: "var(--fg-3)", marginBottom: 20 }}>
            Cuando un turista se acerque a las coordenadas de este lugar, recibirá una notificación automática. Las coordenadas se toman del campo <code>ubicacion</code> del lugar.
          </p>
          <div className="admin-form">
            <Toggle label="Activar geofence para este lugar" checked={form.geofenceActivo} onChange={(v) => set("geofenceActivo", v)} />
            {form.geofenceActivo && (
              <>
                <div className="admin-field"><label>Radio (metros)</label><input type="number" value={form.geofenceRadio} onChange={(e) => set("geofenceRadio", e.target.value)} placeholder="150" /><span style={{ fontSize: 12, color: "var(--fg-3)" }}>Recomendado: 100-300m según el tamaño del lugar</span></div>
                <div className="admin-field"><label>Mensaje de la notificación</label><input value={form.geofenceMensaje} onChange={(e) => set("geofenceMensaje", e.target.value)} placeholder="¿Sabías que este templo data de 1786? Toca para saber más" /><span style={{ fontSize: 12, color: "var(--fg-3)" }}>{form.geofenceMensaje.length}/100 caracteres recomendados</span></div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
