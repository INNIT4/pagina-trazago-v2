"use client";

import { useState } from "react";

interface FormData { title: string; body: string; topic: string; }

export default function NotificacionesPage() {
  const [form, setForm] = useState<FormData>({ title: "", body: "", topic: "all" });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSend() {
    if (!form.title.trim() || !form.body.trim()) {
      setResult({ ok: false, message: "Título y mensaje son obligatorios." });
      return;
    }
    setSending(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/notificaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, message: `Notificación enviada correctamente. ID: ${data.messageId}` });
        setForm({ title: "", body: "", topic: "all" });
      } else {
        setResult({ ok: false, message: data.error ?? "Error al enviar." });
      }
    } catch {
      setResult({ ok: false, message: "Error de conexión." });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-title">Notificaciones Push</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, alignItems: "start" }}>
        <div className="admin-form-section">
          <div className="admin-form-section-title">Componer notificación</div>
          <div className="admin-form">
            {result && (
              <div className={result.ok ? "admin-card" : "admin-error"} style={result.ok ? { background: "#e8f5e9", color: "#2e7d32", border: "1px solid #c8e6c9" } : {}}>
                {result.message}
              </div>
            )}
            <div className="admin-field">
              <label>Segmento / Audiencia</label>
              <select value={form.topic} onChange={(e) => set("topic", e.target.value)}>
                <option value="all">Todos los usuarios</option>
                <option value="eventos">Suscriptores de eventos</option>
                <option value="alertas">Canal de alertas</option>
                <option value="noticias">Canal de noticias</option>
              </select>
            </div>
            <div className="admin-field">
              <label>Título *</label>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Nuevo evento en Álamos" maxLength={100} />
              <span style={{ fontSize: 11, color: "var(--fg-3)" }}>{form.title.length}/100</span>
            </div>
            <div className="admin-field">
              <label>Mensaje *</label>
              <textarea value={form.body} onChange={(e) => set("body", e.target.value)} placeholder="Este fin de semana no te pierdas la Feria del Queso..." style={{ minHeight: 120 }} maxLength={240} />
              <span style={{ fontSize: 11, color: "var(--fg-3)" }}>{form.body.length}/240</span>
            </div>
            <button className="admin-btn admin-btn-primary" onClick={handleSend} disabled={sending} style={{ alignSelf: "flex-start" }}>
              {sending ? "Enviando..." : "🔔 Enviar notificación"}
            </button>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-section-title" style={{ marginBottom: 12 }}>Cómo funciona</div>
          <p style={{ fontSize: 13, color: "var(--fg-2)", lineHeight: 1.6, marginBottom: 12 }}>
            Las notificaciones se envían via <strong>Firebase Cloud Messaging (FCM)</strong> a todos los dispositivos suscritos al topic seleccionado.
          </p>
          <p style={{ fontSize: 13, color: "var(--fg-2)", lineHeight: 1.6, marginBottom: 12 }}>
            Los usuarios de la app Android se suscriben automáticamente al topic <code>all</code> al instalar la app.
          </p>
          <p style={{ fontSize: 13, color: "var(--fg-2)", lineHeight: 1.6 }}>
            Requiere configurar <code>FIREBASE_SERVICE_ACCOUNT_JSON</code> en las variables de entorno de Vercel.
          </p>
        </div>
      </div>
    </>
  );
}
