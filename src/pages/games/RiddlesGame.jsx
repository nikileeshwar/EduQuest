import React, { useState } from "react";
import GameShell, {
  GameButton,
  GameOverlay,
  GamePanel,
  GameProgress,
  GameStat,
} from "../../components/games/GameShell.jsx";

const ALL_RIDDLES = [
  { q: "What has keys but can't open locks?", a: "piano", hint: "It makes music." },
  { q: "The more you take, the more you leave behind. What am I?", a: "footsteps", hint: "Walking leaves these." },
  { q: "What gets wetter the more it dries?", a: "towel", hint: "Used after a bath." },
  { q: "What has a face and two hands but no arms or legs?", a: "clock", hint: "It tells time." },
  { q: "What has to be broken before you can use it?", a: "egg", hint: "Breakfast food." },
  { q: "What goes up but never comes down?", a: "age", hint: "Increases each birthday." },
];

function pickN(arr, n) {
  return arr.slice().sort(() => Math.random() - 0.5).slice(0, n);
}

export default function RiddlesGame() {
  const [rounds] = useState(() => pickN(ALL_RIDDLES, 5));
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);

  const current = rounds[index];

  function submit(e) {
    e?.preventDefault();
    if (finished) return;
    const correct = answer.trim().toLowerCase() === current.a.toLowerCase();
    const pts = correct ? (hintUsed ? 1 : 2) : 0;
    setScore((s) => s + pts);
    setFeedback(correct ? "correct" : "wrong");
    setTimeout(() => {
      if (index >= rounds.length - 1) setFinished(true);
      else {
        setIndex((i) => i + 1);
        setAnswer("");
        setHintUsed(false);
        setFeedback(null);
      }
    }, 900);
  }

  function reset() {
    setIndex(0);
    setAnswer("");
    setScore(0);
    setHintUsed(false);
    setFeedback(null);
    setFinished(false);
  }

  return (
    <GameShell
      title="Riddle Quest"
      subtitle="Solve brain teasers — hints reduce your points."
      accent="pink"
      headerExtra={
        <>
          <GameStat label="Score" value={score} />
          <GameStat label="Riddle" value={`${index + 1}/${rounds.length}`} />
        </>
      }
      footer={
        !finished && (
          <>
            <GameButton variant="ghost" onClick={() => setHintUsed(true)} disabled={hintUsed}>
              {hintUsed ? "Hint shown" : "Show Hint"}
            </GameButton>
            <GameButton variant="primary" onClick={submit}>Submit</GameButton>
          </>
        )
      }
      overlay={
        finished && (
          <GameOverlay onClose={reset}>
            <h2>Riddles Complete!</h2>
            <p>Final score: {score} / {rounds.length * 2}</p>
            <div className="game-overlay-actions">
              <GameButton variant="primary" onClick={reset}>Play Again</GameButton>
            </div>
          </GameOverlay>
        )
      }
    >
      <GamePanel style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, maxWidth: 560, margin: "0 auto", width: "100%" }}>
        <GameProgress current={index + 1} total={rounds.length} />
        <p style={{ fontSize: 20, fontWeight: 800, textAlign: "center", lineHeight: 1.5 }}>{current.q}</p>
        {hintUsed && (
          <p style={{ fontSize: 13, color: "#a78bfa", fontStyle: "italic" }}>Hint: {current.hint}</p>
        )}
        {feedback && (
          <span style={{ color: feedback === "correct" ? "#4ade80" : "#f87171", fontWeight: 800 }}>
            {feedback === "correct" ? "Correct!" : `Answer: ${current.a}`}
          </span>
        )}
        <form onSubmit={submit} style={{ width: "100%", display: "flex", gap: 10, justifyContent: "center" }}>
          <input
            className="game-input"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer"
            disabled={finished}
            style={{ maxWidth: 280, fontSize: 16 }}
          />
        </form>
      </GamePanel>
    </GameShell>
  );
}
