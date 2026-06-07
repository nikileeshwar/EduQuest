import React, { useMemo, useState } from "react";
import {
  BatteryCharging,
  Cable,
  CircleDot,
  Lightbulb,
  Power,
  RotateCcw,
  Zap,
} from "lucide-react";
import "./PhysicsLab.css";

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
      holes.push({
        id: `${row}${c}`,
        row,
        col: c,
        x: 96 + (c - 1) * 54,
        y: 122 + r * 42,
      });
    }
  });

  return holes;
}

export default function CircuitLab() {
  const [selectedTool, setSelectedTool] = useState("wire");
  const [startHole, setStartHole] = useState(null);
  const [components, setComponents] = useState([]);
  const board = useMemo(generateBoard, []);

  const stats = useMemo(() => {
    const resistors = components.filter((item) => item.type === "resistor").length;
    const batteries = components.filter((item) => item.type === "battery").length;
    const leds = components.filter((item) => item.type === "led").length;
    const voltage = batteries ? batteries * 9 : 0;
    const resistance = Math.max(220, resistors * 220);
    const current = voltage ? voltage / resistance : 0;

    return {
      voltage,
      resistance,
      current,
      power: voltage * current,
      ready: batteries > 0 && components.length > 1,
      leds,
    };
  }, [components]);

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
      {
        id: compId++,
        type: selectedTool,
        start: startHole,
        end: hole,
      },
    ]);
    setStartHole(null);
  }

  return (
    <div className="physics-sim-page">
      <div className="physics-sim-shell">
        <header className="physics-sim-header">
          <div>
            <p className="physics-eyebrow">Electricity Lab</p>
            <h1>Circuit Studio</h1>
            <p>
              Build a circuit on the breadboard by choosing a component, selecting
              a starting hole, then selecting an ending hole.
            </p>
          </div>

          <div className="physics-action-row">
            <button
              className="physics-button warning"
              onClick={() => {
                setComponents([]);
                setStartHole(null);
              }}
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </header>

        <div className="physics-layout three-column">
          <aside className="physics-panel physics-panel-pad">
            <div className="physics-panel-title">
              <h2>Components</h2>
              <span>{selectedTool}</span>
            </div>

            <div className="physics-tool-list">
              {COMPONENTS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className={`physics-tool-button ${
                      selectedTool === item.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedTool(item.id)}
                  >
                    <span className="physics-tool-icon">
                      <Icon size={17} />
                    </span>
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="physics-note">
              {startHole
                ? `Selected ${startHole.id}. Choose another hole to place the component.`
                : "Tap any board hole to start placing the selected component."}
            </div>
          </aside>

          <main className="physics-panel physics-panel-pad physics-board">
            <div className="physics-board-header">
              <div>
                <h2>Breadboard Workspace</h2>
                <span>{components.length} placed components</span>
              </div>
            </div>

            <div className="breadboard-stage">
              <svg className="breadboard" viewBox="0 0 760 410" role="img">
                <rect x="44" y="58" width="668" height="300" rx="18" className="board-body" />
                <line x1="96" y1="86" x2="690" y2="86" className="board-rail" />
                <line x1="96" y1="330" x2="690" y2="330" className="board-rail negative" />

                {Array.from({ length: 12 }, (_, i) => (
                  <text key={i} x={96 + i * 54} y={34} className="board-label">
                    {i + 1}
                  </text>
                ))}

                {["A", "B", "C", "D", "E", "F"].map((row, index) => (
                  <text key={row} x={24} y={126 + index * 42} className="board-label">
                    {row}
                  </text>
                ))}

                {components.map((comp) => (
                  <line
                    key={`wire-${comp.id}`}
                    x1={comp.start.x}
                    y1={comp.start.y}
                    x2={comp.end.x}
                    y2={comp.end.y}
                    className="circuit-wire"
                  />
                ))}

                {board.map((hole) => (
                  <circle
                    key={hole.id}
                    cx={hole.x}
                    cy={hole.y}
                    r={startHole?.id === hole.id ? 10 : 6}
                    className="board-hole"
                    onClick={() => handleHoleClick(hole)}
                  />
                ))}

                {components.map((comp) => {
                  const centerX = (comp.start.x + comp.end.x) / 2;
                  const centerY = (comp.start.y + comp.end.y) / 2;
                  const angle =
                    Math.atan2(comp.end.y - comp.start.y, comp.end.x - comp.start.x) *
                    (180 / Math.PI);

                  return (
                    <g
                      key={`component-${comp.id}`}
                      transform={`translate(${centerX},${centerY}) rotate(${angle})`}
                    >
                      {comp.type === "battery" && (
                        <g>
                          <line x1="-34" y1="0" x2="-12" y2="0" className="lead-wire" />
                          <line x1="12" y1="0" x2="34" y2="0" className="lead-wire" />
                          <line x1="-7" y1="-24" x2="-7" y2="24" className="battery-large" />
                          <line x1="8" y1="-15" x2="8" y2="15" className="battery-small" />
                        </g>
                      )}

                      {comp.type === "resistor" && (
                        <g>
                          <line x1="-46" y1="0" x2="-24" y2="0" className="lead-wire" />
                          <line x1="24" y1="0" x2="46" y2="0" className="lead-wire" />
                          <rect x="-24" y="-12" width="48" height="24" rx="8" className="resistor-body" />
                          <rect x="-13" y="-12" width="4" height="24" fill="#dc2626" />
                          <rect x="-2" y="-12" width="4" height="24" fill="#2563eb" />
                          <rect x="10" y="-12" width="4" height="24" fill="#16a34a" />
                        </g>
                      )}

                      {comp.type === "led" && (
                        <g>
                          <circle r="28" className="led-glow" />
                          <circle r="13" className="led-core" />
                          <line x1="-38" y1="0" x2="-13" y2="0" className="lead-wire" />
                          <line x1="13" y1="0" x2="38" y2="0" className="lead-wire" />
                        </g>
                      )}

                      {comp.type === "switch" && (
                        <g>
                          <line x1="-33" y1="0" x2="-8" y2="0" className="lead-wire" />
                          <line x1="8" y1="0" x2="33" y2="0" className="lead-wire" />
                          <rect x="-18" y="-11" width="36" height="22" rx="11" className="switch-body" />
                          <circle cx="6" cy="0" r="5" fill="#fff" />
                        </g>
                      )}

                      {comp.type === "wire" && <CircleDot size={16} x="-8" y="-8" color="#14b8a6" />}
                    </g>
                  );
                })}
              </svg>
            </div>
          </main>

          <aside className="physics-panel physics-panel-pad">
            <div className="physics-panel-title">
              <h2>Live Readings</h2>
              <span>{stats.ready ? "closed path" : "draft"}</span>
            </div>

            <div className="physics-metric-list">
              <Metric label="Voltage" value={`${stats.voltage.toFixed(2)} V`} />
              <Metric label="Current" value={`${stats.current.toFixed(3)} A`} />
              <Metric label="Resistance" value={`${stats.resistance} ohm`} />
              <Metric label="Power" value={`${stats.power.toFixed(2)} W`} />
              <Metric label="LEDs" value={stats.leds} />
            </div>

            <div className="physics-note">
              Readings are estimated from placed parts so students can connect
              circuit structure with Ohm's law.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="physics-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
