import React from "react";
import { CircuitBoard, Orbit, Waves } from "lucide-react";
import LabCategory from "../LabCategory.jsx";

export default function PhysicsLab() {
  const experiments = [
    {
      title: "Circuit Studio",
      subtitle: "Electric circuits and breadboard design",
      topics: ["Voltage", "Current", "Resistance"],
      route: "/games/lab/physics/circuit",
      accent: "#14b8a6",
      icon: CircuitBoard,
    },
    {
      title: "Pendulum Pro",
      subtitle: "Simple harmonic motion",
      topics: ["Period", "Frequency", "Energy"],
      route: "/games/lab/physics/pendulum",
      accent: "#8b5cf6",
      icon: Orbit,
    },
    {
      title: "Spring Mass",
      subtitle: "Oscillations and damping",
      topics: ["Hooke's Law", "Damping", "Resonance"],
      route: "/games/lab/physics/springmass",
      accent: "#f59e0b",
      icon: Waves,
    },
  ];

  return (
    <LabCategory
      title="Physics Laboratory"
      subtitle="Interactive physics experiments with live controls and measurements."
      experiments={experiments}
    />
  );
}
