import React, { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import GameShell, { GameButton, GameOverlay, GamePanel, GameStat } from "../../components/games/GameShell.jsx";

const SYMBOLS = ["🍎", "🍌", "🍇", "🍒", "🥝", "🏛️"];

function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function makeDeck() {
  return shuffle(
    SYMBOLS.flatMap((s, i) => [
      { id: `${i}-A`, symbol: s, matched: false },
      { id: `${i}-B`, symbol: s, matched: false },
    ])
  );
}

export default function VisualMemory() {
  const [cards, setCards] = useState(makeDeck);
  const [flipped, setFlipped] = useState([]);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [won, setWon] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (running && !timerRef.current) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (cards.every((c) => c.matched)) {
      setWon(true);
      setRunning(false);
    }
  }, [cards]);

  function reset() {
    setCards(makeDeck());
    setFlipped([]);
    setLocked(false);
    setMoves(0);
    setSeconds(0);
    setRunning(false);
    setWon(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }

  function flip(id) {
    if (locked || won) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.matched || flipped.includes(id)) return;
    if (!running) setRunning(true);

    const next = [...flipped, id];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);
      setLocked(true);
      const [a, b] = next.map((fid) => cards.find((c) => c.id === fid));
      if (a.symbol === b.symbol) {
        setCards((prev) =>
          prev.map((c) => (c.id === a.id || c.id === b.id ? { ...c, matched: true } : c))
        );
        setFlipped([]);
        setLocked(false);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 700);
      }
    }
  }

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <GameShell
      title="Visual Memory"
      subtitle="Match all 6 pairs with the fewest moves."
      accent="green"
      headerExtra={
        <>
          <GameStat label="Moves" value={moves} />
          <GameStat label="Time" value={fmt(seconds)} />
          <GameStat label="Pairs" value={`${cards.filter((c) => c.matched).length / 2}/6`} />
        </>
      }
      footer={<GameButton variant="primary" onClick={reset}>Restart</GameButton>}
      overlay={
        won && (
          <GameOverlay onClose={reset}>
            <h2>You Win!</h2>
            <p>{moves} moves in {fmt(seconds)}</p>
            <div className="game-overlay-actions">
              <GameButton variant="primary" onClick={reset}>Play Again</GameButton>
            </div>
          </GameOverlay>
        )
      }
    >
      {won && <Confetti recycle={false} numberOfPieces={200} style={{ position: "fixed", inset: 0, zIndex: 300 }} />}
      <GamePanel className="game-panel-centered">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 72px)", gap: 10 }}>
          {cards.map((card) => {
            const show = card.matched || flipped.includes(card.id);
            return (
              <button
                key={card.id}
                type="button"
                className="game-cell"
                style={{ fontSize: 28, background: show ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)" }}
                onClick={() => flip(card.id)}
              >
                {show ? card.symbol : "?"}
              </button>
            );
          })}
        </div>
      </GamePanel>
    </GameShell>
  );
}
