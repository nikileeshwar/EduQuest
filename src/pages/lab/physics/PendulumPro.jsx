import React, { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import "./PhysicsLab.css";

const LENGTH = 1;
const DEFAULT_THETA = 0.9;
const DEFAULT_OMEGA = 0;
const MAX_HISTORY = 3000;

export default function PendulumPro() {
  const [mass, setMass] = useState(1);
  const [damping, setDamping] = useState(0.05);
  const [gravity, setGravity] = useState(9.81);
  const [driveAmp, setDriveAmp] = useState(0);
  const [driveFreq, setDriveFreq] = useState(1.5);
  const [dt, setDt] = useState(0.01);
  const [timeScale, setTimeScale] = useState(1);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState([]);

  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const crossingsRef = useRef([]);
  const stateRef = useRef({ t: 0, theta: DEFAULT_THETA, omega: DEFAULT_OMEGA });

  const analyticPeriod = 2 * Math.PI * Math.sqrt(LENGTH / gravity);
  const current = stateRef.current;
  const lastHistory = history.length ? history[history.length - 1] : null;
  const measuredPeriod =
    crossingsRef.current.length > 2
      ? crossingsRef.current[crossingsRef.current.length - 1] -
        crossingsRef.current[crossingsRef.current.length - 2]
      : null;

  function energy(theta, omega) {
    const kinetic = 0.5 * mass * Math.pow(LENGTH * omega, 2);
    const potential = mass * gravity * LENGTH * (1 - Math.cos(theta));
    return { kinetic, potential, total: kinetic + potential };
  }

  function derivs(state, t) {
    const drive = driveAmp
      ? (driveAmp / (mass * Math.pow(LENGTH, 2))) * Math.sin(driveFreq * t)
      : 0;

    return {
      thetaDot: state.omega,
      omegaDot: -(gravity / LENGTH) * Math.sin(state.theta) - (damping / mass) * state.omega + drive,
    };
  }

  function rk4Step(state, t, h) {
    const k1 = derivs(state, t);
    const s2 = {
      theta: state.theta + 0.5 * h * k1.thetaDot,
      omega: state.omega + 0.5 * h * k1.omegaDot,
    };
    const k2 = derivs(s2, t + 0.5 * h);
    const s3 = {
      theta: state.theta + 0.5 * h * k2.thetaDot,
      omega: state.omega + 0.5 * h * k2.omegaDot,
    };
    const k3 = derivs(s3, t + 0.5 * h);
    const s4 = {
      theta: state.theta + h * k3.thetaDot,
      omega: state.omega + h * k3.omegaDot,
    };
    const k4 = derivs(s4, t + h);

    return {
      theta: state.theta + (h / 6) * (k1.thetaDot + 2 * k2.thetaDot + 2 * k3.thetaDot + k4.thetaDot),
      omega: state.omega + (h / 6) * (k1.omegaDot + 2 * k2.omegaDot + 2 * k3.omegaDot + k4.omegaDot),
    };
  }

  function reset() {
    const start = { t: 0, theta: DEFAULT_THETA, omega: DEFAULT_OMEGA };
    stateRef.current = start;
    crossingsRef.current = [];
    setHistory([{ ...start, ...energy(start.theta, start.omega) }]);
    draw();
  }

  function toggleRun() {
    setRunning((value) => {
      const next = !value;
      if (next) lastTimeRef.current = null;
      return next;
    });
  }

  function resetSim() {
    setRunning(false);
    reset();
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = "#06101d";
    ctx.fillRect(0, 0, width, height);

    const pivotX = width / 2;
    const pivotY = Math.max(86, height * 0.22);
    const scale = Math.max(120, Math.min(width * 0.26, height * 0.44));
    const state = stateRef.current;
    const bobX = pivotX + Math.sin(state.theta) * LENGTH * scale;
    const bobY = pivotY + Math.cos(state.theta) * LENGTH * scale;

    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    for (let angle = -60; angle <= 60; angle += 15) {
      const rad = (angle * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(pivotX + Math.sin(rad) * scale, pivotY + Math.cos(rad) * scale);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(pivotX, pivotY, scale, Math.PI * 0.25, Math.PI * 0.75);
    ctx.strokeStyle = "rgba(103,232,249,0.18)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.strokeStyle = "#dbeafe";
    ctx.lineWidth = 4;
    ctx.stroke();

    const bobRadius = Math.max(14, Math.min(28, 14 + mass * 3));
    const glow = ctx.createRadialGradient(bobX, bobY, 3, bobX, bobY, bobRadius * 3);
    glow.addColorStop(0, "rgba(96,165,250,0.55)");
    glow.addColorStop(1, "rgba(96,165,250,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(bobX, bobY, bobRadius * 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#60a5fa";
    ctx.beginPath();
    ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#eef7ff";
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    function resize() {
      const parent = canvas.parentElement;
      canvas.width = Math.floor(parent.clientWidth);
      canvas.height = Math.floor(parent.clientHeight);
      draw();
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [mass, damping, driveAmp, driveFreq, dt, timeScale, gravity]);

  useEffect(() => {
    function step(now) {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const elapsed = now - lastTimeRef.current;
      lastTimeRef.current = now;
      const scaled = (elapsed / 1000) * timeScale;

      if (running && scaled > 1e-8) {
        let remaining = Math.min(scaled, 0.25);
        while (remaining > 1e-8) {
          const h = Math.min(dt, remaining);
          const cur = stateRef.current;
          const next = rk4Step(cur, cur.t, h);
          const nextTime = cur.t + h;

          if (cur.theta < 0 && next.theta >= 0 && next.omega > 0) {
            crossingsRef.current.push(nextTime);
            if (crossingsRef.current.length > 40) crossingsRef.current.shift();
          }

          stateRef.current = { t: nextTime, theta: next.theta, omega: next.omega };
          remaining -= h;
        }

        setHistory((prev) => {
          const state = stateRef.current;
          const next = prev.concat({ ...state, ...energy(state.theta, state.omega) });
          if (next.length > MAX_HISTORY) next.shift();
          return next;
        });
      }

      draw();
      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, dt, timeScale, driveAmp, driveFreq, damping, mass, gravity]);

  return (
    <div className="physics-sim-page compact-sim">
      <div className="physics-sim-shell">
        <header className="physics-sim-header">
          <div>
            <p className="physics-eyebrow">Oscillation Lab</p>
            <h1>Pendulum Pro</h1>
            <p>
              Change gravity, damping, mass, and driving force to observe how a
              simple pendulum moves and stores energy.
            </p>
          </div>

          <div className="physics-action-row">
            <button className="physics-button primary" onClick={toggleRun}>
              {running ? <Pause size={16} /> : <Play size={16} />}
              {running ? "Pause" : "Run"}
            </button>
            <button className="physics-button warning" onClick={resetSim}>
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </header>

        <div className="physics-layout sim-layout">
          <main className="physics-panel physics-panel-pad physics-board">
            <div className="physics-board-header">
              <div>
                <h2>Motion View</h2>
                <span>theta = {((current.theta * 180) / Math.PI).toFixed(2)} deg</span>
              </div>
            </div>

            <div className="physics-canvas-wrap">
              <canvas ref={canvasRef} />
            </div>

            <div className="physics-controls-grid">
              <Control label="Mass" suffix="kg" value={mass} set={setMass} min={0.1} max={5} step={0.05} />
              <Control label="Damping" value={damping} set={setDamping} min={0} max={1.2} step={0.01} />
              <Control label="Gravity" suffix="m/s2" value={gravity} set={setGravity} min={1} max={15} step={0.01} />
              <Control label="Time step" value={dt} set={setDt} min={0.001} max={0.05} step={0.001} />
              <Control label="Time scale" suffix="x" value={timeScale} set={setTimeScale} min={0.1} max={4} step={0.05} />
              <Control label="Drive force" value={driveAmp} set={setDriveAmp} min={0} max={6} step={0.01} />
              <Control label="Drive freq" suffix="rad/s" value={driveFreq} set={setDriveFreq} min={0} max={8} step={0.01} />
            </div>
          </main>

          <aside className="physics-panel physics-panel-pad">
            <div className="physics-panel-title">
              <h2>Measurements</h2>
              <span>{running ? "live" : "paused"}</span>
            </div>

            <div className="physics-metric-list">
              <Metric label="Angle" value={`${((current.theta * 180) / Math.PI).toFixed(2)} deg`} />
              <Metric label="Angular velocity" value={`${current.omega.toFixed(3)} rad/s`} />
              <Metric label="Kinetic energy" value={`${lastHistory ? lastHistory.kinetic.toFixed(3) : "0.000"} J`} />
              <Metric label="Potential energy" value={`${lastHistory ? lastHistory.potential.toFixed(3) : "0.000"} J`} />
              <Metric label="Total energy" value={`${lastHistory ? lastHistory.total.toFixed(3) : "0.000"} J`} />
              <Metric label="Analytic period" value={`${analyticPeriod.toFixed(3)} s`} />
              <Metric label="Measured period" value={measuredPeriod ? `${measuredPeriod.toFixed(3)} s` : "waiting"} />
            </div>

            <div className="physics-note">
              Period mostly depends on length and gravity. Damping removes energy,
              while drive force can add energy back into the motion.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Control({ label, value, set, min, max, step, suffix = "" }) {
  return (
    <div className="physics-control">
      <label>
        <span>{label}</span>
        <span>
          {value.toFixed(2)} {suffix}
        </span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => set(Number(event.target.value))}
      />
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
