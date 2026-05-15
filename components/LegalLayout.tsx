import type { ReactNode } from "react";

export default function LegalLayout({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="wrap-narrow">
          <span className="eyebrow">
            <span className="dot"></span>
            {eyebrow}
          </span>
          <h1 style={{ marginTop: 24 }}>{title}</h1>
          <p
            className="mono"
            style={{
              marginTop: 24,
              fontSize: 12,
              color: "var(--fg-3)",
              textTransform: "uppercase",
              letterSpacing: ".08em",
            }}
          >
            {updated}
          </p>
        </div>
      </section>

      <section className="legal-body" style={{ paddingTop: 0 }}>
        <div className="wrap-narrow">{children}</div>
      </section>
    </>
  );
}
