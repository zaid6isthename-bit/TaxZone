"use client";

import * as React from "react";
import { Bell, Settings, Upload, ChevronRight, Calendar, Phone, MessageCircle } from "lucide-react";

// ── Design tokens as JS constants (guaranteed color rendering) ─────────────
const C = {
  primary:      "#1A4FBA",
  primaryLight: "#EBF1FF",
  indigo:       "#5B4CF5",
  success:      "#16A34A",
  successLight: "#DCFCE7",
  warning:      "#D97706",
  warningLight: "#FEF3C7",
  danger:       "#DC2626",
  dangerLight:  "#FEE2E2",
  info:         "#0284C7",
  infoLight:    "#E0F2FE",
  gray50:       "#F9FAFB",
  gray100:      "#F3F4F6",
  gray200:      "#E5E7EB",
  gray400:      "#9CA3AF",
  gray500:      "#6B7280",
  gray700:      "#374151",
  gray900:      "#111827",
  white:        "#FFFFFF",
};

// ── Status badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    "Under Review": { color: C.primary,  bg: C.primaryLight },
    "In Progress":  { color: C.info,     bg: C.infoLight    },
    "Completed":    { color: C.success,  bg: C.successLight },
    "Not Started":  { color: C.gray500,  bg: C.gray100      },
    "Overdue":      { color: C.danger,   bg: C.dangerLight  },
  };
  const s = map[status] ?? { color: C.gray500, bg: C.gray100 };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 10px", borderRadius: 4,
      fontSize: 11, fontWeight: 600,
      color: s.color, background: s.bg,
    }}>
      {status}
    </span>
  );
}

// ── Card ────────────────────────────────────────────────────────────────────
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: C.white,
      borderRadius: 12,
      border: `1px solid ${C.gray200}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function ClientDashboard() {
  const filings = [
    { type: "GSTR-1", period: "October 2024",  status: "Under Review", progress: 60  },
    { type: "ITR",    period: "FY 2024-25",    status: "In Progress",  progress: 40  },
    { type: "TDS",    period: "Q2 FY 2024-25", status: "Completed",    progress: 100 },
  ];

  const deadlines = [
    { date: "31", month: "Oct", title: "GSTR-1 October",   status: "Under Review" },
    { date: "20", month: "Nov", title: "GSTR-3B November",  status: "Not Started"  },
    { date: "31", month: "Dec", title: "GSTR-9 Annual",     status: "Not Started"  },
  ];

  const root: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    paddingBottom: 80,
    background: C.gray50,
    fontFamily: "'DM Sans', sans-serif",
    color: C.gray700,
  };

  return (
    <div style={root}>

      {/* ── AppBar ────────────────────────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px",
        background: C.white,
        borderBottom: `1px solid ${C.gray200}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Avatar */}
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.primary} 0%, ${C.indigo} 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 2px 8px ${C.primary}55`,
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.white, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>RK</span>
          </div>
          <span style={{ fontSize: 16, fontWeight: 600, color: C.gray900, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Hi, Rajesh 👋</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button style={{ position: "relative", padding: 6, background: "none", cursor: "pointer", color: C.gray700, border: "none" }}>
            <Bell size={22} />
            <span style={{
              position: "absolute", top: 7, right: 7,
              width: 8, height: 8, background: C.danger,
              borderRadius: "50%", border: `2px solid ${C.white}`,
            }} />
          </button>
          <button style={{ padding: 6, background: "none", cursor: "pointer", color: C.gray700, border: "none" }}>
            <Settings size={22} />
          </button>
        </div>
      </header>

      {/* ── Action Banner ──────────────────────────────────────────────────── */}
      <div style={{ padding: "16px 16px 8px" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px", borderRadius: 14,
          background: C.primaryLight,
          border: `1.5px solid ${C.primary}35`,
          cursor: "pointer",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: C.white,
              boxShadow: `0 1px 4px ${C.primary}25`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.primary,
            }}>
              <Upload size={19} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.gray900, margin: 0, lineHeight: 1.3 }}>Documents Requested</p>
              <p style={{ fontSize: 12, color: C.gray500, margin: 0 }}>3 documents need your attention</p>
            </div>
          </div>
          <ChevronRight size={20} color={C.primary} />
        </div>
      </div>

      {/* ── Your Filings ──────────────────────────────────────────────────── */}
      <section style={{ padding: "8px 0 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 16px 12px" }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.gray900, margin: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Filings</h2>
          <button style={{ fontSize: 13, fontWeight: 600, color: C.primary, background: "none", border: "none", cursor: "pointer" }}>See All</button>
        </div>

        {/* Horizontal scroll */}
        <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 16px 16px" }}>
          {filings.map((f, i) => (
            <Card key={i} style={{ minWidth: 190, flexShrink: 0, padding: 16, cursor: "pointer" }}>
              {/* Type chip */}
              <span style={{
                display: "inline-block",
                padding: "2px 8px", borderRadius: 4,
                fontSize: 10, fontWeight: 800, letterSpacing: "0.04em",
                color: C.primary, background: C.primaryLight,
                marginBottom: 8,
              }}>
                {f.type}
              </span>

              <p style={{ fontSize: 15, fontWeight: 700, color: C.gray900, margin: "0 0 8px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {f.period}
              </p>

              <StatusBadge status={f.status} />

              {/* Progress bar */}
              <div style={{ marginTop: 14, marginBottom: 6, height: 5, background: C.gray200, borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${f.progress}%`,
                  background: f.progress === 100 ? C.success : C.primary,
                  borderRadius: 99,
                }} />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.gray400 }}>
                <Calendar size={11} />
                <span>{f.progress === 100 ? "Filed successfully" : `${f.progress}% complete`}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Upcoming Deadlines ────────────────────────────────────────────── */}
      <section style={{ padding: "0 16px 20px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: C.gray900, margin: "0 0 12px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Upcoming Deadlines
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {deadlines.map((d, i) => (
            <Card key={i} style={{
              padding: "14px 16px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Date badge */}
                <div style={{
                  width: 48, height: 52, borderRadius: 10,
                  background: C.primaryLight,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: C.primary, lineHeight: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{d.date}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: C.primary, marginTop: 2 }}>{d.month}</span>
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: C.gray900, margin: "0 0 6px" }}>{d.title}</p>
                  <StatusBadge status={d.status} />
                </div>
              </div>
              <ChevronRight size={18} color={C.gray400} />
            </Card>
          ))}
        </div>
      </section>

      {/* ── Your CA Team ──────────────────────────────────────────────────── */}
      <section style={{ padding: "0 16px 20px" }}>
        <Card style={{ padding: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.gray400, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 14px" }}>
            Your CA Team
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* CA Avatar */}
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.success} 0%, ${C.info} 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 2px 8px ${C.success}44`,
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.white, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>PS</span>
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: C.gray900, margin: 0 }}>Priya Sharma</p>
                <p style={{ fontSize: 12, color: C.gray500, margin: 0 }}>Tax Associate</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{
                width: 40, height: 40, borderRadius: "50%",
                border: `1.5px solid ${C.primary}`,
                background: C.primaryLight, color: C.primary,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}>
                <Phone size={17} />
              </button>
              <button style={{
                width: 40, height: 40, borderRadius: "50%",
                border: `1.5px solid ${C.success}`,
                background: C.successLight, color: C.success,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}>
                <MessageCircle size={17} />
              </button>
            </div>
          </div>
        </Card>
      </section>

    </div>
  );
}
