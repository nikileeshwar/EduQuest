import React, { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import LabExperimentLayout, {
  LabButton,
  LabControl,
  LabMetric,
} from "../../../components/lab/LabExperimentLayout.jsx";

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
    return {
      kinetic: 0.5 * mass * v * v,
      potential: 0.5 * springK * x * x,
      total: 0.5 * mass * v * v + 0.5 * springK * x * x,
    };
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

  function pushHistory() {
    setHistory((prev) => {
      const s = stateRef.current;
      const next = prev.concat({ ...s, ...energy(s.x, s.v) });
      if (next.length > MAX_HISTORY) next.shift();
      return next;
    });
  }

  function drawSpring(ctx, x0, x1, y, coils, amp) {
    const length = Math.max(40, x1 - x0);
    const turns = Math.max(8, Math.floor((coils * length) / 170));
    ctx.beginPath();
    ctx.moveTo(x0, y);
    for (let i = 1; i <= turns; i += 1) {
      const t = i / turns;
      const x = x0 + t * (x1 - x0);
      ctx.lineTo(x, y + Math.sin(t * Math.PI * coils) * amp);
    }
    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawPlot(ctx, x, y, w, h, label, color, pick) {
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    roundRect(ctx, x, y, w, h, 6);
    ctx.fill();
    ctx.fillStyle = "rgba(238,247,255,0.7)";
    ctx.font = "700 11px Inter, sans-serif";
    ctx.fillText(label, x + 8, y + 16);
    const points = history.slice(-100);
    if (points.length < 2) return;
    const values = points.map(pick);
    const maxAbs = Math.max(...values.map(Math.abs), 0.001);
    ctx.beginPath();
    points.forEach((pt, i) => {
      const px = x + 8 + (i / (points.length - 1)) * (w - 16);
      const py = y + h / 2 - (pick(pt) / maxAbs) * (h * 0.35);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    const state = stateRef.current;

    ctx.fillStyle = "#06101d";
    ctx.fillRect(0, 0, width, height);

    const floorY = height * 0.72;
    const wallX = width * 0.08;
    const eqX = width * 0.42;
    const pxPerM = Math.max(80, Math.min(180, width * 0.16));
    const massX = eqX + state.x * pxPerM;
    const massW = 72;
    const massH = 54;
    const massY = floorY - massH;

    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(wallX - 12, height * 0.15, 14, floorY - height * 0.15);
    drawSpring(ctx, wallX + 2, massX - massW / 2, massY + massH / 2, 14, 10);

    ctx.setLineDash([5, 6]);
    ctx.strokeStyle = "rgba(103,232,249,0.3)";
    ctx.beginPath();
    ctx.moveTo(eqX, height * 0.12);
    ctx.lineTo(eqX, floorY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#f59e0b";
    roundRect(ctx, massX - massW / 2, massY, massW, massH, 6);
    ctx.fill();
    ctx.fillStyle = "#101827";
    ctx.font = "700 13px Inter, sans-serif";
    ctx.fillText(`${mass.toFixed(1)} kg`, massX - 18, massY + 34);

    drawPlot(ctx, width * 0.58, height * 0.12, width * 0.36, height * 0.28, "x(t)", "#67e8f9", (p) => p.x);
    drawPlot(ctx, width * 0.58, height * 0.48, width * 0.36, height * 0.22, "E(t)", "#fb7185", (p) => p.total);
  }

  useEffect(() => { reset(initialX, initialV); }, []);
  useEffect(() => { if (!running) reset(initialX, initialV); }, [initialX, initialV]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    function resize() {
      const p = canvas.parentElement;
      canvas.width = Math.floor(p.clientWidth);
      canvas.height = Math.floor(p.clientHeight);
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
    <LabExperimentLayout
      subject="physics"
      eyebrow="Mechanics Lab"
      title="Spring–Mass Oscillator"
      objective="Explore Hooke's law, damping, and resonance by adjusting spring stiffness, mass, and driving force."
      actions={
        <>
          <LabButton variant="primary" onClick={() => { setRunning((r) => { if (!r) lastRAFTime.current = null; return !r; }); }}>
            {running ? <Pause size={14} /> : <Play size={14} />}
            {running ? "Pause" : "Run"}
          </LabButton>
          <LabButton onClick={() => {
            setRunning(false);
            const cur = stateRef.current;
            const next = rk4Step({ x: cur.x, v: cur.v }, cur.t, dt);
            stateRef.current = { t: cur.t + dt, x: next.x, v: next.v };
            pushHistory();
            draw();
          }}>
            <StepForward size={14} /> Step
          </LabButton>
          <LabButton variant="warning" onClick={() => { setRunning(false); reset(); }}>
            <RotateCcw size={14} /> Reset
          </LabButton>
        </>
      }
      simulation={<canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />}
      controls={
        <>
          <LabControl label="Mass" value={mass} onChange={setMass} min={0.1} max={8} step={0.01} suffix="kg" />
          <LabControl label="Spring k" value={springK} onChange={setSpringK} min={1} max={200} step={0.1} suffix="N/m" />
          <LabControl label="Damping" value={damping} onChange={setDamping} min={0} max={6} step={0.01} />
          <LabControl label="Initial x" value={initialX} onChange={setInitialX} min={-1.5} max={1.5} step={0.01} suffix="m" />
          <LabControl label="Drive force" value={driveAmp} onChange={setDriveAmp} min={0} max={20} step={0.1} suffix="N" />
          <LabControl label="Drive freq" value={driveFreq} onChange={setDriveFreq} min={0.2} max={10} step={0.01} suffix="rad/s" />
        </>
      }
      observations={
        <>
          <LabMetric label="Displacement x" value={`${current.x.toFixed(3)} m`} />
          <LabMetric label="Velocity v" value={`${current.v.toFixed(3)} m/s`} />
          <LabMetric label="Natural ω₀" value={`${omega0.toFixed(3)} rad/s`} />
          <LabMetric label="Frequency f" value={`${frequency.toFixed(3)} Hz`} />
        </>
      }
      results={
        <>
          <LabMetric label="Damping ratio ζ" value={dampingRatio.toFixed(3)} highlight />
          <LabMetric label="Kinetic energy" value={`${lastHistory ? lastHistory.kinetic.toFixed(3) : "0.000"} J`} />
          <LabMetric label="Potential energy" value={`${lastHistory ? lastHistory.potential.toFixed(3) : "0.000"} J`} />
          <LabMetric label="Total energy" value={`${lastHistory ? lastHistory.total.toFixed(3) : "0.000"} J`} />
        </>
      }
      note="When drive frequency matches natural frequency, resonance amplifies amplitude. Under-damped systems (ζ &lt; 1) oscillate with decay."
    />
  );
}
