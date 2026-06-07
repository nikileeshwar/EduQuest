import React, { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import LabExperimentLayout, {
  LabButton,
  LabControl,
  LabMetric,
} from "../../../components/lab/LabExperimentLayout.jsx";

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
      omegaDot:
        -(gravity / LENGTH) * Math.sin(state.theta) -
        (damping / mass) * state.omega +
        drive,
    };
  }

  function rk4Step(state, t, h) {
    const k1 = derivs(state, t);
    const s2 = { theta: state.theta + 0.5 * h * k1.thetaDot, omega: state.omega + 0.5 * h * k1.omegaDot };
    const k2 = derivs(s2, t + 0.5 * h);
    const s3 = { theta: state.theta + 0.5 * h * k2.thetaDot, omega: state.omega + 0.5 * h * k2.omegaDot };
    const k3 = derivs(s3, t + 0.5 * h);
    const s4 = { theta: state.theta + h * k3.thetaDot, omega: state.omega + h * k3.omegaDot };
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
    setRunning((v) => {
      if (!v) lastTimeRef.current = null;
      return !v;
    });
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    ctx.fillStyle = "#06101d";
    ctx.fillRect(0, 0, width, height);

    const pivotX = width / 2;
    const pivotY = Math.max(60, height * 0.18);
    const scale = Math.max(90, Math.min(width * 0.28, height * 0.55));
    const state = stateRef.current;
    const bobX = pivotX + Math.sin(state.theta) * LENGTH * scale;
    const bobY = pivotY + Math.cos(state.theta) * LENGTH * scale;

    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    for (let angle = -60; angle <= 60; angle += 15) {
      const rad = (angle * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(pivotX + Math.sin(rad) * scale, pivotY + Math.cos(rad) * scale);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.strokeStyle = "#dbeafe";
    ctx.lineWidth = 4;
    ctx.stroke();

    const bobRadius = Math.max(12, Math.min(24, 12 + mass * 2.5));
    ctx.fillStyle = "#60a5fa";
    ctx.beginPath();
    ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#eef7ff";
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, 6, 0, Math.PI * 2);
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
          const s = stateRef.current;
          const next = prev.concat({ ...s, ...energy(s.theta, s.omega) });
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
    <LabExperimentLayout
      subject="physics"
      eyebrow="Oscillation Lab"
      title="Pendulum Pro"
      objective="Investigate simple harmonic motion by adjusting mass, gravity, damping, and driving force."
      actions={
        <>
          <LabButton variant="primary" onClick={toggleRun}>
            {running ? <Pause size={14} /> : <Play size={14} />}
            {running ? "Pause" : "Run"}
          </LabButton>
          <LabButton variant="warning" onClick={() => { setRunning(false); reset(); }}>
            <RotateCcw size={14} /> Reset
          </LabButton>
        </>
      }
      simulation={<canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />}
      controls={
        <>
          <LabControl label="Mass" value={mass} onChange={setMass} min={0.1} max={5} step={0.05} suffix="kg" />
          <LabControl label="Damping" value={damping} onChange={setDamping} min={0} max={1.2} step={0.01} />
          <LabControl label="Gravity" value={gravity} onChange={setGravity} min={1} max={15} step={0.01} suffix="m/s²" />
          <LabControl label="Drive force" value={driveAmp} onChange={setDriveAmp} min={0} max={6} step={0.01} />
          <LabControl label="Drive freq" value={driveFreq} onChange={setDriveFreq} min={0} max={8} step={0.01} suffix="rad/s" />
          <LabControl label="Time scale" value={timeScale} onChange={setTimeScale} min={0.1} max={4} step={0.05} suffix="×" />
        </>
      }
      observations={
        <>
          <LabMetric label="Angle θ" value={`${((current.theta * 180) / Math.PI).toFixed(2)}°`} />
          <LabMetric label="Angular velocity" value={`${current.omega.toFixed(3)} rad/s`} />
          <LabMetric label="Sim time" value={`${current.t.toFixed(2)} s`} />
          <LabMetric label="Status" value={running ? "Running" : "Paused"} />
        </>
      }
      results={
        <>
          <LabMetric label="Kinetic energy" value={`${lastHistory ? lastHistory.kinetic.toFixed(3) : "0.000"} J`} />
          <LabMetric label="Potential energy" value={`${lastHistory ? lastHistory.potential.toFixed(3) : "0.000"} J`} />
          <LabMetric label="Total energy" value={`${lastHistory ? lastHistory.total.toFixed(3) : "0.000"} J`} highlight />
          <LabMetric label="Analytic period T" value={`${analyticPeriod.toFixed(3)} s`} />
          <LabMetric label="Measured period" value={measuredPeriod ? `${measuredPeriod.toFixed(3)} s` : "Collecting…"} />
        </>
      }
      note="For small angles, period T ≈ 2π√(L/g). Damping reduces amplitude; driving force can sustain oscillations."
    />
  );
}
