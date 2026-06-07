import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Trophy,
  Home,
  RotateCcw,
} from "lucide-react";

import "./Result.css";
import { useAuth } from "../../state/AuthContext";
import { addScoreEntry } from "../../state/leaderboard";

export default function Result() {
  const nav = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();

  if (!state) {
    nav("/");
    return null;
  }

  const { score, total, category } = state;

  useEffect(() => {
    const saveKey = `quiz_${category}_${score}_${total}`;

    if (sessionStorage.getItem(saveKey)) {
      return;
    }

    addScoreEntry({
      name: user?.name || "Anonymous",
      school: user?.school || "",
      place: user?.place || "",
      score,
      date: new Date().toISOString(),
    });

    sessionStorage.setItem(saveKey, "saved");
  }, [user, score, total, category]);

  const percentage = Math.round((score / total) * 100);
  const wrong = total - score;

  const getBadge = () => {
    if (percentage >= 90)
      return { text: "Mastermind", emoji: "🏆" };

    if (percentage >= 75)
      return { text: "Excellent", emoji: "🚀" };

    if (percentage >= 60)
      return { text: "Great Work", emoji: "⭐" };

    if (percentage >= 40)
      return { text: "Good Try", emoji: "👍" };

    return { text: "Keep Practicing", emoji: "📚" };
  };

  const badge = getBadge();

  const categoryNames = {
    gk: "General Knowledge",
    science: "Science",
    maths: "Mathematics",
    english: "English",
    computer: "Computer Science",
  };

  const formattedCategory =
    categoryNames[category] ||
    category
      ?.replace(/-/g, " ")
      ?.replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="result-page">
      <div className="result-container">

        <div className="result-header">
          <div className="hero-icon">
            <Trophy size={32} />
          </div>

          <div>
            <h1 className="hero-title">
              Quiz Completed
            </h1>

            <p className="hero-category">
              {formattedCategory}
            </p>
          </div>
        </div>

        <div className="result-content">

          <div className="score-side">

            <div className="score-ring">
              <div className="score-inner">
                <h2>{percentage}%</h2>
                <span>Score</span>
              </div>
            </div>

            <div className="badge-pill">
              <span>{badge.emoji}</span>
              <span>{badge.text}</span>
            </div>

          </div>

          <div className="stats-side">

            <div className="stat-card">
              <h3>{score}</h3>
              <span>Correct</span>
            </div>

            <div className="stat-card">
              <h3>{wrong}</h3>
              <span>Wrong</span>
            </div>

            <div className="stat-card">
              <h3>{total}</h3>
              <span>Total Questions</span>
            </div>

            <div className="stat-card">
              <h3>{percentage}%</h3>
              <span>Accuracy</span>
            </div>

          </div>

        </div>

        <div className="result-actions">

          <button
            className="result-btn primary"
            onClick={() => nav("/leaderboard")}
          >
            <Trophy size={18} />
            Leaderboard
          </button>

          <button
            className="result-btn secondary"
            onClick={() => nav(`/quiz/${category}`)}
          >
            <RotateCcw size={18} />
            Retry Quiz
          </button>

          <button
            className="result-btn secondary"
            onClick={() => nav("/")}
          >
            <Home size={18} />
            Home
          </button>

        </div>

      </div>
    </div>
  );
}