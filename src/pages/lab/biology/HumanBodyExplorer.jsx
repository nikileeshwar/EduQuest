import React, { useState } from "react";
import LabExperimentLayout, { LabMetric } from "../../../components/lab/LabExperimentLayout.jsx";

const SYSTEMS = [
  { id: "circulatory", name: "Circulatory", icon: "❤️", organ: "Heart", function: "Pumps blood to deliver oxygen and nutrients throughout the body." },
  { id: "respiratory", name: "Respiratory", icon: "🫁", organ: "Lungs", function: "Gas exchange — brings in O₂ and removes CO₂." },
  { id: "digestive", name: "Digestive", icon: "🍽️", organ: "Stomach & Intestines", function: "Breaks down food and absorbs nutrients." },
  { id: "nervous", name: "Nervous", icon: "🧠", organ: "Brain & Nerves", function: "Coordinates responses via electrical signals." },
  { id: "skeletal", name: "Skeletal", icon: "🦴", organ: "Bones", function: "Supports the body, protects organs, enables movement." },
  { id: "muscular", name: "Muscular", icon: "💪", organ: "Muscles", function: "Contracts to produce movement and maintain posture." },
];

export default function HumanBodyExplorer() {
  const [active, setActive] = useState(null);
  const system = SYSTEMS.find((s) => s.id === active);

  return (
    <LabExperimentLayout
      subject="biology"
      eyebrow="Anatomy Lab"
      title="Human Body Explorer"
      objective="Explore major body systems and understand how organs work together to maintain life."
      simulation={
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, height: "100%", padding: 12 }}>
          <svg viewBox="0 0 120 200" preserveAspectRatio="xMidYMid meet" style={{ height: "100%", margin: "auto" }}>
            <ellipse cx="60" cy="28" rx="22" ry="26" fill="rgba(139,92,246,0.2)" stroke="#8b5cf6" strokeWidth="1" />
            <rect x="48" y="52" width="24" height="50" rx="8" fill="rgba(239,68,68,0.15)" stroke="#ef4444" strokeWidth="1" />
            <ellipse cx="60" cy="78" rx="18" ry="22" fill={active === "circulatory" ? "rgba(239,68,68,0.5)" : "rgba(239,68,68,0.2)"} stroke="#ef4444" strokeWidth="1.5" onClick={() => setActive("circulatory")} style={{ cursor: "pointer" }} />
            <ellipse cx="42" cy="72" rx="12" ry="18" fill={active === "respiratory" ? "rgba(59,130,246,0.5)" : "rgba(59,130,246,0.2)"} stroke="#3b82f6" strokeWidth="1.5" onClick={() => setActive("respiratory")} style={{ cursor: "pointer" }} />
            <ellipse cx="78" cy="72" rx="12" ry="18" fill={active === "respiratory" ? "rgba(59,130,246,0.5)" : "rgba(59,130,246,0.2)"} stroke="#3b82f6" strokeWidth="1.5" onClick={() => setActive("respiratory")} style={{ cursor: "pointer" }} />
            <ellipse cx="60" cy="115" rx="20" ry="16" fill={active === "digestive" ? "rgba(249,115,22,0.5)" : "rgba(249,115,22,0.2)"} stroke="#f97316" strokeWidth="1.5" onClick={() => setActive("digestive")} style={{ cursor: "pointer" }} />
            <line x1="60" y1="102" x2="60" y2="170" stroke="rgba(255,255,255,0.15)" strokeWidth="8" strokeLinecap="round" onClick={() => setActive("skeletal")} style={{ cursor: "pointer" }} />
            <rect x="38" y="130" width="10" height="40" rx="4" fill={active === "muscular" ? "rgba(34,197,94,0.4)" : "rgba(34,197,94,0.15)"} stroke="#22c55e" strokeWidth="1" onClick={() => setActive("muscular")} style={{ cursor: "pointer" }} />
            <rect x="72" y="130" width="10" height="40" rx="4" fill={active === "muscular" ? "rgba(34,197,94,0.4)" : "rgba(34,197,94,0.15)"} stroke="#22c55e" strokeWidth="1" onClick={() => setActive("muscular")} style={{ cursor: "pointer" }} />
            <circle cx="60" cy="24" r="14" fill={active === "nervous" ? "rgba(168,85,247,0.5)" : "rgba(168,85,247,0.2)"} stroke="#a855f7" strokeWidth="1.5" onClick={() => setActive("nervous")} style={{ cursor: "pointer" }} />
          </svg>
          <div className="lab-tool-grid" style={{ alignContent: "start" }}>
            {SYSTEMS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`lab-tool-btn${active === s.id ? " active" : ""}`}
                onClick={() => setActive(s.id)}
              >
                <span>{s.icon}</span> {s.name}
              </button>
            ))}
          </div>
        </div>
      }
      observations={
        system ? (
          <>
            <LabMetric label="System" value={`${system.icon} ${system.name}`} highlight />
            <LabMetric label="Key organ(s)" value={system.organ} />
            <div style={{ fontSize: 12, lineHeight: 1.5, color: "rgba(238,247,255,0.75)" }}>{system.function}</div>
          </>
        ) : (
          <LabMetric label="Selection" value="Click body or list a system" />
        )
      }
      results={
        <>
          <LabMetric label="Systems covered" value={SYSTEMS.length} />
          <LabMetric label="Explored" value={active ? system.name : "None"} highlight />
        </>
      }
      note="Body systems are interdependent — e.g. the circulatory and respiratory systems work together to supply cells with oxygen."
    />
  );
}
