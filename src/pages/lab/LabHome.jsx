import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap,
  Beaker,
  Leaf,
  ArrowRight,
} from "lucide-react";

import "../../styles/LabHome.css";

export default function LabHome() {
  const nav = useNavigate();

  const labs = [
    {
      id: "physics",
      title: "Physics Lab",
      subtitle: "Interactive Simulations",
      topics: [
        "Pendulum",
        "Circuit Builder",
        "Spring Oscillator",
      ],
      icon: <Zap size={42} />,
      glow: "physics",
      path: "/games/lab/physics",
    },
    {
      id: "chemistry",
      title: "Chemistry Lab",
      subtitle: "Virtual Experiments",
      topics: [
        "Titration",
        "Periodic Table",
        "Mixing Reactions",
      ],
      icon: <Beaker size={42} />,
      glow: "chemistry",
      path: "/games/lab/chemistry",
    },
    {
      id: "biology",
      title: "Biology Lab",
      subtitle: "Life Science Activities",
      topics: [
        "Food Chains",
        "Genetics",
        "Photosynthesis",
      ],
      icon: <Leaf size={42} />,
      glow: "biology",
      path: "/games/lab/biology",
    },
  ];

  return (
    <div className="lab-page">

      <div className="lab-background-glow glow-left"></div>
      <div className="lab-background-glow glow-right"></div>

      {/* Header */}

      <div className="lab-header">
        <h1>Virtual Laboratories</h1>

        <p>
          Explore Interactive Experiments &
          Simulations
        </p>

      </div>

      {/* Cards */}

      <div className="lab-grid">

        {labs.map((lab) => (
          <motion.div
            key={lab.id}
            whileHover={{
              y: -8,
              scale: 1.02,
            }}
            transition={{
              duration: 0.2,
            }}
            className={`lab-card ${lab.glow}`}
          >

            <div className="lab-icon">
              {lab.icon}
            </div>

            <div className="lab-content">

              <h2>{lab.title}</h2>

              <span>
                {lab.subtitle}
              </span>

              <ul>

                {lab.topics.map(
                  (topic, index) => (
                    <li key={index}>
                      {topic}
                    </li>
                  )
                )}

              </ul>

            </div>

            <button
              className="launch-btn"
              onClick={() =>
                nav(lab.path)
              }
            >
              Launch Lab
              <ArrowRight size={18} />
            </button>

          </motion.div>
        ))}

      </div>

    </div>
  );
}