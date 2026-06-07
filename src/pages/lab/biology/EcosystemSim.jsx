import React, { useState, useMemo } from "react";
import { RotateCcw } from "lucide-react";
import LabExperimentLayout, { LabButton, LabMetric } from "../../../components/lab/LabExperimentLayout.jsx";

const SPECIES_DB = {
  forest: [
    { id: "tree", name: "Tree", role: "producer", icon: "🌳", desc: "Photosynthesis — base energy source." },
    { id: "grass", name: "Grass", role: "producer", icon: "🌾", desc: "Ground vegetation." },
    { id: "rabbit", name: "Rabbit", role: "primary", icon: "🐇", desc: "Herbivore — eats plants." },
    { id: "fox", name: "Fox", role: "secondary", icon: "🦊", desc: "Predator — eats herbivores." },
    { id: "wolf", name: "Wolf", role: "tertiary", icon: "🐺", desc: "Apex predator." },
  ],
  ocean: [
    { id: "algae", name: "Algae", role: "producer", icon: "🪸", desc: "Photosynthetic base." },
    { id: "krill", name: "Krill", role: "primary", icon: "🦐", desc: "Eats plankton/algae." },
    { id: "fish", name: "Fish", role: "secondary", icon: "🐟", desc: "Eats krill." },
    { id: "shark", name: "Shark", role: "tertiary", icon: "🦈", desc: "Apex predator." },
  ],
};

const ROLES = ["producer", "primary", "secondary", "tertiary"];

function FoodChainChip({ species, selected, onClick }) {
  return (
    <button
      type="button"
      className={`lab-chip${selected ? " selected" : ""}`}
      onClick={() => onClick(species)}
      style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
    >
      <span>{species.icon}</span> {species.name}
    </button>
  );
}

export default function EcosystemSim() {
  const [biome, setBiome] = useState("forest");
  const [chain, setChain] = useState([null, null, null, null]);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(null);

  const species = SPECIES_DB[biome];

  const validation = useMemo(() => {
    return chain.map((slot, i) => {
      if (!slot) return "empty";
      return slot.role === ROLES[i] ? "correct" : "wrong";
    });
  }, [chain]);

  const allFilled = chain.every(Boolean);
  const allCorrect = validation.every((v) => v === "correct");

  function placeInSlot(index) {
    if (!picked) return;
    setChain((c) => {
      const next = [...c];
      next[index] = picked;
      return next;
    });
    setPicked(null);
    setScore(null);
  }

  function checkChain() {
    if (!allFilled) return;
    setScore(allCorrect ? "Valid food chain!" : "Some links are incorrect — check trophic levels.");
  }

  function reset() {
    setChain([null, null, null, null]);
    setPicked(null);
    setScore(null);
  }

  return (
    <LabExperimentLayout
      subject="biology"
      eyebrow="Ecology Lab"
      title="Food Chain Simulator"
      objective="Build a valid 4-level food chain by placing species in the correct trophic order."
      actions={
        <LabButton variant="warning" onClick={reset}>
          <RotateCcw size={14} /> Reset
        </LabButton>
      }
      simulation={
        <div style={{ padding: 12, height: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="lab-chip-row">
            {Object.keys(SPECIES_DB).map((b) => (
              <button
                key={b}
                type="button"
                className={`lab-chip${biome === b ? " selected" : ""}`}
                onClick={() => { setBiome(b); reset(); }}
              >
                {b.charAt(0).toUpperCase() + b.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, flex: 1, minHeight: 0 }}>
            {ROLES.map((role, i) => {
              const slot = chain[i];
              const status = validation[i];
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => placeInSlot(i)}
                  style={{
                    border: `2px solid ${status === "correct" ? "#22c55e" : status === "wrong" ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.04)",
                    padding: 10,
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", opacity: 0.6 }}>{role}</span>
                  {slot ? (
                    <>
                      <span style={{ fontSize: 28 }}>{slot.icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{slot.name}</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 11, opacity: 0.5 }}>Tap to place</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="lab-chip-row">
            {species.map((s) => (
              <FoodChainChip key={s.id} species={s} selected={picked?.id === s.id} onClick={setPicked} />
            ))}
          </div>

          <LabButton variant="primary" onClick={checkChain} disabled={!allFilled}>
            Validate Chain
          </LabButton>
        </div>
      }
      observations={
        <>
          <LabMetric label="Biome" value={biome.charAt(0).toUpperCase() + biome.slice(1)} />
          <LabMetric label="Selected species" value={picked ? picked.name : "None"} />
          <LabMetric label="Slots filled" value={`${chain.filter(Boolean).length}/4`} />
        </>
      }
      results={
        <>
          <LabMetric label="Validation" value={score || (allFilled ? "Ready to check" : "Incomplete")} highlight />
          {picked && (
            <div style={{ fontSize: 11, color: "rgba(238,247,255,0.65)", lineHeight: 1.4 }}>{picked.desc}</div>
          )}
        </>
      }
      note="Energy flows producer → primary consumer → secondary → tertiary. Each level transfers ~10% of energy to the next."
    />
  );
}
