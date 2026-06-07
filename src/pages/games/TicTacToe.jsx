import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import GameShell, { GameButton, GameOverlay, GamePanel, GameStat } from "../../components/games/GameShell.jsx";

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function findWinner(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  if (board.every(Boolean)) return { winner: "draw", line: [] };
  return null;
}

function minimax(board, depth, isMax, alpha, beta) {
  const res = findWinner(board);
  if (res) {
    if (res.winner === "O") return { score: 10 - depth };
    if (res.winner === "X") return { score: depth - 10 };
    return { score: 0 };
  }
  const empty = board.map((v, i) => (v ? null : i)).filter((v) => v !== null);
  if (isMax) {
    let best = { score: -Infinity, index: null };
    for (const i of empty) {
      const nb = [...board];
      nb[i] = "O";
      const r = minimax(nb, depth + 1, false, alpha, beta);
      if (r.score > best.score) best = { score: r.score, index: i };
      alpha = Math.max(alpha, r.score);
      if (beta <= alpha) break;
    }
    return best;
  }
  let best = { score: Infinity, index: null };
  for (const i of empty) {
    const nb = [...board];
    nb[i] = "X";
    const r = minimax(nb, depth + 1, true, alpha, beta);
    if (r.score < best.score) best = { score: r.score, index: i };
    beta = Math.min(beta, r.score);
    if (beta <= alpha) break;
  }
  return best;
}

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [moves, setMoves] = useState(0);
  const [winInfo, setWinInfo] = useState(null);

  useEffect(() => setWinInfo(findWinner(board)), [board]);

  function reset() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setMoves(0);
    setWinInfo(null);
  }

  function handleClick(i) {
    if (winInfo || board[i] || !xIsNext) return;
    const nb = [...board];
    nb[i] = "X";
    setBoard(nb);
    setXIsNext(false);
    setMoves((m) => m + 1);
  }

  useEffect(() => {
    if (xIsNext || winInfo) return;
    const t = setTimeout(() => {
      const empty = board.map((v, i) => (v ? null : i)).filter((v) => v !== null);
      if (!empty.length) return;
      const best = minimax(board, 0, true, -Infinity, Infinity);
      const idx = best.index ?? empty[0];
      if (board[idx] === null) {
        const nb = [...board];
        nb[idx] = "O";
        setBoard(nb);
        setXIsNext(true);
        setMoves((m) => m + 1);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [board, xIsNext, winInfo]);

  const status = winInfo
    ? winInfo.winner === "draw"
      ? "It's a draw!"
      : `${winInfo.winner} wins!`
    : `${xIsNext ? "Your turn (X)" : "AI thinking…"}`;

  const showConfetti = winInfo?.winner === "X";

  return (
    <GameShell
      title="Tic Tac Toe"
      subtitle="Play against an unbeatable AI. Can you force a draw?"
      accent="purple"
      headerExtra={
        <>
          <GameStat label="Moves" value={moves} />
          <GameStat label="Status" value={status.length > 18 ? "Playing…" : status} />
        </>
      }
      footer={
        <GameButton variant="primary" onClick={reset}>
          Restart Game
        </GameButton>
      }
      overlay={
        winInfo && (
          <GameOverlay onClose={reset}>
            <h2>{winInfo.winner === "draw" ? "Draw!" : winInfo.winner === "X" ? "You Win!" : "AI Wins"}</h2>
            <p>{status}</p>
            <div className="game-overlay-actions">
              <GameButton variant="primary" onClick={reset}>Play Again</GameButton>
            </div>
          </GameOverlay>
        )
      }
    >
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} style={{ position: "fixed", inset: 0, zIndex: 300 }} />}
      <GamePanel className="game-panel-centered">
        <div className="game-grid-3">
          {board.map((cell, i) => {
            const isWin = winInfo?.line?.includes(i);
            return (
              <button
                key={i}
                type="button"
                className={`game-cell${isWin ? " win" : ""}`}
                onClick={() => handleClick(i)}
                disabled={!!winInfo || !xIsNext || !!cell}
                style={{
                  color: cell === "X" ? "#fca5a5" : cell === "O" ? "#86efac" : "rgba(255,255,255,0.2)",
                }}
              >
                {cell || ""}
              </button>
            );
          })}
        </div>
      </GamePanel>
    </GameShell>
  );
}
