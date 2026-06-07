import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../state/AuthContext";

import {
  BookOpen,
  FlaskConical,
  Gamepad2,
} from "lucide-react";

export default function Front() {
  const nav = useNavigate();
  const auth = useAuth?.();

  const fallbackUser = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("sp_user");
      if (raw) return JSON.parse(raw);
    } catch {}

    return {
      name: "Guest User",
      school: "No School",
    };
  }, []);

  const user = auth?.user || fallbackUser;

  const logout =
    auth?.logout ||
    (() => {
      try {
        sessionStorage.removeItem("sp_user");
      } catch {}
    });

  const initials = (name = "") =>
    (name || "")
      .split(" ")
      .map((s) => s[0] || "")
      .slice(0, 2)
      .join("")
      .toUpperCase();

  function handleLogout() {
    try {
      logout();
    } catch {}

    nav("/login", { replace: true });
  }

  const HEADER_HEIGHT = 76;
  const [active, setActive] = useState(null);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        fontFamily:
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#fff",
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -100,
          background:
            "radial-gradient(circle at top,#1a1038 0%,#090f1f 45%,#020617 100%)",
        }}
      />

      {/* Ambient Glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -90,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 30% 60%, rgba(139,92,246,.08), transparent 20%), radial-gradient(circle at 70% 60%, rgba(59,130,246,.08), transparent 20%)",
        }}
      />
      <header
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 28px",
    background: "rgba(255,255,255,.82)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 30px rgba(0,0,0,.08)",
    zIndex: 2000,
  }}
>
  {/* User Section */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
    }}
  >
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg,#8b5cf6,#ec4899)",
        color: "#fff",
        fontWeight: 800,
      }}
    >
      {initials(user.name)}
    </div>

    <div>
      <div
        style={{
          fontWeight: 800,
          fontSize: 17,
          color: "#111827",
        }}
      >
        {user.name}
      </div>

      <div
        style={{
          color: "#4b5563",
          fontSize: 13,
        }}
      >
        {user.school}
      </div>
    </div>
  </div>

  {/* Center Branding */}
  <div
    style={{
      textAlign: "center",
      lineHeight: 1.1,
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
    }}
  >
    <div
      style={{
        fontSize: 30,
        fontWeight: 900,
        letterSpacing: "7px",
        color: "#111827",
      }}
    >
      EDUQUEST
    </div>

    <div
      style={{
        fontSize: 10,
        letterSpacing: "4px",
        color: "#6b7280",
        marginTop: 3,
      }}
    >
      A QUIZ ADVENTURE
    </div>
  </div>

  {/* Right Section */}
  <div
    style={{
      display: "flex",
      gap: 14,
      alignItems: "center",
    }}
  >
    <button
      onClick={() => nav("/leaderboard")}
      style={{
        border: "none",
        background: "transparent",
        fontWeight: 800,
        cursor: "pointer",
        color: "#111827",
        fontSize: 14,
      }}
    >
      Leaderboard
    </button>

    <button
      onClick={handleLogout}
      style={{
        border: "none",
        cursor: "pointer",
        color: "#fff",
        fontWeight: 800,
        padding: "10px 18px",
        borderRadius: 12,
        background:
          "linear-gradient(135deg,#fb7185,#f97316)",
      }}
    >
      Logout
    </button>
  </div>
</header>

{/* ===== HERO SECTION ===== */}

<div
  style={{
    position: "absolute",
    top: "20%",
    left: "50%",
    transform: "translateX(-50%)",
    textAlign: "center",
    width: "100%",
  }}
>
  <div
    style={{
      color: "#c4b5fd",
      fontWeight: 700,
      fontSize: 20,
      marginBottom: 14,
      marginTop: -30,
      letterSpacing: "0.5px",
    }}
  >
    Welcome, {user.name}👋
  </div>

  <h1
    style={{
      margin: 0,
      color: "#fff",
      fontSize: "5rem",
      fontWeight: 900,
      letterSpacing: "0px",
      marginTop: -25,
      textShadow: "0 10px 30px rgba(0,0,0,.35)",
    }}
  >
    Start Your Adventure
  </h1>

  <div
    style={{
      marginTop: 5,
      color: "#cbd5e1",
      fontSize: 18,
      fontWeight: 500,
      letterSpacing: "0.5px",
    }}
  >
    Explore • Learn • Discover
  </div>

  {/* Decorative Line */}
  <div
    style={{
      width: 220,
      height: 2,
      margin: "30px auto 0",
      background:
        "linear-gradient(to right, transparent, rgba(255,255,255,.45), transparent)",
    }}
  />
</div>

{/* ===== OPTIONS SECTION ===== */}

<div
  style={{
    position: "absolute",
    top: "66%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 97,
  }}
>
  {/* ================= QUIZ ================= */}

  <motion.div
    onMouseEnter={() => setActive("quiz")}
    onMouseLeave={() => setActive(null)}
    whileHover={{ scale: 1.08, y: -10 }}
    whileTap={{ scale: 0.97 }}
    onClick={() => nav("/grades")}
    style={{
      cursor: "pointer",
      textAlign: "center",
      opacity: active === "lab" || active === "games" ? 0.45 : 1,
      transition: "all .25s ease",
    }}
  >
    <div
      style={{
        width: 220,
        height: 220,
        borderRadius: "50%",
        background:
          "linear-gradient(135deg,#8b5cf6,#6d28d9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(255,255,255,.12)",
        boxShadow:
          "0 0 90px rgba(139,92,246,.45)",
      }}
    >
      <BookOpen size={110} color="#fff" />
    </div>

    <div
      style={{
        width: 140,
        height: 20,
        margin: "0 auto",
        borderRadius: "50%",
        background: "rgba(139,92,246,.35)",
        filter: "blur(25px)",
      }}
    />

    <h2
      style={{
        color: "#fff",
        marginTop: 20,
        marginBottom: 10,
        fontSize: "2.8rem",
        fontWeight: 800,
      }}
    >
      Quiz
    </h2>

    <div
      style={{
        display: "inline-block",
        padding: "8px 18px",
        borderRadius: 999,
        background: "rgba(139,92,246,.15)",
        color: "#d8b4fe",
        fontWeight: 700,
        fontSize: 13,
      }}
    >
      Knowledge
    </div>
  </motion.div>

  {/* Divider 1 */}

  <div
    style={{
      width: 2,
      height: 280,
      background:
        "linear-gradient(to bottom,transparent,#8b5cf6,transparent)",
      opacity: 0.4,
    }}
  />

  {/* ================= LAB ================= */}

  <motion.div
    onMouseEnter={() => setActive("lab")}
    onMouseLeave={() => setActive(null)}
    whileHover={{ scale: 1.08, y: -10 }}
    whileTap={{ scale: 0.97 }}
    onClick={() => nav("/games/lab")}
    style={{
      cursor: "pointer",
      textAlign: "center",
      opacity: active === "quiz" || active === "games" ? 0.45 : 1,
      transition: "all .25s ease",
    }}
  >
    <div
      style={{
        width: 220,
        height: 220,
        borderRadius: "50%",
        background:
          "linear-gradient(135deg,#06b6d4,#0891b2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(255,255,255,.12)",
        boxShadow:
          "0 0 90px rgba(6,182,212,.45)",
      }}
    >
      <FlaskConical size={110} color="#fff" />
    </div>

    <div
      style={{
        width: 140,
        height: 20,
        margin: "0 auto",
        borderRadius: "50%",
        background: "rgba(6,182,212,.35)",
        filter: "blur(25px)",
      }}
    />

    <h2
      style={{
        color: "#fff",
        marginTop: 20,
        marginBottom: 10,
        fontSize: "2.8rem",
        fontWeight: 800,
      }}
    >
      Lab
    </h2>

    <div
      style={{
        display: "inline-block",
        padding: "8px 18px",
        borderRadius: 999,
        background: "rgba(6,182,212,.15)",
        color: "#a5f3fc",
        fontWeight: 700,
        fontSize: 13,
      }}
    >
      Experiment
    </div>
  </motion.div>

  {/* Divider 2 */}

  <div
    style={{
      width: 2,
      height: 280,
      background:
        "linear-gradient(to bottom,transparent,#3b82f6,transparent)",
      opacity: 0.4,
    }}
  />

  {/* ================= GAMES ================= */}

  <motion.div
    onMouseEnter={() => setActive("games")}
    onMouseLeave={() => setActive(null)}
    whileHover={{ scale: 1.08, y: -10 }}
    whileTap={{ scale: 0.97 }}
    onClick={() => nav("/games")}
    style={{
      cursor: "pointer",
      textAlign: "center",
      opacity: active === "quiz" || active === "lab" ? 0.45 : 1,
      transition: "all .25s ease",
    }}
  >
    <div
      style={{
        width: 220,
        height: 220,
        borderRadius: "50%",
        background:
          "linear-gradient(135deg,#3b82f6,#2563eb)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(255,255,255,.12)",
        boxShadow:
          "0 0 90px rgba(59,130,246,.45)",
      }}
    >
      <Gamepad2 size={110} color="#fff" />
    </div>

    <div
      style={{
        width: 140,
        height: 20,
        margin: "0 auto",
        borderRadius: "50%",
        background: "rgba(59,130,246,.35)",
        filter: "blur(25px)",
      }}
    />

    <h2
      style={{
        color: "#fff",
        marginTop: 20,
        marginBottom: 10,
        fontSize: "2.8rem",
        fontWeight: 800,
      }}
    >
      Games
    </h2>

    <div
      style={{
        display: "inline-block",
        padding: "8px 18px",
        borderRadius: 999,
        background: "rgba(59,130,246,.15)",
        color: "#bfdbfe",
        fontWeight: 700,
        fontSize: 13,
      }}
    >
      Play
    </div>
  </motion.div>
</div>

{/* ===== EXTRA AMBIENT GLOW ===== */}

<div
  style={{
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background: `
      radial-gradient(
        circle at 20% 60%,
        rgba(139,92,246,.08),
        transparent 22%
      ),
      radial-gradient(
        circle at 50% 60%,
        rgba(6,182,212,.08),
        transparent 22%
      ),
      radial-gradient(
        circle at 80% 60%,
        rgba(59,130,246,.08),
        transparent 22%
      )
    `,
  }}
/>

{/* Bottom Fade */}
<div
  style={{
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 220,
    pointerEvents: "none",
    background:
      "linear-gradient(to top, rgba(2,6,23,.65), transparent)",
  }}
/>

{/* Top Fade */}
<div
  style={{
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 120,
    pointerEvents: "none",
    background:
      "linear-gradient(to bottom, rgba(2,6,23,.15), transparent)",
  }}
/>

</motion.main>
  );
}