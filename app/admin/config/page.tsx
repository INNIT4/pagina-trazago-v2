"use client";

import { useEffect, useState } from "react";

interface Param { key: string; value: string; description: string; }

export default function RemoteConfigPage() {
  const [params, setParams] = useState<Param[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [result, setResult] = useState<{ key: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetch("/api/admin/config").then((r) => r.json()).then((data) => {
      setParams(data.params ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleUpdate(param: Param, newValue: string) {
    setSaving(param.key);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: param.key, value: newValue }),
      });
      setResult({ key: param.key, ok: res.ok });
      if (res.ok) setParams((prev) => prev.map((p) => p.key === param.key ? { ...p, value: newValue } : p));
    } catch { setResult({ key: param.key, ok: false }); }
    finally { setSaving(null); }
  }

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-title">Remote Config</h1>
      </div>

      {loading ? <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando parámetros...</p> : params.length === 0 ? (
        <div className="admin-card">
          <p style={{ fontSize: 14, color: "var(--fg-2)" }}>No hay parámetros de Remote Config configurados, o falta la variable <code>FIREBASE_SERVICE_ACCOUNT_JSON</code>.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Parámetro</th><th>Descripción</th><th>Valor actual</th><th>Guardar</th></tr></thead>
            <tbody>
              {params.map((p) => {
                const isEditingThis = saving === p.key;
                let localValue = p.value;
                return (
                  <tr key={p.key}>
                    <td style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: 600 }}>{p.key}</td>
                    <td style={{ fontSize: 13, color: "var(--fg-2)" }}>{p.description}</td>
                    <td>
                      <input
                        defaultValue={p.value}
                        onChange={(e) => { localValue = e.target.value; }}
                        style={{ border: "1px solid #dde1e7", borderRadius: 6, padding: "6px 10px", fontSize: 13, fontFamily: "var(--mono)", width: "100%" }}
                      />
                    </td>
                    <td>
                      <button
                        className="admin-btn admin-btn-sm admin-btn-primary"
                        disabled={isEditingThis}
                        onClick={() => handleUpdate(p, localValue)}
                      >
                        {isEditingThis ? "..." : "Guardar"}
                      </button>
                      {result?.key === p.key && <span style={{ fontSize: 11, color: result.ok ? "var(--green)" : "var(--red)", marginLeft: 6 }}>{result.ok ? "✓" : "✗"}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
