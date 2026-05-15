"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection, query, where, getDocs, orderBy, limit, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Stats {
  pendingReports: number;
  totalPlaces: number;
  upcomingEvents: number;
  communityPostsToday: number;
  hiddenPosts: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const now = Timestamp.now();
        const startOfDay = Timestamp.fromDate(
          new Date(new Date().setHours(0, 0, 0, 0))
        );

        const [
          reportsSnap,
          placesSnap,
          eventsSnap,
          postsSnap,
          hiddenSnap,
          usersSnap,
        ] = await Promise.all([
          getDocs(query(collection(db, "reportes_publicaciones"), where("status", "==", "pending"))),
          getDocs(collection(db, "lugares")),
          getDocs(query(collection(db, "eventos"), where("startDate", ">=", now))),
          getDocs(query(collection(db, "publicaciones_comunidad"), where("createdAt", ">=", startOfDay))),
          getDocs(query(collection(db, "publicaciones_comunidad"), where("hidden", "==", true))),
          getDocs(query(collection(db, "users"), limit(1000))),
        ]);

        setStats({
          pendingReports: reportsSnap.size,
          totalPlaces: placesSnap.size,
          upcomingEvents: eventsSnap.size,
          communityPostsToday: postsSnap.size,
          hiddenPosts: hiddenSnap.size,
          totalUsers: usersSnap.size,
        });
      } catch (err) {
        console.error("Error loading stats:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const statCards = [
    { icon: "🚨", label: "Reportes pendientes", value: stats?.pendingReports, href: "/admin/comunidad", urgent: (stats?.pendingReports ?? 0) > 0 },
    { icon: "📍", label: "Lugares activos", value: stats?.totalPlaces, href: "/admin/lugares" },
    { icon: "📅", label: "Eventos próximos", value: stats?.upcomingEvents, href: "/admin/eventos" },
    { icon: "💬", label: "Posts hoy", value: stats?.communityPostsToday, href: "/admin/comunidad" },
    { icon: "🙈", label: "Posts ocultos", value: stats?.hiddenPosts, href: "/admin/comunidad" },
    { icon: "👥", label: "Usuarios registrados", value: stats?.totalUsers, href: "/admin/usuarios" },
  ];

  const quickLinks = [
    { href: "/admin/blog/nuevo", label: "Nuevo post de blog", icon: "✍️" },
    { href: "/admin/eventos/nuevo", label: "Crear evento", icon: "📅" },
    { href: "/admin/lugares/nuevo", label: "Añadir lugar", icon: "📍" },
    { href: "/admin/notificaciones", label: "Enviar notificación", icon: "🔔" },
    { href: "/admin/banners/nuevo", label: "Crear banner", icon: "📢" },
    { href: "/admin/rutas/nuevo", label: "Nueva ruta temática", icon: "🗺️" },
  ];

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-title">Dashboard</h1>
        <span style={{ fontSize: 13, color: "var(--fg-3)" }}>
          {new Date().toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </span>
      </div>

      {loading ? (
        <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando estadísticas...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {statCards.map((s) => (
            <Link href={s.href} key={s.label} style={{ textDecoration: "none" }}>
              <div className="admin-stat" style={s.urgent ? { borderColor: "#f9d6d4", background: "#fef9f9" } : {}}>
                <div className="admin-stat-icon">{s.icon}</div>
                <div className="admin-stat-value" style={s.urgent ? { color: "#c62828" } : {}}>
                  {s.value ?? "—"}
                </div>
                <div className="admin-stat-label">{s.label}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-section-title" style={{ marginBottom: 16 }}>Acciones rápidas</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="admin-btn admin-btn-ghost"
              style={{ justifyContent: "flex-start" }}
            >
              <span>{l.icon}</span> {l.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
