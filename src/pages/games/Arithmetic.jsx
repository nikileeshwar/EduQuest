import React, { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import GameShell, {
  GameButton,
  GameOverlay,
  GamePanel,
  GameProgress,
  GameStat,
} from "../../components/games/GameShell.jsx";

const OPERATORS = { add: "+", sub: "-", mul: "×", div: "÷" };
const TOTAL_QUESTIONS = 15;

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeProblem() {
  const ops = ["add", "sub", "mul", "div"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a = randInt(0, 12);
  let b = randInt(1, 12);
  let answer;
  if (op === "div") {
    answer = randInt(0, 12);
    b = randInt(1, 12);
    a = answer * b;
  } else {
    if (op === "sub" && a < b) [a, b] = [b, a];
    answer = op === "add" ? a + b : op === "sub" ? a - b : a * b;
  }
  return { a, b, op, answer, text: `${a} ${OPERATORS[op]} ${b}` };
}

export default function Arithmetic() {
  const [problem, setProblem] = useState(makeProblem);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeSec, setTimeSec] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => inputRef.current?.focus(), [problem]);
  useEffect(() => {
    const id = setInterval(() => setTimeSec((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  function nextQuestion(finalScore) {
    if (qIndex >= TOTAL_QUESTIONS - 1) {
      setFinished(true);
      if (finalScore > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
      return;
    }
    setQIndex((i) => i + 1);
    setProblem(makeProblem());
    setInput("");
    setFeedback(null);
  }

  function submit(e) {
    e?.preventDefault();
    if (finished || input.trim() === "") return;
    const parsed = Number(input.trim());
    const correct = parsed === problem.answer;
    const newScore = correct ? score + 1 : Math.max(0, score - 1);
    setScore(newScore);
    setFeedback(correct ? "correct" : "wrong");
    setTimeout(() => nextQuestion(newScore), correct ? 600 : 900);
  }

  function skip() {
    if (finished) return;
    const newScore = Math.max(0, score - 1);
    setScore(newScore);
    setFeedback("skip");
    setTimeout(() => nextQuestion(newScore), 500);
  }

  return (
    <GameShell
      title="Arithmetic Challenge"
      subtitle="Solve 15 quick math problems. Correct answers earn points."
      accent="orange"
      headerExtra={
        <>
          <GameStat label="Score" value={score} />
          <GameStat label="Time" value={formatTime(timeSec)} />
          <GameStat label="Question" value={`${Math.min(qIndex + 1, TOTAL_QUESTIONS)}/${TOTAL_QUESTIONS}`} />
        </>
      }
      footer={
        !finished && (
          <GameButton variant="ghost" onClick={skip}>
            Skip (−1)
          </GameButton>
        )
      }
      overlay={
        finished && (
          <GameOverlay>
            <h2>Game Complete!</h2>
            <p>
              You scored {score} out of {TOTAL_QUESTIONS}
            </p>
            <div className="game-overlay-actions">
              <GameButton
                variant="primary"
                onClick={() => {
                  setScore(0);
                  setQIndex(0);
                  setTimeSec(0);
                  setFinished(false);
                  setProblem(makeProblem());
                  setInput("");
                }}
              >
                Play Again
              </GameButton>
            </div>
          </GameOverlay>
        )
      }
    >
      {showConfetti && <Confetti recycle={false} numberOfPieces={180} style={{ position: "fixed", inset: 0, zIndex: 300 }} />}
      <GamePanel style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, justifyContent: "center" }}>
        <GameProgress current={qIndex + 1} total={TOTAL_QUESTIONS} />
        <div style={{ fontSize: 36, fontWeight: 900, margin: "12px 0" }}>{problem.text}</div>
        {feedback && (
          <span style={{ color: feedback === "correct" ? "#4ade80" : "#f87171", fontWeight: 800 }}>
            {feedback === "correct" ? "Correct! +1" : feedback === "skip" ? "Skipped −1" : "Wrong −1"}
          </span>
        )}
        <form onSubmit={submit} style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input ref={inputRef} className="game-input" value={input} readOnly placeholder="?" />
          <GameButton variant="primary" type="submit" disabled={finished}>
            Submit
          </GameButton>
        </form>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 56px)", gap: 8 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "⌫"].map((n) => (
            <button
              key={n}
              type="button"
              className="game-btn"
              disabled={finished}
              onClick={() => {
                if (n === "C") setInput("");
                else if (n === "⌫") setInput((s) => s.slice(0, -1));
                else setInput((s) => s + n);
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </GamePanel>
    </GameShell>
  );
}
