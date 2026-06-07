import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import "../../styles/LabCategory.css";

export default function LabCategory({
  title,
  subtitle,
  stats = [],
  experiments = [],
}) {
  const nav = useNavigate();

  return (
    <div className="lab-category-page">

      <div className="lab-bg-glow glow-left"></div>
      <div className="lab-bg-glow glow-right"></div>

      {/* Header */}

      <div className="lab-category-header">

        <h1>{title}</h1>

        <p>{subtitle}</p>

        <div className="lab-stats">

          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-chip"
            >
              {stat}
            </div>
          ))}

        </div>

      </div>

      {/* Experiments */}

      <div className="experiment-grid">

        {experiments.map((exp) => {
          const Icon = exp.icon;

          return (
            <motion.div
              key={exp.title}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              transition={{
                duration: 0.2,
              }}
              className="experiment-card"
            >
              <div
                className="experiment-icon"
                style={{
                  background: `
                  linear-gradient(
                    135deg,
                    ${exp.accent},
                    ${exp.accent}cc
                  )`,
                  boxShadow: `
                  0 0 35px ${exp.accent}55`,
                }}
              >
                <Icon size={42} />
              </div>

              <div className="experiment-content">

                <h2>{exp.title}</h2>

                <span>{exp.subtitle}</span>

                <ul>

                  {exp.topics.map(
                    (topic, i) => (
                      <li key={i}>
                        {topic}
                      </li>
                    )
                  )}

                </ul>

              </div>

              <button
                className="launch-experiment-btn"
                onClick={() =>
                  nav(exp.route)
                }
              >
                Launch Experiment
                <ArrowRight size={18} />
              </button>

            </motion.div>
          );
        })}

      </div>

    </div>
  );
}