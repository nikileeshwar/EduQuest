import React, { useMemo, useState } from "react";
import {
  BatteryCharging,
  Cable,
  Lightbulb,
  Power,
  RotateCcw,
  Zap,
} from "lucide-react";
import LabExperimentLayout, {
  LabButton,
  LabMetric,
} from "../../../components/lab/LabExperimentLayout.jsx";

const COMPONENTS = [
  { id: "wire", label: "Wire", icon: Cable },
  { id: "battery", label: "Battery", icon: BatteryCharging },
  { id: "resistor", label: "Resistor", icon: Zap },
  { id: "led", label: "LED", icon: Lightbulb },
  { id: "switch", label: "Switch", icon: Power },
];

let compId = 1;

function generateBoard() {
  const rows = ["A", "B", "C", "D", "E", "F"];
  const holes = [];
  rows.forEach((row, r) => {
    for (let c = 1; c <= 12; c += 1) {
      holes.push({ id: `${row}${c}`, row, col: c, x: 96 + (c - 1) * 54, y: 122 + r * 42 });
    }
  });
  return holes;
}

export default function CircuitStudio() {
  const [selectedTool, setSelectedTool] = useState("wire");
  const [startHole, setStartHole] = useState(null);
  const [components, setComponents] = useState([]);
  const [switchClosed, setSwitchClosed] = useState(true);
  const board = useMemo(generateBoard, []);

  const stats = useMemo(() => {
    const resistors = components.filter((c) => c.type === "resistor").length;
    const batteries = components.filter((c) => c.type === "battery").length;
    const leds = components.filter((c) => c.type === "led").length;
    const switches = components.filter((c) => c.type === "switch").length;
    const voltage = batteries * 9;
    const resistance = Math.max(220, resistors * 220 + (leds ? 100 : 0));
    const circuitClosed = batteries > 0 && (switches === 0 || switchClosed);
    const current = circuitClosed && voltage ? voltage / resistance : 0;
    const ledOn = leds > 0 && current > 0.005;

    return { voltage, resistance, current, power: voltage * current, leds, ledOn, circuitClosed, batteries };
  }, [components, switchClosed]);

  function handleHoleClick(hole) {
    if (!startHole) {
      setStartHole(hole);
      return;
    }
    if (startHole.id === hole.id) {
      setStartHole(null);
      return;
    }
    setComponents((prev) => [
      ...prev,
      { id: compId++, type: selectedTool, start: startHole, end: hole },
    ]);
    setStartHole(null);
  }

  return (
    <LabExperimentLayout
      subject="physics"
      eyebrow="Electricity Lab"
      title="Circuit Studio"
      objective="Build circuits on a breadboard and observe how voltage, resistance, and current relate via Ohm's law."
      actions={
        <LabButton variant="warning" onClick={() => { setComponents([]); setStartHole(null); }}>
          <RotateCcw size={14} /> Reset
        </LabButton>
      }
      simulation={
        <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 10, height: "100%", padding: 8 }}>
          <div className="lab-tool-grid">
            {COMPONENTS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`lab-tool-btn${selectedTool === item.id ? " active" : ""}`}
                  onClick={() => setSelectedTool(item.id)}
                >
                  <Icon size={15} /> {item.label}
                </button>
              );
            })}
            {components.some((c) => c.type === "switch") && (
              <button
                type="button"
                className={`lab-tool-btn${switchClosed ? " active" : ""}`}
                onClick={() => setSwitchClosed((v) => !v)}
              >
                <Power size={15} /> Switch {switchClosed ? "ON" : "OFF"}
              </button>
            )}
          </div>
          <div style={{ background: "#f1f5f9", borderRadius: 10, overflow: "hidden", minHeight: 0 }}>
            <svg viewBox="0 0 760 380" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%" }}>
              <rect x="44" y="48" width="668" height="280" rx="16" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="96" y1="76" x2="690" y2="76" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
              <line x1="96" y1="300" x2="690" y2="300" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
              {components.map((comp) => (
                <line key={`w-${comp.id}`} x1={comp.start.x} y1={comp.start.y} x2={comp.end.x} y2={comp.end.y} stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
              ))}
              {board.map((hole) => (
                <circle
                  key={hole.id}
                  cx={hole.x}
                  cy={hole.y}
                  r={startHole?.id === hole.id ? 9 : 5}
                  fill={startHole?.id === hole.id ? "#14b8a6" : "#334155"}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleHoleClick(hole)}
                />
              ))}
              {components.map((comp) => {
                const cx = (comp.start.x + comp.end.x) / 2;
                const cy = (comp.start.y + comp.end.y) / 2;
                const angle = Math.atan2(comp.end.y - comp.start.y, comp.end.x - comp.start.x) * (180 / Math.PI);
                return (
                  <g key={`c-${comp.id}`} transform={`translate(${cx},${cy}) rotate(${angle})`}>
                    {comp.type === "battery" && (
                      <>
                        <line x1="-30" y1="0" x2="-10" y2="0" stroke="#475569" strokeWidth="3" />
                        <line x1="10" y1="0" x2="30" y2="0" stroke="#475569" strokeWidth="3" />
                        <line x1="-6" y1="-20" x2="-6" y2="20" stroke="#0f172a" strokeWidth="4" />
                        <line x1="6" y1="-12" x2="6" y2="12" stroke="#0f172a" strokeWidth="4" />
                      </>
                    )}
                    {comp.type === "resistor" && (
                      <rect x="-22" y="-10" width="44" height="20" rx="6" fill="#fde68a" stroke="#92400e" strokeWidth="2" />
                    )}
                    {comp.type === "led" && (
                      <>
                        <circle r={stats.ledOn ? 22 : 14} fill={stats.ledOn ? "rgba(34,197,94,0.35)" : "rgba(34,197,94,0.12)"} />
                        <circle r={10} fill={stats.ledOn ? "#22c55e" : "#86efac"} />
                      </>
                    )}
                    {comp.type === "switch" && (
                      <rect x="-16" y="-9" width="32" height="18" rx="9" fill={switchClosed ? "#64748b" : "#94a3b8"} />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      }
      observations={
        <>
          <LabMetric label="Components placed" value={components.length} />
          <LabMetric label="Selected tool" value={selectedTool} />
          <LabMetric label="Circuit state" value={stats.circuitClosed ? "Closed" : "Open"} />
          <LabMetric label="Placement hint" value={startHole ? `Start: ${startHole.id}` : "Tap a hole to begin"} />
        </>
      }
      results={
        <>
          <LabMetric label="Voltage V" value={`${stats.voltage.toFixed(1)} V`} highlight />
          <LabMetric label="Resistance R" value={`${stats.resistance} Ω`} />
          <LabMetric label="Current I" value={`${(stats.current * 1000).toFixed(1)} mA`} />
          <LabMetric label="Power P" value={`${stats.power.toFixed(3)} W`} />
          <LabMetric label="LED status" value={stats.ledOn ? "ON" : stats.leds ? "OFF (low I)" : "—"} />
        </>
      }
      note="I = V/R (Ohm's law). Each battery adds 9 V; resistors add 220 Ω. LEDs need sufficient current (~5 mA) to glow."
    />
  );
}
