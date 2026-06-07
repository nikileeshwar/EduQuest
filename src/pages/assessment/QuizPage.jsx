import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Clock3,
  ChevronLeft,
  ChevronRight,
  Trophy,
} from "lucide-react";

import "../../styles/QuizPage.css";

import education from "../../data/education";
import aptitude from "../../data/aptitude";
import science from "../../data/science";
import gk from "../../data/generalKnowledge";
import currentAffairs from "../../data/currentAffairs";
import sports from "../../data/sports";
import cinema from "../../data/cinema";

/* ========================================
   SHUFFLE HELPER
======================================== */

const shuffleArray = (array) => {
  const arr = [...array];

  for (
    let i = arr.length - 1;
    i > 0;
    i--
  ) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [arr[i], arr[j]] = [
      arr[j],
      arr[i],
    ];
  }

  return arr;
};

/* ========================================
   COMPONENT
======================================== */

export default function QuizPage() {
  const nav = useNavigate();

  const { category } =
    useParams();

  /* ========================================
     QUESTION BANKS
  ======================================== */

  const questionBanks =
    useMemo(
      () => ({
        education,
        aptitude,
        "science-tech":
          science,
        "general-knowledge": 
          gk,
        "current-affairs":
          currentAffairs,
        sports,
        cinema,
      }),
      []
    );

  /* ========================================
     RANDOM 15 QUESTIONS
  ======================================== */

  const questions =
    useMemo(() => {
      const bank =
        questionBanks[
          category
        ] || [];

      return shuffleArray(bank)
        .slice(0, 15)
        .map((q) => ({
          ...q,

          options:
            shuffleArray(
              q.options
            ),
        }));
    }, [
      category,
      questionBanks,
    ]);

  /* ========================================
     STATES
  ======================================== */

  const [current, setCurrent] =
    useState(0);

  const [answers, setAnswers] =
    useState({});

  const [timeLeft, setTimeLeft] =
    useState(600);

  const currentQuestion =
    questions[current];
    /* ========================================
   TIMER
======================================== */

useEffect(() => {

  if (timeLeft <= 0) {
    handleSubmit();
    return;
  }

  const timer =
    setInterval(() => {

      setTimeLeft(
        (prev) => prev - 1
      );

    }, 1000);

  return () =>
    clearInterval(timer);

}, [timeLeft]);

/* ========================================
   FORMAT TIMER
======================================== */

const formatTime = (
  seconds
) => {

  const mins =
    Math.floor(
      seconds / 60
    );

  const secs =
    seconds % 60;

  return `${String(
    mins
  ).padStart(
    2,
    "0"
  )}:${String(
    secs
  ).padStart(
    2,
    "0"
  )}`;

};

/* ========================================
   SELECT ANSWER
======================================== */

const handleSelect = (
  option
) => {

  setAnswers((prev) => ({
    ...prev,

    [current]:
      option,
  }));

};

/* ========================================
   NEXT QUESTION
======================================== */

const nextQuestion = () => {

  if (
    current <
    questions.length - 1
  ) {

    setCurrent(
      (prev) =>
        prev + 1
    );

  }

};

/* ========================================
   PREVIOUS QUESTION
======================================== */

const prevQuestion = () => {

  if (current > 0) {

    setCurrent(
      (prev) =>
        prev - 1
    );

  }

};

/* ========================================
   SUBMIT QUIZ
======================================== */

const handleSubmit = () => {

  let score = 0;

  questions.forEach(
    (q, index) => {

      if (
        answers[index] ===
        q.answer
      ) {
        score++;
      }

    }
  );

  nav(`/result/${score}`, {
    state: {
      score,

      total:
        questions.length,

      category,

      answers,

      questions,
    },
  });

};

/* ========================================
   EMPTY STATE
======================================== */

if (!questions.length) {

  return (
    <div className="quiz-page">

      <div className="quiz-empty">

        <h1>
          No Questions Found
        </h1>

        <p>
          This category
          doesn't have
          questions yet.
        </p>

      </div>

    </div>
  );

}

/* ========================================
   STATS
======================================== */

const answeredCount =
  Object.keys(
    answers
  ).length;

const unansweredCount =
  questions.length -
  answeredCount;

const currentCategory =
  category
    ?.replace(/-/g, " ")
    ?.replace(
      /\b\w/g,
      (c) =>
        c.toUpperCase()
    );
    return (
  <div className="quiz-page">

    <div className="bg-glow glow-left"></div>
    <div className="bg-glow glow-right"></div>

    <div className="quiz-container">

      {/* ==========================
          HEADER
      ========================== */}

      <div className="quiz-header">

        <div>

          <h1 className="quiz-title">
            {currentCategory}
          </h1>

          <p className="quiz-subtitle">
            Question {current + 1}
            {" "}of{" "}
            {questions.length}
          </p>

        </div>

        <div className="quiz-header-right">

          <div className="status-card">

            <span className="status-number">
              {answeredCount}
            </span>

            <span className="status-label">
              Answered
            </span>

          </div>

          <div className="status-card">

            <span className="status-number">
              {unansweredCount}
            </span>

            <span className="status-label">
              Remaining
            </span>

          </div>

          <div className="timer-card">

            <Clock3 size={18} />

            <span>
              {formatTime(
                timeLeft
              )}
            </span>

          </div>

        </div>

      </div>

      {/* ==========================
          BODY
      ========================== */}

      <div className="quiz-body">

        {/* ==========================
            LEFT PANEL
        ========================== */}

        <aside className="question-panel">

          <div className="panel-heading">
            Questions
          </div>

          <div className="question-grid">

            {questions.map(
              (_, index) => (

                <button
                  key={index}
                  onClick={() =>
                    setCurrent(
                      index
                    )
                  }
                  className={`question-btn

                  ${
                    current ===
                    index
                      ? "active"
                      : ""
                  }

                  ${
                    answers[index]
                      ? "answered"
                      : ""
                  }
                `}
                >
                  {index + 1}
                </button>

              )
            )}

          </div>

          <div className="question-legend">

            <div className="legend-item">

              <span className="legend-dot current"></span>

              Current

            </div>

            <div className="legend-item">

              <span className="legend-dot done"></span>

              Answered

            </div>

          </div>

        </aside>

        {/* ==========================
            DIVIDER
        ========================== */}

        <div className="panel-divider"></div>

        {/* ==========================
            RIGHT PANEL
        ========================== */}

        <section className="quiz-panel">
          <div className="quiz-scroll">

          <div className="question-block">

            <div className="question-badge">
              Question {current + 1}
            </div>

            <h2 className="question-text">
              {
                currentQuestion.question
              }
            </h2>

          </div>

          {/* OPTIONS START BELOW */}
                    <div className="options-list">

            {currentQuestion.options.map(
              (
                option,
                index
              ) => (

                <button
                  key={index}
                  onClick={() =>
                    handleSelect(
                      option
                    )
                  }
                  className={`option-card

                  ${
                    answers[
                      current
                    ] === option
                      ? "selected"
                      : ""
                  }
                `}
                >

                  <div className="option-circle">

                    {
                      [
                        "A",
                        "B",
                        "C",
                        "D",
                      ][index]
                    }

                  </div>

                  <span className="option-text">
                    {option}
                  </span>

                </button>

              )
            )}
            </div>

          </div>

          {/* ==========================
              FOOTER
          ========================== */}

          <div className="quiz-footer">

            <button
              className="footer-btn secondary"
              onClick={
                prevQuestion
              }
              disabled={
                current === 0
              }
            >

              <ChevronLeft
                size={18}
              />

              Previous

            </button>

            {current ===
            questions.length -
              1 ? (

              <button
                className="footer-btn submit"
                onClick={() => {
                  handleSubmit();

                }}
              >

                <Trophy
                  size={18}
                />

                Submit Quiz

              </button>

            ) : (

              <button
                className="footer-btn primary"
                onClick={
                  nextQuestion
                }
              >

                Next

                <ChevronRight
                  size={18}
                />

              </button>

            )}

          </div>

        </section>

      </div>

    </div>

  </div>
);
}