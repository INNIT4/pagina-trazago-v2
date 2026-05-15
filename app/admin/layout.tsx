"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const NAV = [
  {
    section: "Principal",
    items: [
      { href: "/admin", icon: "📊", label: "Dashboard" },
    ],
  },
  {
    section: "Contenido",
    items: [
      { href: "/admin/blog", icon: "✍️", label: "Blog" },
      { href: "/admin/eventos", icon: "📅", label: "Eventos" },
      { href: "/admin/banners", icon: "📢", label: "Banners" },
    ],
  },
  {
    section: "Directorio",
    items: [
      { href: "/admin/lugares", icon: "📍", label: "Lugares / POI" },
      { href: "/admin/rutas", icon: "🗺️", label: "Rutas temáticas" },
      { href: "/admin/servicios", icon: "🏪", label: "Servicios" },
      { href: "/admin/emergencia", icon: "🚨", label: "Emergencia" },
    ],
  },
  {
    section: "Comunidad",
    items: [
      { href: "/admin/comunidad", icon: "💬", label: "Publicaciones" },
      { href: "/admin/opiniones", icon: "⭐", label: "Opiniones" },
      { href: "/admin/fotos", icon: "🖼️", label: "Fotos" },
    ],
  },
  {
    section: "Sistema",
    items: [
      { href: "/admin/notificaciones", icon: "🔔", label: "Notificaciones" },
      { href: "/admin/usuarios", icon: "👥", label: "Usuarios" },
      { href: "/admin/analytics", icon: "📈", label: "Analytics" },
      { href: "/admin/config", icon: "⚙️", label: "Remote Config" },
      { href: "/admin/importar", icon: "📥", label: "Importar" },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/admin/login");
        return; // mantener checking=true hasta que navegue
      }

      const token = await user.getIdTokenResult(true);
      if (!token.claims.admin) {
        await signOut(auth);
        router.push("/admin/login");
        return; // mantener checking=true hasta que navegue
      }

      setUserEmail(user.email ?? "");
      setChecking(false);
    });

    return () => unsub();
  }, [pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;
  if (checking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5" }}>
        <p style={{ color: "#84746A", fontSize: 14 }}>Verificando sesión...</p>
      </div>
    );
  }

  async function handleSignOut() {
    await signOut(auth);
    router.push("/admin/login");
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span>TrazaGo</span>
          <small>Panel de administración</small>
        </div>

        <nav className="admin-nav">
          {NAV.map((group) => (
            <div key={group.section}>
              <div className="admin-nav-section">{group.section}</div>
              {group.items.map((item) => {
                const isActive = item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={isActive ? "active" : ""}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div style={{ marginBottom: 8 }}>{userEmail}</div>
          <button
            onClick={handleSignOut}
            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 12, padding: 0 }}
          >
            Cerrar sesión →
          </button>
        </div>
      </aside>

      <main className="admin-content">{children}</main>
    </div>
  );
}
