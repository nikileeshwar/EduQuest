import React from "react";
import { Beaker, Activity, Zap } from "lucide-react";
import LabCategory from "../LabCategory.jsx";

export default function ChemistryLab() {
  const experiments = [
    {
      title: "Virtual Titration",
      subtitle: "Acid-Base Neutralization",
      topics: ["Indicators", "pH Curves", "Equivalence Point"],
      route: "/games/lab/chemistry/titration",
      accent: "#ef4444",
      icon: Beaker,
    },
    {
      title: "Reaction Rate Simulator",
      subtitle: "Collision Theory",
      topics: ["Concentration", "Temperature", "Catalysts"],
      route: "/games/lab/chemistry/kinetics",
      accent: "#22c55e",
      icon: Activity,
    },
    {
      title: "Electrolysis Experiment",
      subtitle: "Electrochemistry",
      topics: ["Electrodes", "Charge Transfer", "Gas Evolution"],
      route: "/games/lab/chemistry/electro",
      accent: "#3b82f6",
      icon: Zap,
    },
  ];

  return (
    <LabCategory
      title="Chemistry Laboratory"
      subtitle="Perform virtual experiments and explore the fascinating world of chemical reactions."
      experiments={experiments}
    />
  );
}