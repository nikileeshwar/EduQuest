// src/pages/Leaderboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../state/AuthContext";
import { useLang } from "../../state/LangContext";
import { getLeaderboard, clearLeaderboard } from "../../state/leaderboard";
import { useTheme } from "../../state/ThemeContext"; // ✅ added

/* ---------------------------- Styling ---------------------------- */
const baseContainer = {
  position: "fixed",
  inset: 0,
  padding: "90px 22px 22px",
  color: "#e6eef5",
  fontFamily:
    "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const titleWrap = {
  textAlign: "center",
  marginBottom: 20,
};

const titleStyle = {
  fontSize: 54,
  fontWeight: 900,
  letterSpacing: "-2px",
  color: "#fff",
  textShadow: "0 0 40px rgba(124,58,237,.6)",
};

const layoutRow = {
  display: "flex",
  gap: 20,
  alignItems: "stretch",
  flex: 1,
  overflow: "hidden",
};

const tablePanel = {
  flex: 1,
  background: "rgba(10,15,40,0.35)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  borderRadius: 16,
  padding: 22,
  boxShadow: "0 26px 80px rgba(2,6,23,0.65)",
  border: "1px solid rgba(255,255,255,0.04)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const tableWrap = {
  marginTop: 14,
  flex: 1,
  overflowY: "auto",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.05)",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.015), rgba(255,255,255,0.00))",
  maxHeight: "calc(100vh - 260px)",
  padding: 10,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 1100, // 🔹 even bigger table
  fontSize: 15,
};

const th = {
  textAlign: "left",
  padding: "14px 18px", // 🔹 bigger padding
  fontSize: 14,
  color: "#ffffff",
  fontWeight: 700,
  borderBottom: "1px solid rgba(255,255,255,0.04)",
  userSelect: "none",
  position: "sticky",
  top: 0,
  background: "linear-gradient(180deg, rgba(7,9,12,0.95), rgba(7,9,12,0.95))",
  zIndex: 2,
};

const td = {
  padding: "16px 20px", // 🔹 bigger cells
  fontSize: 16,
  fontWeight: 700,
  color: "#ffffff",
  borderBottom: "1px solid rgba(255,255,255,0.03)",
  verticalAlign: "middle",
};

const smallBtn = {
  background: "linear-gradient(90deg,#6b21a8,#4c1d95)",
  color: "#fff",
  padding: "8px 16px", // 🔹 slightly bigger
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 14,
  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
};

const dangerBtn = {
  ...smallBtn,
  background: "linear-gradient(90deg,#ef4444,#b91c1c)",
};

/* ----------------------------- Utility ----------------------------- */
function fmtDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}
function groupKey(e) {
  return `${(e.name || "Anonymous").trim().toLowerCase()}||${
    (e.school || "").trim()
  }||${(e.place || "").trim()}`;
}

/* ---------------------------- Component ---------------------------- */
export default function LeaderboardPage() {
  const { user } = useAuth?.() || {};
  const { t } = useLang?.() || {};
  const { theme } = useTheme(); // ✅ get current theme

  const LS_KEY = "quiz_leaderboard";
  const [entries, setEntries] = useState(() => getLeaderboard());

  useEffect(() => {
    function onStorage(e) {
      if (e.key === LS_KEY) setEntries(getLeaderboard());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const aggregated = useMemo(() => {
    const map = new Map();
    for (const e of entries || []) {
      const k = groupKey(e);
      const score = Number(e.score || 0);
      const date = e.date ? new Date(e.date) : new Date();
      const ex = map.get(k);
      if (!ex) {
        map.set(k, {
          name: e.name || "Anonymous",
          school: e.school || "",
          place: e.place || "",
          totalScore: score,
          played: 1,
          lastDate: date,
          recentScores: [score],
        });
      } else {
        ex.totalScore += score;
        ex.played += 1;
        ex.recentScores.push(score);
        if (date > ex.lastDate) ex.lastDate = date;
      }
    }

    const arr = Array.from(map.values()).map((a) => ({
      ...a,
      lastDate:
        a.lastDate instanceof Date
          ? a.lastDate.toISOString()
          : String(a.lastDate),
    }));

    arr.sort((a, b) => {
      const sd = Number(b.totalScore) - Number(a.totalScore);
      if (sd !== 0) return sd;
      return new Date(b.lastDate) - new Date(a.lastDate);
    });

    return arr;
  }, [entries]);

  const MAX_DISPLAY = 100;
  const visibleAggregated = aggregated.slice(0, MAX_DISPLAY);
  const particles = Array.from({ length: 30 });

<div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: 20,
    marginBottom: 30,
  }}
>
  {visibleAggregated.slice(0, 3).map((user, idx) => (
    <div
      key={idx}
      style={{
        width: 180,
        padding: 20,
        borderRadius: 20,
        textAlign: "center",
        background: "rgba(255,255,255,.06)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,.08)",
        boxShadow: "0 0 40px rgba(124,58,237,.3)",
      }}
    >
      <div style={{ fontSize: 40 }}>
        {idx === 0 ? "👑" : idx === 1 ? "🥈" : "🥉"}
      </div>

      <h3>{user.name}</h3>

      <div
        style={{
          fontSize: 28,
          fontWeight: 900,
          color: "#a855f7",
        }}
      >
        {user.totalScore}
      </div>
    </div>
  ))}
</div>
  return (
    
    <div
  style={{
    ...baseContainer,
    background: `
      radial-gradient(circle at top center,
      rgba(125,72,255,.25) 0%,
      rgba(0,0,0,0) 40%),
      linear-gradient(
        135deg,
        #020617 0%,
        #030b2b 40%,
        #050d35 100%
      )
    `,
  }}
>
      <div style={titleWrap}>
        <h2 style={titleStyle}>👑 Leaderboard 👑</h2>
      </div>

      <div style={layoutRow}>
        <div style={tablePanel}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 18, color: "#fff" }}>
              Students ranked by their Quiz performance, showcasing scores and
              positions
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                style={smallBtn}
                onClick={() => setEntries(getLeaderboard())}
              >
                Refresh
              </button>
              <button
                style={dangerBtn}
                onClick={() => {
                  if (
                    window.confirm(
                      "Clear all leaderboard entries? This cannot be undone."
                    )
                  ) {
                    clearLeaderboard();
                    setEntries([]);
                  }
                }}
              >
                Clear
              </button>
            </div>
          </div>

          <div style={tableWrap}>
            <table style={tableStyle}>
              <colgroup>
                <col style={{ width: "8%" }} /> {/* S.No */}
                <col style={{ width: "20%" }} /> {/* Name */}
                <col style={{ width: "25%" }} /> {/* School */}
                <col style={{ width: "15%" }} /> {/* Place */}
                <col style={{ width: "10%" }} /> {/* Score */}
                <col style={{ width: "10%" }} /> {/* Plays */}
                <col style={{ width: "22%" }} /> {/* Date & Time */}
              </colgroup>
              <thead>
                <tr>
                  <th style={th}>S.No</th>
                  <th style={th}>Name</th>
                  <th style={th}>School</th>
                  <th style={th}>Place</th>
                  <th style={{ ...th, textAlign: "center" }}>Score</th>
                  <th style={{ ...th, textAlign: "center" }}>Plays</th>
                  <th style={th}>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {visibleAggregated.length === 0 ? (
                  <tr>
                    <td style={td} colSpan={6}>
                      No scores yet
                    </td>
                  </tr>
                ) : (
                  visibleAggregated.map((r, i) => (
                    <tr key={i}>
                      <td style={{ ...td, textAlign: "center" }}>{i + 1}</td>
                      <td style={td}>{r.name}</td>
                      <td style={td}>{r.school || "—"}</td>
                      <td style={td}>{r.place || "—"}</td>
                      <td style={{ ...td, textAlign: "center" }}>
                        <strong>{r.totalScore}</strong>
                      </td>
                      <td style={{ ...td, textAlign: "center" }}>{r.played}</td>
                      <td style={td}>{fmtDate(r.lastDate)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}