import React from "react";
import "../../styles/LabExperiment.css";

/**
 * Unified no-scroll lab dashboard shell.
 * subject: physics | chemistry | biology
 */
export default function LabExperimentLayout({
  subject = "physics",
  eyebrow,
  title,
  objective,
  actions,
  simulation,
  controls,
  observations,
  results,
  note,
}) {
  return (
    <div className={`lab-experiment-page lab-subject-${subject}`}>
      <div className="lab-experiment-glow lab-glow-left" aria-hidden />
      <div className="lab-experiment-glow lab-glow-right" aria-hidden />

      <div className="lab-experiment-shell">
        <header className="lab-experiment-header">
          <div className="lab-experiment-heading">
            {eyebrow && <p className="lab-experiment-eyebrow">{eyebrow}</p>}
            <h1>{title}</h1>
            {objective && <p className="lab-experiment-objective">{objective}</p>}
          </div>
          {actions && <div className="lab-experiment-actions">{actions}</div>}
        </header>

        <div className="lab-experiment-grid">
          <section className="lab-experiment-panel lab-simulation-panel">
            <div className="lab-panel-head">
              <h2>Simulation</h2>
            </div>
            <div className="lab-simulation-stage">{simulation}</div>
            {controls && (
              <div className="lab-controls-block">
                <div className="lab-panel-head compact">
                  <h2>Controls</h2>
                </div>
                <div className="lab-controls-grid">{controls}</div>
              </div>
            )}
          </section>

          <aside className="lab-experiment-side">
            {observations && (
              <section className="lab-experiment-panel lab-side-panel">
                <div className="lab-panel-head">
                  <h2>Observations</h2>
                </div>
                <div className="lab-observations">{observations}</div>
              </section>
            )}

            {results && (
              <section className="lab-experiment-panel lab-side-panel">
                <div className="lab-panel-head">
                  <h2>Results</h2>
                </div>
                <div className="lab-results">{results}</div>
              </section>
            )}

            {note && <div className="lab-experiment-note">{note}</div>}
          </aside>
        </div>
      </div>
    </div>
  );
}

export function LabControl({ label, value, onChange, min, max, step, suffix = "", hint }) {
  const display =
    typeof value === "number"
      ? `${value.toFixed(step < 0.01 ? 3 : step < 1 ? 2 : 0)}${suffix ? ` ${suffix}` : ""}`
      : value;

  return (
    <div className="lab-control">
      <label>
        <span>{label}</span>
        <span>{display}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && <small>{hint}</small>}
    </div>
  );
}

export function LabMetric({ label, value, highlight }) {
  return (
    <div className={`lab-metric${highlight ? " highlight" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function LabButton({ children, onClick, variant = "default", type = "button" }) {
  return (
    <button type={type} className={`lab-btn lab-btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}
