// src/components/TopBar.jsx

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLang } from "../state/LangContext";

export default function TopBar() {
  const nav = useNavigate();
  const loc = useLocation();
  const { lang, toggle, t } = useLang();

  // Hide TopBar on landing page
  if (loc.pathname === "/") return null;

  const showBack = true;

  function handleBack() {
    const path = loc.pathname;

    // If user opened page directly (no history)
    if (window.history.length <= 2) {
      if (path.startsWith("/games/lab")) {
        nav("/games");
        return;
      }

      if (path.startsWith("/games")) {
        nav("/");
        return;
      }

      nav("/");
      return;
    }

    // Normal navigation
    nav(-1);
  }

  return (
    <header
      role="banner"
      aria-label="Top navigation"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 72,
        zIndex: 2000,

        background: "rgba(255,255,255,.82)",

        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",

        borderBottom:
          "1px solid rgba(255,255,255,.06)",

        boxShadow:
          "0 8px 32px rgba(0,0,0,.15)",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        padding: "0 28px",
      }}
    >
      {/* Left Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        {showBack && (
          <button
            onClick={handleBack}
            style={{
              background:
                "linear-gradient(90deg,#8b5cf6,#a78bfa)",

              border: "none",

              padding: "10px 18px",

              borderRadius: 12,

              fontWeight: 800,

              cursor: "pointer",

              color: "#191919",

              fontSize: "0.95rem",

              boxShadow:
                "0 6px 14px rgba(0,0,0,0.15)",
            }}
          >
            {t.back}
          </button>
        )}

        <button
          onClick={() => nav("/")}
          style={{
            background: "transparent",

            border: "none",

            fontWeight: 800,

            cursor: "pointer",

            fontSize: 15,

            color: "#191919",

            letterSpacing: "0.5px",
          }}
        >
          {t.home}
        </button>
      </div>

      {/* Right Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        
      </div>
    </header>
  );
}