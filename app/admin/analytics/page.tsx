"use client";

import { useEffect, useState } from "react";
import { collection, query, getDocs, where, orderBy, Timestamp, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface PlaceStat { nombre: string; count: number; }
interface DayStat { day: string; count: number; }

export default function AnalyticsPage() {
  const [topPlaces, setTopPlaces] = useState<PlaceStat[]>([]);
  const [checkInsByDay, setCheckInsByDay] = useState<DayStat[]>([]);
  const [totalCheckIns, setTotalCheckIns] = useState(0);
  const [activeUsers7d, setActiveUsers7d] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const sevenDaysAgo = Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

      const [checkInsSnap, usersSnap] = await Promise.all([
        getDocs(query(collection(db, "checkIns"), limit(2000))),
        getDocs(query(collection(db, "users"), where("ultimo_acceso", ">=", sevenDaysAgo))),
      ]);

      setTotalCheckIns(checkInsSnap.size);
      setActiveUsers7d(usersSnap.size);

      // Aggregate by place
      const byPlace: Record<string, { nombre: string; count: number }> = {};
      const byDay: Record<string, number> = {};

      checkInsSnap.docs.forEach((d) => {
        const data = d.data();
        const placeId = data.placeId;
        const placeName = data.placeName ?? placeId;
        if (placeId) {
          byPlace[placeId] = { nombre: placeName, count: (byPlace[placeId]?.count ?? 0) + 1 };
        }
        if (data.checkInTime) {
          const day = (data.checkInTime as Timestamp).toDate().toLocaleDateString("es-MX", { month: "short", day: "numeric" });
          byDay[day] = (byDay[day] ?? 0) + 1;
        }
      });

      const sortedPlaces = Object.values(byPlace).sort((a, b) => b.count - a.count).slice(0, 10);
      setTopPlaces(sortedPlaces);

      const sortedDays = Object.entries(byDay).map(([day, count]) => ({ day, count })).slice(-14);
      setCheckInsByDay(sortedDays);

      setLoading(false);
    }
    load();
  }, []);

  const maxCount = Math.max(...topPlaces.map((p) => p.count), 1);
  const maxDay = Math.max(...checkInsByDay.map((d) => d.count), 1);

  return (
    <>
      <div className="admin-topbar">
        <h1 className="admin-title">Analytics</h1>
      </div>

      <div className="admin-stat-grid" style={{ gridTemplateColumns: "repeat(2,1fr)", marginBottom: 24 }}>
        <div className="admin-stat"><div className="admin-stat-icon">✅</div><div className="admin-stat-value">{totalCheckIns}</div><div className="admin-stat-label">Check-ins totales</div></div>
        <div className="admin-stat"><div className="admin-stat-icon">👤</div><div className="admin-stat-value">{activeUsers7d}</div><div className="admin-stat-label">Usuarios activos (7 días)</div></div>
      </div>

      {loading ? <p style={{ color: "var(--fg-3)", fontSize: 14 }}>Cargando datos...</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="admin-card">
            <div className="admin-section-title" style={{ marginBottom: 16 }}>Top 10 lugares por check-ins</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {topPlaces.map((p, i) => (
                <div key={p.nombre}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span style={{ fontWeight: 500 }}>{i + 1}. {p.nombre}</span>
                    <span style={{ color: "var(--fg-3)" }}>{p.count}</span>
                  </div>
                  <div style={{ height: 6, background: "#f0f2f5", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(p.count / maxCount) * 100}%`, background: "var(--navy)", borderRadius: 3 }} />
                  </div>
                </div>
              ))}
              {topPlaces.length === 0 && <p style={{ color: "var(--fg-3)", fontSize: 13 }}>Sin check-ins registrados.</p>}
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-section-title" style={{ marginBottom: 16 }}>Check-ins por día (últimos 14)</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 160 }}>
              {checkInsByDay.map((d) => (
                <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: "100%", background: "var(--navy)", borderRadius: "3px 3px 0 0", height: `${(d.count / maxDay) * 120}px`, minHeight: 4 }} />
                  <span style={{ fontSize: 9, color: "var(--fg-3)", textAlign: "center", writingMode: "vertical-rl", transform: "rotate(180deg)", height: 36 }}>{d.day}</span>
                </div>
              ))}
              {checkInsByDay.length === 0 && <p style={{ color: "var(--fg-3)", fontSize: 13 }}>Sin datos.</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
