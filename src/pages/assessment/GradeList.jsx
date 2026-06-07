import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/GradeList.css";

import {
  BookOpen,
  Brain,
  Cpu,
  Globe,
  Newspaper,
  Trophy,
  Film,
  ArrowRight,
} from "lucide-react";

export default function GradeList() {
  const nav = useNavigate();

  const cards = [
    {
      title: "Education",
      subtitle: "Maths • Science • English",
      icon: BookOpen,
      color: "#8b5cf6",
      route: "/quiz/education",
      className: "education",
    },
    {
      title: "Aptitude",
      subtitle: "Quantitative • Logical",
      icon: Brain,
      color: "#06b6d4",
      route: "/quiz/aptitude",
      className: "aptitude",
    },
    {
      title: "Science & Tech",
      subtitle: "AI • Robotics • Space",
      icon: Cpu,
      color: "#10b981",
      route: "/quiz/science-tech",
      className: "science",
    },
    {
      title: "General Knowledge",
      subtitle: "World Knowledge • India Facts",
      icon: Globe,
      color: "#f59e0b",
      route: "/quiz/general-knowledge",
      className: "general-knowledge",
    },
    {
      title: "Current Affairs",
      subtitle: "India • Global Affairs",
      icon: Newspaper,
      color: "#ef4444",
      route: "/quiz/current-affairs",
      className: "current-affairs",
    },
    {
      title: "Sports",
      subtitle: "National • Olympics",
      icon: Trophy,
      color: "#3b82f6",
      route: "/quiz/sports",
      className: "sports",
    },
    {
      title: "Cinema & Entertainment",
      subtitle: "Movies • Awards",
      icon: Film,
      color: "#ec4899",
      route: "/quiz/cinema",
      className: "cinema",
    },
  ];

  return (
    <div className="stream-page">

      <div className="stream-glow glow-left"></div>
      <div className="stream-glow glow-right"></div>

      <div
        className="header"
        style={{
          marginTop: 80,
          fontSize: 32,
          fontWeight: 800,
        }}
      >
        <h1>Choose Stream</h1>
        <p>Pick a category to begin</p>
      </div>

      <div className="stream-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`stream-card ${card.className}`}
              onClick={() => nav(card.route)}
            >
              <div
                className="icon-box"
                style={{ color: card.color }}
              >
                <Icon size={34} />
              </div>

              <div className="card-content">
                <h2>{card.title}</h2>
                <span>{card.subtitle}</span>
              </div>

              <ArrowRight
                size={20}
                className="arrow"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}