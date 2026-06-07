// src/pages/BiologyLab.jsx

import React from "react";
import { User, Microscope, Trees } from "lucide-react";
import LabCategory from "../LabCategory.jsx";

export default function BiologyLab() {
  const experiments = [
    {
      title: "Human Body Explorer",
      subtitle: "Human Anatomy",
      topics: ["Organs", "Body Systems", "Functions"],
      route: "/games/lab/biology/humanbody",
      accent: "#ef4444",
      icon: User,
    },
    {
      title: "Cell Explorer",
      subtitle: "Cell Biology",
      topics: ["Organelles", "Cell Functions", "Microscopy"],
      route: "/games/lab/biology/cell",
      accent: "#22c55e",
      icon: Microscope,
    },
    {
      title: "Food Chain Simulator",
      subtitle: "Ecology",
      topics: ["Producers", "Consumers", "Food Webs"],
      route: "/games/lab/biology/foodchain",
      accent: "#3b82f6",
      icon: Trees,
    },
  ];

  return (
    <LabCategory
      title="Biology Laboratory"
      subtitle="Explore cells, body systems, and ecosystems through simulations."
      experiments={experiments}
    />
  );
}