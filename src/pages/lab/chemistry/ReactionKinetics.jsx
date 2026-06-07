import React, { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import LabExperimentLayout, {
  LabButton,
  LabControl,
  LabMetric,
} from "../../../components/lab/LabExperimentLayout.jsx";

/**
 * Collision-theory reaction rate simulator.
 * Rate ∝ concentration² × exp(-Ea/RT) × catalyst factor
 */
export default function ReactionKinetics() {
  const [temperature, setTemperature] = useState(300);
  const [concentration, setConcentration] = useState(0.5);
  const [catalyst, setCatalyst] = useState(0);
  const [running, setRunning] = useState(true);
  const [time, setTime] = useState(0);
  const [product, setProduct] = useState(0);
  const [collisions, setCollisions] = useState(0);
  const [successful, setSuccessful] = useState(0);

  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);
  const statsRef = useRef({ collisions: 0, successful: 0, product: 0, time: 0 });

  const R = 8.314;
  const Ea = 52000;
  const catalystFactor = 1 + catalyst * 2.5;
  const rateConstant =
    catalystFactor * concentration * Math.exp(-Ea / (R * temperature));
  const rateDisplay = rateConstant * 1e6;

  function initParticles(w, h, n) {
    return Array.from({ length: n }, () => ({
      x: 20 + Math.random() * (w - 40),
      y: 20 + Math.random() * (h - 40),
      vx: (Math.random() - 0.5) * (2 + temperature / 150),
      vy: (Math.random() - 0.5) * (2 + temperature / 150),
      reacted: false,
    }));
  }

  function reset() {
    const canvas = canvasRef.current;
    const w = canvas?.parentElement?.clientWidth || 400;
    const h = canvas?.parentElement?.clientHeight || 300;
    const count = Math.round(20 + concentration * 60);
    particlesRef.current = initParticles(w, h, count);
    statsRef.current = { collisions: 0, successful: 0, product: 0, time: 0 };
    setCollisions(0);
    setSuccessful(0);
    setProduct(0);
    setTime(0);
  }

  useEffect(() => {
    reset();
  }, [concentration]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let last = performance.now();

    function loop(now) {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      const ctx = canvas.getContext("2d");
      const { width: w, height: h } = canvas;

      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (running) {
        statsRef.current.time += dt;
        const speedScale = Math.sqrt(temperature / 300);
        const threshold = 28 + catalyst * 12;
        const successProb = Math.min(0.35, rateConstant * 0.08 * catalystFactor);

        particlesRef.current.forEach((p) => {
          if (p.reacted) return;
          p.x += p.vx * speedScale;
          p.y += p.vy * speedScale;
          if (p.x < 12 || p.x > w - 12) p.vx *= -1;
          if (p.y < 12 || p.y > h - 12) p.vy *= -1;
        });

        for (let i = 0; i < particlesRef.current.length; i += 1) {
          const a = particlesRef.current[i];
          if (a.reacted) continue;
          for (let j = i + 1; j < particlesRef.current.length; j += 1) {
            const b = particlesRef.current[j];
            if (b.reacted) continue;
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.hypot(dx, dy);
            if (dist < threshold) {
              statsRef.current.collisions += 1;
              const relSpeed = Math.hypot(a.vx - b.vx, a.vy - b.vy);
              if (relSpeed > 1.2 && Math.random() < successProb) {
                a.reacted = true;
                b.reacted = true;
                statsRef.current.successful += 1;
                statsRef.current.product += 1;
              }
            }
          }
        }

        setTime(statsRef.current.time);
        setCollisions(statsRef.current.collisions);
        setSuccessful(statsRef.current.successful);
        setProduct(statsRef.current.product);
      }

      ctx.fillStyle = "#06101d";
      ctx.fillRect(0, 0, w, h);

      particlesRef.current.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.reacted ? 4 : 6, 0, Math.PI * 2);
        ctx.fillStyle = p.reacted ? "#64748b" : "#fb923c";
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, temperature, concentration, catalyst, rateConstant, catalystFactor]);

  return (
    <LabExperimentLayout
      subject="chemistry"
      eyebrow="Kinetics Lab"
      title="Reaction Rate Simulator"
      objective="Visualize collision theory — how temperature, concentration, and catalysts affect reaction rate."
      actions={
        <>
          <LabButton variant="primary" onClick={() => setRunning((r) => !r)}>
            {running ? <Pause size={14} /> : <Play size={14} />}
            {running ? "Pause" : "Run"}
          </LabButton>
          <LabButton variant="warning" onClick={reset}>
            <RotateCcw size={14} /> Reset
          </LabButton>
        </>
      }
      simulation={<canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />}
      controls={
        <>
          <LabControl label="Temperature" value={temperature} onChange={setTemperature} min={280} max={400} step={1} suffix="K" />
          <LabControl label="Concentration" value={concentration} onChange={setConcentration} min={0.1} max={1} step={0.05} suffix="M" />
          <LabControl label="Catalyst level" value={catalyst} onChange={setCatalyst} min={0} max={1} step={0.05} hint="Lowers activation energy" />
        </>
      }
      observations={
        <>
          <LabMetric label="Sim time" value={`${time.toFixed(1)} s`} />
          <LabMetric label="Total collisions" value={collisions} />
          <LabMetric label="Effective collisions" value={successful} />
          <LabMetric label="Particles reacted" value={product * 2} />
        </>
      }
      results={
        <>
          <LabMetric label="Rate constant k" value={`${rateDisplay.toExponential(2)}`} highlight />
          <LabMetric label="Collision efficiency" value={collisions ? `${((successful / collisions) * 100).toFixed(1)}%` : "—"} />
          <LabMetric label="Catalyst factor" value={`×${catalystFactor.toFixed(2)}`} />
        </>
      }
      note="Higher temperature increases particle speed. Higher concentration means more collisions. Catalysts increase the fraction of successful collisions."
    />
  );
}
