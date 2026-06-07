import React, { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import LabExperimentLayout, {
  LabButton,
  LabControl,
  LabMetric,
} from "../../../components/lab/LabExperimentLayout.jsx";

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function pHtoColor(pH) {
  const p = clamp(pH, 0, 14);
  if (p <= 4) {
    const t = p / 4;
    return `rgb(255,${Math.round(60 + 140 * t)},${Math.round(40 + 40 * t)})`;
  }
  if (p <= 10) {
    const t = (p - 4) / 6;
    return `rgb(${Math.round(255 - 200 * t)},${Math.round(200 + 55 * t)},${Math.round(60 + 140 * t)})`;
  }
  const t = (p - 10) / 4;
  return `rgb(${Math.round(55 - 20 * t)},${Math.round(255 - 80 * t)},${Math.round(200 + 55 * t)})`;
}

function computeState(volAcidMl, concAcid, volBaseAddedMl, concBase) {
  const Va = volAcidMl / 1000;
  const Vb = volBaseAddedMl / 1000;
  const na = Va * concAcid;
  const nb = Vb * concBase;
  const totalV = Va + Vb || 1e-12;
  const net = na - nb;
  let pH = 7;
  if (Math.abs(net) < 1e-12) pH = 7;
  else if (net > 0) pH = -Math.log10(net / totalV);
  else pH = 14 - -Math.log10(Math.abs(net) / totalV);
  return { pH, na, nb, equivalenceVolMl: (na / concBase) * 1000 };
}

export default function Titration() {
  const [beakerVolMl, setBeakerVolMl] = useState(25);
  const [acidConc, setAcidConc] = useState(0.08);
  const [baseConc, setBaseConc] = useState(0.09);
  const [dropVolumeMl, setDropVolumeMl] = useState(1);
  const [addedVolumeMl, setAddedVolumeMl] = useState(0);
  const [dropCount, setDropCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [autoRunning, setAutoRunning] = useState(false);
  const autoRef = useRef(null);
  const graphRef = useRef(null);

  const sim = computeState(beakerVolMl, acidConc, addedVolumeMl, baseConc);
  const eqVol = sim.equivalenceVolMl;
  const pH = sim.pH;

  function fmt(v, d = 2) {
    return Number(v).toFixed(d);
  }

  function addDrop() {
    const newAdded = +(addedVolumeMl + dropVolumeMl).toFixed(6);
    setAddedVolumeMl(newAdded);
    setDropCount((c) => c + 1);
    const s = computeState(beakerVolMl, acidConc, newAdded, baseConc);
    setHistory((h) => [...h, { vol: newAdded, pH: s.pH }].slice(-500));
  }

  function resetAll() {
    setAddedVolumeMl(0);
    setDropCount(0);
    setHistory([]);
    setAutoRunning(false);
    if (autoRef.current) clearInterval(autoRef.current);
    const s = computeState(beakerVolMl, acidConc, 0, baseConc);
    setHistory([{ vol: 0, pH: s.pH }]);
  }

  useEffect(() => {
    if (!autoRunning) {
      if (autoRef.current) clearInterval(autoRef.current);
      return undefined;
    }
    autoRef.current = setInterval(() => {
      if (addedVolumeMl > Math.max(eqVol * 1.5, eqVol + 8)) {
        setAutoRunning(false);
        return;
      }
      addDrop();
    }, 280);
    return () => clearInterval(autoRef.current);
  }, [autoRunning, addedVolumeMl, eqVol]);

  useEffect(() => {
    if (history.length === 0) {
      const s = computeState(beakerVolMl, acidConc, 0, baseConc);
      setHistory([{ vol: 0, pH: s.pH }]);
    }
  }, []);

  useEffect(() => {
    const canvas = graphRef.current;
    if (!canvas) return undefined;
    function draw() {
      const parent = canvas.parentElement;
      const w = (canvas.width = parent.clientWidth);
      const h = (canvas.height = parent.clientHeight);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#06101d";
      ctx.fillRect(0, 0, w, h);
      if (!history.length) return;
      const xMax = Math.max(eqVol * 1.3, addedVolumeMl * 1.2, 10);
      ctx.strokeStyle = "#60a5fa";
      ctx.lineWidth = 2;
      ctx.beginPath();
      history.forEach((pt, i) => {
        const x = 20 + (pt.vol / xMax) * (w - 40);
        const y = h - 16 - (pt.pH / 14) * (h - 32);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      const eqX = 20 + (eqVol / xMax) * (w - 40);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.beginPath();
      ctx.moveTo(eqX, 8);
      ctx.lineTo(eqX, h - 8);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas.parentElement);
    return () => ro.disconnect();
  }, [history, addedVolumeMl, eqVol]);

  const fillRatio = clamp((beakerVolMl + addedVolumeMl) / (beakerVolMl + eqVol * 1.3), 0.15, 0.92);

  return (
    <LabExperimentLayout
      subject="chemistry"
      eyebrow="Acid–Base Lab"
      title="Virtual Titration"
      objective="Add base dropwise to a strong acid and observe the pH jump near the equivalence point."
      actions={
        <>
          <LabButton variant="primary" onClick={addDrop}>Add Drop</LabButton>
          <LabButton variant="success" onClick={() => setAutoRunning((r) => !r)}>
            {autoRunning ? "Stop Auto" : "Auto Titrate"}
          </LabButton>
          <LabButton variant="warning" onClick={resetAll}>
            <RotateCcw size={14} /> Reset
          </LabButton>
        </>
      }
      simulation={
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, height: "100%", padding: 10 }}>
          <svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMid meet" style={{ height: "100%", margin: "auto" }}>
            <rect x="50" y="30" width="100" height="200" rx="10" fill="#041623" stroke="rgba(255,255,255,0.08)" />
            <rect x="54" y={230 - fillRatio * 190} width="92" height={fillRatio * 190} rx="6" fill={pHtoColor(pH)} opacity="0.92" />
            <circle cx="100" cy="130" r="36" fill={pHtoColor(pH)} />
            <text x="100" y="136" textAnchor="middle" fontWeight="800" fontSize="14" fill="#041825">
              pH {fmt(pH)}
            </text>
          </svg>
          <div style={{ minHeight: 0, display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(238,247,255,0.6)", marginBottom: 6 }}>Titration curve</span>
            <canvas ref={graphRef} style={{ flex: 1, width: "100%", borderRadius: 8 }} />
          </div>
        </div>
      }
      controls={
        <>
          <LabControl label="Acid volume" value={beakerVolMl} onChange={setBeakerVolMl} min={5} max={100} step={1} suffix="mL" />
          <LabControl label="Acid conc." value={acidConc} onChange={setAcidConc} min={0.01} max={0.5} step={0.005} suffix="M" />
          <LabControl label="Base conc." value={baseConc} onChange={setBaseConc} min={0.01} max={0.5} step={0.005} suffix="M" />
          <LabControl label="Drop volume" value={dropVolumeMl} onChange={setDropVolumeMl} min={0.1} max={2.5} step={0.1} suffix="mL" />
        </>
      }
      observations={
        <>
          <LabMetric label="Volume added" value={`${fmt(addedVolumeMl)} mL`} />
          <LabMetric label="Drops added" value={dropCount} />
          <LabMetric label="Current pH" value={fmt(pH)} highlight />
          <LabMetric label="Moles acid" value={sim.na.toExponential(2)} />
        </>
      }
      results={
        <>
          <LabMetric label="Equivalence volume" value={`${fmt(eqVol)} mL`} highlight />
          <LabMetric label="Distance to eq." value={`${fmt(Math.abs(eqVol - addedVolumeMl))} mL`} />
          <LabMetric label="Region" value={addedVolumeMl < eqVol - 0.5 ? "Before eq." : addedVolumeMl > eqVol + 0.5 ? "After eq." : "At equivalence"} />
        </>
      }
      note="Strong acid + strong base: equivalence occurs when moles acid = moles base. The steepest pH change happens near the equivalence point."
    />
  );
}
