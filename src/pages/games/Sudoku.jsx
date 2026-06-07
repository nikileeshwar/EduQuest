import React, { useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import GameShell, { GameButton, GameOverlay, GamePanel, GameStat } from "../../components/games/GameShell.jsx";

const PUZZLES = [
  {
    difficulty: "Easy",
    puzzle: [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ],
    solution: [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9],
    ],
  },
];

function copyBoard(b) {
  return b.map((r) => r.slice());
}

function isValidPlacement(board, r, c, val) {
  if (!val) return true;
  for (let x = 0; x < 9; x++) if (x !== c && board[r][x] === val) return false;
  for (let y = 0; y < 9; y++) if (y !== r && board[y][c] === val) return false;
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let y = br; y < br + 3; y++)
    for (let x = bc; x < bc + 3; x++)
      if (!(y === r && x === c) && board[y][x] === val) return false;
  return true;
}

export default function Sudoku() {
  const puzzleData = useMemo(() => PUZZLES[0], []);
  const fixedRef = useRef(puzzleData.puzzle.map((r) => r.map((v) => v !== 0)));
  const [board, setBoard] = useState(copyBoard(puzzleData.puzzle));
  const [selected, setSelected] = useState(null);
  const [solved, setSolved] = useState(false);
  const [errors, setErrors] = useState(0);

  function reset() {
    setBoard(copyBoard(puzzleData.puzzle));
    setSelected(null);
    setSolved(false);
    setErrors(0);
  }

  function handleNumber(n) {
    if (!selected || solved) return;
    const [r, c] = selected;
    if (fixedRef.current[r][c]) return;
    setBoard((b) => {
      const nb = copyBoard(b);
      nb[r][c] = n;
      return nb;
    });
  }

  function handleErase() {
    if (!selected || solved) return;
    const [r, c] = selected;
    if (fixedRef.current[r][c]) return;
    setBoard((b) => {
      const nb = copyBoard(b);
      nb[r][c] = 0;
      return nb;
    });
  }

  function handleCheck() {
    let wrong = 0;
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        if (board[r][c] !== puzzleData.solution[r][c]) wrong++;
    setErrors(wrong);
    if (wrong === 0) {
      setSolved(true);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }
  }

  function handleHint() {
    const empties = [];
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        if (!fixedRef.current[r][c] && board[r][c] !== puzzleData.solution[r][c]) empties.push([r, c]);
    if (!empties.length) return;
    const [r, c] = empties[Math.floor(Math.random() * empties.length)];
    setBoard((b) => {
      const nb = copyBoard(b);
      nb[r][c] = puzzleData.solution[r][c];
      return nb;
    });
  }

  const filled = board.flat().filter(Boolean).length;

  return (
    <GameShell
      title="Sudoku"
      subtitle={`${puzzleData.difficulty} puzzle — fill the grid with digits 1–9.`}
      accent="purple"
      headerExtra={
        <>
          <GameStat label="Filled" value={`${filled}/81`} />
          <GameStat label="Errors" value={errors || "—"} />
        </>
      }
      footer={
        <>
          <GameButton variant="ghost" onClick={handleErase}>Erase</GameButton>
          <GameButton variant="ghost" onClick={handleHint}>Hint</GameButton>
          <GameButton variant="primary" onClick={handleCheck}>Check</GameButton>
          <GameButton variant="ghost" onClick={reset}>Reset</GameButton>
        </>
      }
      overlay={
        solved && (
          <GameOverlay onClose={reset}>
            <h2>Puzzle Solved!</h2>
            <p>Perfect completion — well done!</p>
            <div className="game-overlay-actions">
              <GameButton variant="primary" onClick={reset}>Play Again</GameButton>
            </div>
          </GameOverlay>
        )
      }
    >
      <GamePanel className="game-panel-centered" style={{ flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 36px)", border: "2px solid rgba(255,255,255,0.1)", borderRadius: 8, overflow: "hidden" }}>
          {board.map((row, r) =>
            row.map((val, c) => {
              const fixed = fixedRef.current[r][c];
              const isSel = selected?.[0] === r && selected?.[1] === c;
              const valid = isValidPlacement(board, r, c, val);
              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onClick={() => setSelected([r, c])}
                  style={{
                    width: 36,
                    height: 36,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: isSel ? "rgba(139,92,246,0.25)" : fixed ? "rgba(255,255,255,0.04)" : valid ? "transparent" : "rgba(239,68,68,0.2)",
                    color: valid ? (fixed ? "#93c5fd" : "#fff") : "#fca5a5",
                    fontWeight: 800,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  {val || ""}
                </button>
              );
            })
          )}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 36px)", gap: 6 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <GameButton key={n} variant="ghost" onClick={() => handleNumber(n)} style={{ minHeight: 36, padding: 0 }}>
              {n}
            </GameButton>
          ))}
        </div>
      </GamePanel>
    </GameShell>
  );
}
