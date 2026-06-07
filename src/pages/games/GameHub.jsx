import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Puzzle,
  Calculator,
  Eye,
  HelpCircle,
} from "lucide-react";

import { useLang } from "../../state/LangContext";
import "../../styles/GameHub.css";

const BASE_GAMES = [
  {
    id: "tictactoe",
    path: "/games/tictactoe",
    color: "linear-gradient(135deg,#ff8aa0,#ff6b9a)",
    icon: <Puzzle size={40} />,
  },
  {
    id: "riddles",
    path: "/games/riddles",
    color: "linear-gradient(135deg,#34d399,#059669)",
    icon: <HelpCircle size={40} />,
  },
  {
    id: "visualmemory",
    path: "/games/visualmemory",
    color: "linear-gradient(135deg,#a78bfa,#7c3aed)",
    icon: <Eye size={40} />,
  },
  {
    id: "puzzlequest",
    path: "/games/puzzlequest",
    color: "linear-gradient(135deg,#f97316,#fb923c)",
    icon: <Puzzle size={40} />,
  },
  {
    id: "sudoku",
    path: "/games/sudoku",
    color: "linear-gradient(135deg,#34d399,#059669)",
    icon: <span style={{ fontSize: 34 }}>🧩</span>,
  },
  {
    id: "arithmetica",
    path: "/games/arithmetica",
    color: "linear-gradient(135deg,#7dd3fc,#4cc9f0)",
    icon: <Calculator size={40} />,
  },
];

export default function Games() {
  const nav = useNavigate();
  const { t } = useLang();

  const idToKey = {
    tictactoe: "tic_tac_toe",
    riddles: "riddles_game",
    visualmemory: "visual_memory",
    puzzlequest: "puzzlequest",
    sudoku: "sudoku",
    arithmetica: "arithmetica",
  };

  const GAMES = BASE_GAMES.map((g) => {
    const key = idToKey[g.id] || g.id;
    const translated = (t?.games && t.games[key]) || {};

    return {
      ...g,
      name: translated.title || g.id,
      subtitle: translated.subtitle || "",
      btn: t?.games?.tic_tac_toe?.btn || "Play",
    };
  });

  return (
    <div className="games-page">
      <div className="games-container">
        {/* Hero */}

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="games-hero"
        >
          <h1>Game Hub</h1>

          <p>
            Challenge your mind with fun and interactive learning games.
          </p>

          
        </motion.div>

        {/* Grid */}

        <div className="games-grid">
          {GAMES.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="game-card"
              onClick={() => nav(g.path)}
            >
              <div
                className="game-icon"
                style={{
                  background: g.color,
                }}
              >
                {g.icon}
              </div>

              <h3>{g.name}</h3>

              <p>{g.subtitle}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nav(g.path);
                }}
                style={{
                  background: g.color,
                }}
              >
                {g.btn}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}