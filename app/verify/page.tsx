"use client";

import { useEffect, useState } from "react";
import { applyActionCode } from "firebase/auth";
import { auth } from "@/lib/firebase";

type State = "idle" | "loading" | "success" | "error" | "invalid";

export default function VerifyEmailPage() {
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [oobCode, setOobCode] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    const code = params.get("oobCode");

    if (mode !== "verifyEmail" || !code) {
      setState("invalid");
      return;
    }
    setOobCode(code);
  }, []);

  async function handleVerify() {
    if (!oobCode || !auth) return;
    setState("loading");
    try {
      await applyActionCode(auth, oobCode);
      setState("success");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? "";
      if (code === "auth/invalid-action-code" || code === "auth/expired-action-code") {
        setErrorMsg(
          "Este enlace ya fue usado o caducó. Abre la app TrazaGo, inicia sesión con tu contraseña y solicita un nuevo correo de verificación."
        );
      } else {
        setErrorMsg("Ocurrió un error inesperado. Inténtalo de nuevo.");
      }
      setState("error");
    }
  }

  return (
    <main
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f6f8",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "40px 36px",
          maxWidth: "460px",
          width: "100%",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          textAlign: "center",
        }}
      >
        {/* Logo / header */}
        <div
          style={{
            background: "#1B5E20",
            borderRadius: "12px",
            padding: "16px 24px",
            marginBottom: "28px",
          }}
        >
          <p style={{ color: "#fff", margin: 0, fontSize: "22px", fontWeight: "bold" }}>
            TrazaGo
          </p>
          <p style={{ color: "#A5D6A7", margin: "4px 0 0", fontSize: "13px" }}>
            Álamos, Sonora · Pueblo Mágico
          </p>
        </div>

        {/* Estados */}
        {(state === "idle" || state === "loading") && oobCode && (
          <>
            <p style={{ fontSize: "20px", fontWeight: "bold", color: "#1B5E20", marginBottom: "8px" }}>
              Confirma tu correo electrónico
            </p>
            <p style={{ color: "#555", lineHeight: 1.6, marginBottom: "28px" }}>
              Haz clic en el botón para verificar tu cuenta y empezar a explorar Álamos.
            </p>
            <button
              onClick={handleVerify}
              disabled={state === "loading"}
              style={{
                background: state === "loading" ? "#a5d6a7" : "#1B5E20",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "14px 36px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: state === "loading" ? "not-allowed" : "pointer",
                width: "100%",
                transition: "background 0.2s",
              }}
            >
              {state === "loading" ? "Verificando…" : "Confirmar mi correo"}
            </button>
          </>
        )}

        {state === "success" && (
          <>
            <p style={{ fontSize: "48px", margin: "0 0 8px" }}>✅</p>
            <p style={{ fontSize: "20px", fontWeight: "bold", color: "#1B5E20", marginBottom: "8px" }}>
              ¡Correo verificado!
            </p>
            <p style={{ color: "#555", lineHeight: 1.6, marginBottom: "28px" }}>
              Tu cuenta está activa. Abre TrazaGo e inicia sesión para empezar.
            </p>
            <a
              href="trazago://home"
              style={{
                display: "inline-block",
                background: "#1B5E20",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "10px",
                padding: "14px 36px",
                fontSize: "16px",
                fontWeight: "bold",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              Abrir TrazaGo
            </a>
          </>
        )}

        {state === "error" && (
          <>
            <p style={{ fontSize: "48px", margin: "0 0 8px" }}>⚠️</p>
            <p style={{ fontSize: "20px", fontWeight: "bold", color: "#b71c1c", marginBottom: "8px" }}>
              No se pudo verificar
            </p>
            <p style={{ color: "#555", lineHeight: 1.6 }}>{errorMsg}</p>
          </>
        )}

        {state === "invalid" && (
          <>
            <p style={{ fontSize: "48px", margin: "0 0 8px" }}>🔗</p>
            <p style={{ fontSize: "20px", fontWeight: "bold", color: "#555", marginBottom: "8px" }}>
              Enlace no válido
            </p>
            <p style={{ color: "#888", lineHeight: 1.6 }}>
              Este enlace no es un enlace de verificación de TrazaGo.
            </p>
          </>
        )}

        <p style={{ color: "#bbb", fontSize: "12px", marginTop: "32px" }}>
          © TrazaGo · Álamos, Sonora, México
        </p>
      </div>
    </main>
  );
}
