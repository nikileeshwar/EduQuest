import React, { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import LabExperimentLayout, {
  LabButton,
  LabControl,
  LabMetric,
} from "../../../components/lab/LabExperimentLayout.jsx";

/**
 * Electrolysis of aqueous NaCl — simplified cell model.
 * At cathode: 2H₂O + 2e⁻ → H₂ + 2OH⁻
 * At anode: 2Cl⁻ → Cl₂ + 2e⁻
 */
export default function Electrochemistry() {
  const [voltage, setVoltage] = useState(6);
  const [electrolyteConc, setElectrolyteConc] = useState(1);
  const [electrodeGap, setElectrodeGap] = useState(4);
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [charge, setCharge] = useState(0);
  const [h2Moles, setH2Moles] = useState(0);
  const [cl2Moles, setCl2Moles] = useState(0);
  const [bubbles, setBubbles] = useState([]);

  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const bubbleId = useRef(0);

  const resistance = 2 + electrodeGap * 0.8 + 1 / Math.max(electrolyteConc, 0.1);
  const current = voltage > 3.5 ? voltage / resistance : 0;
  const power = voltage * current;

  useEffect(() => {
    if (!running) return undefined;
    let last = performance.now();
    let animId;

    function tick(now) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      setTime((t) => t + dt);
      setCharge((q) => q + current * dt);
      const moles = (current * dt) / 96485;
      setH2Moles((m) => m + moles / 2);
      setCl2Moles((m) => m + moles / 2);

      if (current > 0.01 && Math.random() < current * dt * 3) {
        const side = Math.random() > 0.5 ? "left" : "right";
        setBubbles((b) =>
          [...b, { id: bubbleId.current++, side, y: 0.75 + Math.random() * 0.1 }].slice(-40)
        );
      }

      setBubbles((b) =>
        b
          .map((bb) => ({ ...bb, y: bb.y - dt * 0.15 }))
          .filter((bb) => bb.y > 0.2)
      );

      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [running, current]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    function draw() {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      const ctx = canvas.getContext("2d");
      const { width: w, height: h } = canvas;

      ctx.fillStyle = "#06101d";
      ctx.fillRect(0, 0, w, h);

      const beakerX = w * 0.15;
      const beakerW = w * 0.7;
      const beakerTop = h * 0.18;
      const beakerH = h * 0.65;

      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 2;
      ctx.strokeRect(beakerX, beakerTop, beakerW, beakerH);

      const liquidTop = beakerTop + beakerH * 0.15;
      ctx.fillStyle = running && current > 0 ? "rgba(59,130,246,0.35)" : "rgba(59,130,246,0.2)";
      ctx.fillRect(beakerX + 2, liquidTop, beakerW - 4, beakerTop + beakerH - liquidTop - 2);

      const gapPx = (electrodeGap / 10) * beakerW * 0.5;
      const cx = beakerX + beakerW / 2;
      const cathodeX = cx - gapPx / 2;
      const anodeX = cx + gapPx / 2;

      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(cathodeX - 6, beakerTop - 20, 12, beakerH + 30);
      ctx.fillRect(anodeX - 6, beakerTop - 20, 12, beakerH + 30);

      ctx.fillStyle = "#ef4444";
      ctx.font = "700 11px Inter, sans-serif";
      ctx.fillText("Anode (+)", anodeX - 22, beakerTop - 28);
      ctx.fillStyle = "#3b82f6";
      ctx.fillText("Cathode (−)", cathodeX - 30, beakerTop - 28);

      bubbles.forEach((b) => {
        const x = b.side === "left" ? cathodeX : anodeX;
        const y = beakerTop + b.y * beakerH;
        ctx.beginPath();
        ctx.arc(x + (Math.random() - 0.5) * 20, y, 4 + Math.random() * 3, 0, Math.PI * 2);
        ctx.fillStyle = b.side === "left" ? "rgba(200,220,255,0.7)" : "rgba(180,255,200,0.7)";
        ctx.fill();
      });

      if (running && current > 0) {
        ctx.strokeStyle = "rgba(250,204,21,0.4)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.moveTo(anodeX, beakerTop - 10);
        ctx.lineTo(cathodeX, beakerTop - 10);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas.parentElement);
    const id = setInterval(draw, 100);
    return () => {
      ro.disconnect();
      clearInterval(id);
    };
  }, [running, current, electrodeGap, bubbles]);

  function reset() {
    setRunning(false);
    setTime(0);
    setCharge(0);
    setH2Moles(0);
    setCl2Moles(0);
    setBubbles([]);
  }

  return (
    <LabExperimentLayout
      subject="chemistry"
      eyebrow="Electrochemistry Lab"
      title="Electrolysis Experiment"
      objective="Apply voltage across electrodes in an electrolyte and observe current flow, gas evolution, and charge transfer."
      actions={
        <>
          <LabButton variant="primary" onClick={() => setRunning((r) => !r)}>
            {running ? <Pause size={14} /> : <Play size={14} />}
            {running ? "Stop" : "Start Electrolysis"}
          </LabButton>
          <LabButton variant="warning" onClick={reset}>
            <RotateCcw size={14} /> Reset
          </LabButton>
        </>
      }
      simulation={<canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />}
      controls={
        <>
          <LabControl label="Voltage" value={voltage} onChange={setVoltage} min={0} max={12} step={0.5} suffix="V" />
          <LabControl label="Electrolyte conc." value={electrolyteConc} onChange={setElectrolyteConc} min={0.1} max={2} step={0.1} suffix="M" />
          <LabControl label="Electrode gap" value={electrodeGap} onChange={setElectrodeGap} min={2} max={8} step={0.5} suffix="cm" />
        </>
      }
      observations={
        <>
          <LabMetric label="Elapsed time" value={`${time.toFixed(1)} s`} />
          <LabMetric label="Current I" value={`${(current * 1000).toFixed(1)} mA`} highlight />
          <LabMetric label="Cell status" value={current > 0 ? "Electrolyzing" : voltage > 3.5 ? "Low I" : "Below threshold"} />
          <LabMetric label="Gas bubbles" value={bubbles.length} />
        </>
      }
      results={
        <>
          <LabMetric label="Charge passed Q" value={`${charge.toFixed(3)} C`} />
          <LabMetric label="H₂ produced" value={`${(h2Moles * 1000).toFixed(3)} mmol`} />
          <LabMetric label="Cl₂ produced" value={`${(cl2Moles * 1000).toFixed(3)} mmol`} />
          <LabMetric label="Power" value={`${power.toFixed(2)} W`} />
        </>
      }
      note="Minimum ~3.5 V needed to drive electrolysis. Faraday's law: moles = Q / (nF). Cathode releases H₂; anode releases Cl₂ from chloride ions."
    />
  );
}
