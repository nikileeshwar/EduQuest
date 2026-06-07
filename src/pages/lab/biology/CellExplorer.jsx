import React, { useState } from "react";
import LabExperimentLayout, { LabMetric } from "../../../components/lab/LabExperimentLayout.jsx";

const ORGANELLES = [
  { id: "nucleus", name: "Nucleus", x: 50, y: 48, r: 14, color: "#8b5cf6", desc: "Control center — stores DNA and coordinates cell activities." },
  { id: "mitochondria", name: "Mitochondria", x: 68, y: 62, r: 8, color: "#f97316", desc: "Powerhouse — produces ATP through cellular respiration." },
  { id: "ribosome", name: "Ribosomes", x: 38, y: 58, r: 5, color: "#64748b", desc: "Protein factories — translate mRNA into polypeptides." },
  { id: "er", name: "Endoplasmic Reticulum", x: 58, y: 38, r: 10, color: "#06b6d4", desc: "Network for protein/lipid synthesis and transport." },
  { id: "golgi", name: "Golgi Apparatus", x: 72, y: 42, r: 9, color: "#eab308", desc: "Packages and modifies proteins for secretion or use." },
  { id: "lysosome", name: "Lysosome", x: 42, y: 68, r: 6, color: "#ec4899", desc: "Digestive enzymes break down waste and debris." },
  { id: "membrane", name: "Cell Membrane", x: 50, y: 50, r: 44, color: "#22c55e", desc: "Phospholipid bilayer regulating entry and exit of substances.", ring: true },
];

export default function CellExplorer() {
  const [selected, setSelected] = useState(null);
  const organelle = ORGANELLES.find((o) => o.id === selected);

  return (
    <LabExperimentLayout
      subject="biology"
      eyebrow="Cell Biology Lab"
      title="Cell Explorer"
      objective="Click organelles in an animal cell model to learn their structure and function."
      simulation={
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", background: "#06101d" }}>
          <ellipse cx="50" cy="50" rx="46" ry="40" fill="rgba(34,197,94,0.08)" stroke="#22c55e" strokeWidth="0.8" strokeDasharray="2 2" />
          {ORGANELLES.filter((o) => !o.ring).map((o) => (
            <g key={o.id} onClick={() => setSelected(o.id)} style={{ cursor: "pointer" }}>
              <circle
                cx={o.x}
                cy={o.y}
                r={o.r + (selected === o.id ? 2 : 0)}
                fill={o.color}
                opacity={selected === o.id ? 1 : 0.75}
                stroke={selected === o.id ? "#fff" : "transparent"}
                strokeWidth="1"
              />
              <text x={o.x} y={o.y + 0.5} textAnchor="middle" fontSize="3" fill="#fff" fontWeight="700">
                {o.name.split(" ")[0]}
              </text>
            </g>
          ))}
          <text x="50" y="8" textAnchor="middle" fontSize="4" fill="rgba(255,255,255,0.5)" fontWeight="700">
            Animal Cell — click an organelle
          </text>
        </svg>
      }
      observations={
        organelle ? (
          <>
            <LabMetric label="Organelle" value={organelle.name} highlight />
            <div style={{ fontSize: 12, lineHeight: 1.5, color: "rgba(238,247,255,0.75)", padding: "4px 0" }}>
              {organelle.desc}
            </div>
          </>
        ) : (
          <LabMetric label="Selection" value="Tap an organelle" />
        )
      }
      results={
        <>
          <LabMetric label="Organelles shown" value={ORGANELLES.length - 1} />
          <LabMetric label="Cell type" value="Eukaryotic (animal)" />
          <LabMetric label="Explored" value={selected ? "1 selected" : "None yet"} highlight />
        </>
      }
      note="Eukaryotic cells contain membrane-bound organelles. Each structure has a specialized role in maintaining cell function."
    />
  );
}
