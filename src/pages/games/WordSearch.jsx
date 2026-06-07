import React, { useEffect, useState } from "react";
import GameShell, { GameButton, GameOverlay, GamePanel, GameProgress, GameStat } from "../../components/games/GameShell.jsx";

const WORDS = ["APPLE", "BANANA", "SCHOOL", "REACT", "QUIZ", "GAME", "WATER", "EARTH"];

function createGrid(size, words) {
  const grid = Array.from({ length: size }, () => Array(size).fill(null));
  const placements = [];
  const dirs = [[1, 0], [0, 1], [1, 1], [-1, 1]];

  function canPlace(w, x, y, dx, dy) {
    for (let i = 0; i < w.length; i++) {
      const nx = x + dx * i;
      const ny = y + dy * i;
      if (nx < 0 || ny < 0 || nx >= size || ny >= size) return false;
      if (grid[ny][nx] && grid[ny][nx] !== w[i]) return false;
    }
    return true;
  }

  words.forEach((w) => {
    for (let a = 0; a < 200; a++) {
      const [dx, dy] = dirs[Math.floor(Math.random() * dirs.length)];
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (canPlace(w, x, y, dx, dy)) {
        for (let i = 0; i < w.length; i++) grid[y + dy * i][x + dx * i] = w[i];
        placements.push({ word: w, x, y, dx, dy, len: w.length });
        break;
      }
    }
  });

  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++)
      if (!grid[y][x]) grid[y][x] = String.fromCharCode(65 + Math.floor(Math.random() * 26));

  return { grid, placements };
}

export default function WordSearch() {
  const [gridObj] = useState(() => createGrid(10, WORDS));
  const [found, setFound] = useState([]);
  const [sel, setSel] = useState([]);
  const [timeLeft, setTimeLeft] = useState(90);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 || won) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, won]);

  function toggle(x, y) {
    setSel((prev) => {
      const exists = prev.some((c) => c.x === x && c.y === y);
      return exists ? prev.filter((c) => !(c.x === x && c.y === y)) : [...prev, { x, y }];
    });
  }

  function confirm() {
    if (!sel.length) return;
    for (const p of gridObj.placements) {
      if (found.includes(p.word)) continue;
      const coords = Array.from({ length: p.len }, (_, i) => ({ x: p.x + p.dx * i, y: p.y + p.dy * i }));
      const rev = coords.slice().reverse();
      const match = (a, b) => a.length === b.length && a.every((c, i) => c.x === b[i].x && c.y === b[i].y);
      if (match(coords, sel) || match(rev, sel)) {
        const next = [...found, p.word];
        setFound(next);
        setSel([]);
        if (next.length === WORDS.length) setWon(true);
        return;
      }
    }
    setSel([]);
  }

  function reset() {
    setFound([]);
    setSel([]);
    setTimeLeft(90);
    setWon(false);
  }

  const isSelected = (x, y) => sel.some((c) => c.x === x && c.y === y);
  const isFound = (x, y) =>
    gridObj.placements.some(
      (p) =>
        found.includes(p.word) &&
        Array.from({ length: p.len }).some((_, i) => p.x + p.dx * i === x && p.y + p.dy * i === y)
    );

  return (
    <GameShell
      title="Word Search"
      subtitle="Find all hidden words in the grid before time runs out."
      accent="cyan"
      headerExtra={
        <>
          <GameStat label="Found" value={`${found.length}/${WORDS.length}`} />
          <GameStat label="Time" value={`${timeLeft}s`} />
        </>
      }
      footer={
        <>
          <GameButton variant="primary" onClick={confirm}>Confirm Selection</GameButton>
          <GameButton variant="ghost" onClick={() => setSel([])}>Clear</GameButton>
          <GameButton variant="ghost" onClick={reset}>Restart</GameButton>
        </>
      }
      overlay={
        (won || timeLeft <= 0) && (
          <GameOverlay onClose={reset}>
            <h2>{won ? "All Words Found!" : "Time's Up!"}</h2>
            <p>Found {found.length} of {WORDS.length} words</p>
            <div className="game-overlay-actions">
              <GameButton variant="primary" onClick={reset}>Play Again</GameButton>
            </div>
          </GameOverlay>
        )
      }
    >
      <GamePanel style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 160px", gap: 16, minHeight: 0 }}>
        <div style={{ overflow: "auto", display: "flex", justifyContent: "center" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 32px)", gap: 4 }}>
            {gridObj.grid.map((row, y) =>
              row.map((ch, x) => (
                <button
                  key={`${x}-${y}`}
                  type="button"
                  className="game-cell"
                  style={{
                    width: 32,
                    height: 32,
                    fontSize: 13,
                    background: isFound(x, y) ? "rgba(34,197,94,0.25)" : isSelected(x, y) ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.04)",
                  }}
                  onClick={() => toggle(x, y)}
                >
                  {ch}
                </button>
              ))
            )}
          </div>
        </div>
        <div>
          <GameProgress current={found.length} total={WORDS.length} />
          <ul style={{ listStyle: "none", padding: 0, marginTop: 12, fontSize: 12 }}>
            {WORDS.map((w) => (
              <li key={w} style={{ padding: "4px 0", opacity: found.includes(w) ? 0.4 : 1, textDecoration: found.includes(w) ? "line-through" : "none" }}>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </GamePanel>
    </GameShell>
  );
}
