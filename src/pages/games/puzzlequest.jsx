import React, { useState } from "react";
import GameShell, { GameButton, GameOverlay, GamePanel, GameStat } from "../../components/games/GameShell.jsx";

const PUZZLES = [
  {
    size: 3,
    pattern: [1, 2, 3, 4, 0, 6, 7, 5, 8],
    goal: [1, 2, 3, 4, 5, 6, 7, 8, 0],
  },
];

function countInversions(arr) {
  let inv = 0;
  for (let i = 0; i < arr.length; i++)
    for (let j = i + 1; j < arr.length; j++)
      if (arr[i] && arr[j] && arr[i] > arr[j]) inv++;
  return inv;
}

function isSolvable(board, size) {
  if (size % 2 === 1) return countInversions(board.filter(Boolean)) % 2 === 0;
  const blankRow = Math.floor(board.indexOf(0) / size);
  const inv = countInversions(board.filter(Boolean));
  return (inv + blankRow) % 2 === 1;
}

export default function PuzzleQuest() {
  const [size] = useState(3);
  const [tiles, setTiles] = useState(PUZZLES[0].pattern);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const goal = PUZZLES[0].goal;

  function reset() {
    setTiles(PUZZLES[0].pattern);
    setMoves(0);
    setWon(false);
  }

  function shuffle() {
    let shuffled;
    do {
      shuffled = goal.slice().sort(() => Math.random() - 0.5);
    } while (!isSolvable(shuffled, size) || shuffled.every((v, i) => v === goal[i]));
    setTiles(shuffled);
    setMoves(0);
    setWon(false);
  }

  function move(index) {
    if (won) return;
    const blank = tiles.indexOf(0);
    const row = Math.floor(index / size);
    const col = index % size;
    const bRow = Math.floor(blank / size);
    const bCol = blank % size;
    const adjacent = (Math.abs(row - bRow) === 1 && col === bCol) || (Math.abs(col - bCol) === 1 && row === bRow);
    if (!adjacent) return;
    const next = tiles.slice();
    [next[index], next[blank]] = [next[blank], next[index]];
    setTiles(next);
    setMoves((m) => m + 1);
    if (next.every((v, i) => v === goal[i])) setWon(true);
  }

  return (
    <GameShell
      title="Puzzle Quest"
      subtitle="Slide tiles to arrange numbers 1–8 in order."
      accent="cyan"
      headerExtra={
        <>
          <GameStat label="Moves" value={moves} />
          <GameStat label="Grid" value={`${size}×${size}`} />
        </>
      }
      footer={
        <>
          <GameButton variant="primary" onClick={shuffle}>Shuffle</GameButton>
          <GameButton variant="ghost" onClick={reset}>Reset</GameButton>
        </>
      }
      overlay={
        won && (
          <GameOverlay onClose={shuffle}>
            <h2>Puzzle Solved!</h2>
            <p>Completed in {moves} moves</p>
            <div className="game-overlay-actions">
              <GameButton variant="primary" onClick={shuffle}>Play Again</GameButton>
            </div>
          </GameOverlay>
        )
      }
    >
      <GamePanel className="game-panel-centered">
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${size}, 80px)`, gap: 8 }}>
          {tiles.map((val, i) => (
            <button
              key={i}
              type="button"
              className="game-cell"
              style={{
                width: 80,
                height: 80,
                fontSize: 24,
                visibility: val === 0 ? "hidden" : "visible",
                cursor: val === 0 ? "default" : "pointer",
              }}
              onClick={() => move(i)}
              disabled={val === 0}
            >
              {val || ""}
            </button>
          ))}
        </div>
      </GamePanel>
    </GameShell>
  );
}
