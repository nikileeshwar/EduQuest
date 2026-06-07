import React from "react";
import "../../styles/GamePage.css";

export default function GameShell({
  title,
  subtitle,
  accent = "purple",
  headerExtra,
  children,
  footer,
  overlay,
}) {
  return (
    <div className={`game-page game-accent-${accent}`}>
      <div className="game-glow game-glow-left" aria-hidden />
      <div className="game-glow game-glow-right" aria-hidden />

      <div className="game-shell">
        <header className="game-header">
          <div>
            <p className="game-eyebrow">EduQuest Games</p>
            <h1>{title}</h1>
            {subtitle && <p className="game-subtitle">{subtitle}</p>}
          </div>
          {headerExtra && <div className="game-header-extra">{headerExtra}</div>}
        </header>

        <div className="game-body">{children}</div>

        {footer && <footer className="game-footer">{footer}</footer>}
      </div>

      {overlay}
    </div>
  );
}

export function GameStat({ label, value, icon }) {
  return (
    <div className="game-stat">
      {icon && <span className="game-stat-icon">{icon}</span>}
      <div>
        <span className="game-stat-label">{label}</span>
        <strong className="game-stat-value">{value}</strong>
      </div>
    </div>
  );
}

export function GamePanel({ title, children, className = "" }) {
  return (
    <section className={`game-panel ${className}`.trim()}>
      {title && <h2 className="game-panel-title">{title}</h2>}
      {children}
    </section>
  );
}

export function GameButton({ children, onClick, variant = "primary", disabled, className = "" }) {
  return (
    <button
      type="button"
      className={`game-btn game-btn-${variant} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function GameOverlay({ children, onClose }) {
  return (
    <div className="game-overlay" role="dialog" aria-modal="true">
      <div className="game-overlay-backdrop" onClick={onClose} aria-hidden />
      <div className="game-overlay-card">{children}</div>
    </div>
  );
}

export function GameProgress({ current, total }) {
  const pct = total ? Math.round((current / total) * 100) : 0;
  return (
    <div className="game-progress">
      <div className="game-progress-bar" style={{ width: `${pct}%` }} />
      <span className="game-progress-label">
        {current} / {total}
      </span>
    </div>
  );
}
