import React, { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import "./PhysicsLab.css";

const MAX_HISTORY = 1600;

export default function SpringMass() {
  const [mass, setMass] = useState(1);
  const [springK, setSpringK] = useState(20);
  const [damping, setDamping] = useState(0.5);
  const [initialX, setInitialX] = useState(-0.4);
  const [initialV, setInitialV] = useState(0);
  const [driveAmp, setDriveAmp] = useState(0);
  const [driveFreq, setDriveFreq] = useState(2);
  const [dt, setDt] = useState(0.012);
  const [timeScale, setTimeScale] = useState(1);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState([]);

  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const lastRAFTime = useRef(null);
  const stateRef = useRef({ t: 0, x: initialX, v: initialV });

  const omega0 = Math.sqrt(springK / mass);
  const frequency = omega0 / (2 * Math.PI);
  const dampingRatio = damping / (2 * Math.sqrt(springK * mass));
  const current = stateRef.current;
  const lastHistory = history.length ? history[history.length - 1] : null;

  function energy(x, v) {
    const kinetic = 0.5 * mass * v * v;
    const potential = 0.5 * springK * x * x;
    return { kinetic, potential, total: kinetic + potential };
  }

  function derivs(state, t) {
    const drive = driveAmp * Math.sin(driveFreq * t);
    return {
      xdot: state.v,
      vdot: (-springK * state.x - damping * state.v + drive) / mass,
    };
  }

  function rk4Step(state, t, h) {
    const k1 = derivs(state, t);
    const s2 = { x: state.x + 0.5 * h * k1.xdot, v: state.v + 0.5 * h * k1.vdot };
    const k2 = derivs(s2, t + 0.5 * h);
    const s3 = { x: state.x + 0.5 * h * k2.xdot, v: state.v + 0.5 * h * k2.vdot };
    const k3 = derivs(s3, t + 0.5 * h);
    const s4 = { x: state.x + h * k3.xdot, v: state.v + h * k3.vdot };
    const k4 = derivs(s4, t + h);

    return {
      x: state.x + (h / 6) * (k1.xdot + 2 * k2.xdot + 2 * k3.xdot + k4.xdot),
      v: state.v + (h / 6) * (k1.vdot + 2 * k2.vdot + 2 * k3.vdot + k4.vdot),
    };
  }

  function reset(nextX = initialX, nextV = initialV) {
    stateRef.current = { t: 0, x: nextX, v: nextV };
    setHistory([{ t: 0, x: nextX, v: nextV, ...energy(nextX, nextV) }]);
    draw();
  }

  function toggleRun() {
    setRunning((value) => {
      const next = !value;
      if (next) lastRAFTime.current = null;
      return next;
    });
  }

  function resetSim() {
    setRunning(false);
    reset();
  }

  function stepSim() {
    setRunning(false);
    const cur = stateRef.current;
    const next = rk4Step({ x: cur.x, v: cur.v }, cur.t, dt);
    stateRef.current = { t: cur.t + dt, x: next.x, v: next.v };
    pushHistory();
    draw();
  }

  function pushHistory() {
    setHistory((prev) => {
      const state = stateRef.current;
      const next = prev.concat({ ...state, ...energy(state.x, state.v) });
      if (next.length > MAX_HISTORY) next.shift();
      return next;
    });
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const state = stateRef.current;

    ctx.fillStyle = "#06101d";
    ctx.fillRect(0, 0, width, height);

    const floorY = height * 0.68;
    const wallX = width * 0.09;
    const equilibriumX = width * 0.45;
    const pxPerMeter = Math.max(110, Math.min(230, width * 0.18));
    const massX = equilibriumX + state.x * pxPerMeter;
    const massW = 94;
    const massH = 70;
    const massY = floorY - massH;

    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    for (let x = wallX; x < width - 28; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, floorY);
      ctx.lineTo(x + 22, floorY + 22);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(wallX - 15, height * 0.18, 18, floorY - height * 0.18);

    drawSpring(ctx, wallX + 3, massX - massW / 2, massY + massH / 2, 15, 13);

    ctx.setLineDash([6, 8]);
    ctx.strokeStyle = "rgba(103,232,249,0.25)";
    ctx.beginPath();
    ctx.moveTo(equilibriumX, height * 0.18);
    ctx.lineTo(equilibriumX, floorY + 30);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 18;
    ctx.fillStyle = "#f59e0b";
    roundRect(ctx, massX - massW / 2, massY, massW, massH, 8);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#101827";
    ctx.font = "700 15px Inter, system-ui, sans-serif";
    ctx.fillText(`${mass.toFixed(1)} kg`, massX - 22, massY + 42);

    drawPlot(ctx, width * 0.62, height * 0.16, width * 0.31, height * 0.32, "x(t)", "#67e8f9", (point) => point.x);
    drawPlot(ctx, width * 0.62, height * 0.54, width * 0.31, height * 0.25, "Energy", "#fb7185", (point) => point.total);
  }

  function drawSpring(ctx, x0, x1, y, coils, amp) {
    const length = Math.max(40, x1 - x0);
    const turns = Math.max(8, Math.floor((coils * length) / 170));

    ctx.beginPath();
    ctx.moveTo(x0, y);
    for (let i = 1; i <= turns; i += 1) {
      const t = i / turns;
      const x = x0 + t * (x1 - x0);
      const springY = y + Math.sin(t * Math.PI * coils) * amp;
      ctx.lineTo(x, springY);
    }
    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  function drawPlot(ctx, x, y, width, height, label, color, pickValue) {
    ctx.fillStyle = "rgba(255,255,255,0.045)";
    roundRect(ctx, x, y, width, height, 8);
    ctx.fill();

    ctx.fillStyle = "rgba(238,247,255,0.72)";
    ctx.font = "800 12px Inter, system-ui, sans-serif";
    ctx.fillText(label, x + 12, y + 20);

    const points = history.slice(-120);
    if (points.length < 2) return;

    const values = points.map(pickValue);
    const maxAbs = Math.max(...values.map((value) => Math.abs(value)), 0.001);

    ctx.beginPath();
    points.forEach((point, index) => {
      const px = x + 10 + (index / (points.length - 1)) * (width - 20);
      const py = y + height / 2 - (pickValue(point) / maxAbs) * (height * 0.36);
      if (index === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  }

  useEffect(() => {
    reset(initialX, initialV);
  }, []);

  useEffect(() => {
    if (!running) reset(initialX, initialV);
  }, [initialX, initialV]);

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
  }, [mass, springK, damping, driveAmp, driveFreq, timeScale]);

  useEffect(() => {
    function loop(now) {
      if (!lastRAFTime.current) lastRAFTime.current = now;
      const elapsed = now - lastRAFTime.current;
      lastRAFTime.current = now;

      if (running) {
        let remaining = Math.min((elapsed / 1000) * timeScale, 0.25);
        while (remaining > 1e-9) {
          const h = Math.min(dt, remaining, 0.05);
          const cur = stateRef.current;
          const next = rk4Step({ x: cur.x, v: cur.v }, cur.t, h);
          stateRef.current = { t: cur.t + h, x: next.x, v: next.v };
          remaining -= h;
        }
        pushHistory();
      }

      draw();
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, dt, timeScale, driveAmp, driveFreq, damping, mass, springK]);

  return (
    <div className="physics-sim-page compact-sim">
      <div className="physics-sim-shell">
        <header className="physics-sim-header">
          <div>
            <p className="physics-eyebrow">Oscillation Lab</p>
            <h1>Spring Mass</h1>
            <p>
              Explore Hooke's law, damping, and resonance by changing the mass,
              spring stiffness, and external driving force.
            </p>
          </div>

          <div className="physics-action-row">
            <button className="physics-button primary" onClick={toggleRun}>
              {running ? <Pause size={16} /> : <Play size={16} />}
              {running ? "Pause" : "Run"}
            </button>
            <button className="physics-button" onClick={stepSim}>
              <StepForward size={16} />
              Step
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
                <h2>Oscillator View</h2>
                <span>x = {current.x.toFixed(3)} m</span>
              </div>
            </div>

            <div className="physics-canvas-wrap">
              <canvas ref={canvasRef} />
            </div>

            <div className="physics-controls-grid">
              <Control label="Mass" suffix="kg" value={mass} set={setMass} min={0.1} max={8} step={0.01} />
              <Control label="Spring k" suffix="N/m" value={springK} set={setSpringK} min={1} max={200} step={0.1} />
              <Control label="Damping" value={damping} set={setDamping} min={0} max={6} step={0.01} />
              <Control label="Initial x" suffix="m" value={initialX} set={setInitialX} min={-1.5} max={1.5} step={0.01} />
              <Control label="Initial v" suffix="m/s" value={initialV} set={setInitialV} min={-6} max={6} step={0.01} />
              <Control label="Drive force" suffix="N" value={driveAmp} set={setDriveAmp} min={0} max={20} step={0.1} />
              <Control label="Drive freq" suffix="rad/s" value={driveFreq} set={setDriveFreq} min={0.2} max={10} step={0.01} />
              <Control label="Time step" value={dt} set={setDt} min={0.002} max={0.04} step={0.001} />
              <Control label="Time scale" suffix="x" value={timeScale} set={setTimeScale} min={0.1} max={3} step={0.05} />
            </div>
          </main>

          <aside className="physics-panel physics-panel-pad">
            <div className="physics-panel-title">
              <h2>Measurements</h2>
              <span>{running ? "live" : "paused"}</span>
            </div>

            <div className="physics-metric-list">
              <Metric label="Displacement" value={`${current.x.toFixed(3)} m`} />
              <Metric label="Velocity" value={`${current.v.toFixed(3)} m/s`} />
              <Metric label="Natural omega" value={`${omega0.toFixed(3)} rad/s`} />
              <Metric label="Natural freq" value={`${frequency.toFixed(3)} Hz`} />
              <Metric label="Damping ratio" value={dampingRatio.toFixed(3)} />
              <Metric label="Kinetic energy" value={`${lastHistory ? lastHistory.kinetic.toFixed(3) : "0.000"} J`} />
              <Metric label="Potential energy" value={`${lastHistory ? lastHistory.potential.toFixed(3) : "0.000"} J`} />
              <Metric label="Total energy" value={`${lastHistory ? lastHistory.total.toFixed(3) : "0.000"} J`} />
            </div>

            <div className="physics-history">
              {history.slice(-12).reverse().map((item) => (
                <div className="physics-history-row" key={`${item.t}-${item.x}`}>
                  <span>t {item.t.toFixed(2)}s</span>
                  <strong>x {item.x.toFixed(3)}</strong>
                </div>
              ))}
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
