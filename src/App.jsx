import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { useLang } from "./state/LangContext";
import { AuthProvider } from "./state/AuthContext";
import { ThemeProvider } from "./state/ThemeContext";

import TopBar from "./components/TopBar";
import Particles from "./components/Particles";
import Confetti from "./components/Confetti";
import PrivateRoute from "./components/PrivateRoute";

// Dashboard
import Front from "./pages/dashboard/Front.jsx";
import Login from "./pages/dashboard/Login.jsx";
import Leaderboard from "./pages/dashboard/Leaderboard.jsx";
import About from "./pages/dashboard/About.jsx";

// Assessment

import GradeList from "./pages/assessment/GradeList.jsx";
import QuizPage from "./pages/assessment/QuizPage";
import Result from "./pages/assessment/Result.jsx";

// Games
import Games from "./pages/games/GameHub.jsx";
import TicTacToe from "./pages/games/TicTacToe.jsx";
import ArithmeticA from "./pages/games/Arithmetic.jsx";
import VisualMemory from "./pages/games/VisualMemory.jsx";
import PuzzleQuest from "./pages/games/PuzzleQuest.jsx";
import Sudoku from "./pages/games/Sudoku.jsx";
import RiddlesGame from "./pages/games/RiddlesGame.jsx";
import WordSearch from "./pages/games/WordSearch.jsx";

// Lab Home Pages
import LabGames from "./pages/lab/LabHome.jsx";
import PhysicsLab from "./pages/lab/physics/PhysicsLab.jsx";
import ChemistryLab from "./pages/lab/chemistry/ChemistryLab.jsx";
import BiologyLab from "./pages/lab/biology/BiologyLab.jsx";

// Physics Experiments
const PendulumPro = lazy(() =>
  import("./pages/lab/physics/PendulumPro.jsx")
);

const SpringMass = lazy(() =>
  import("./pages/lab/physics/SpringMass.jsx")
);

const ProjectileLab = lazy(() =>
  import("./pages/lab/physics/CircuitLab.jsx")
);

// Chemistry Experiments
const Titration = lazy(() =>
  import("./pages/lab/chemistry/Titration.jsx")
);

const ReactionKinetics = lazy(() =>
  import("./pages/lab/chemistry/ReactionKinetics.jsx")
);

const Electrochemistry = lazy(() =>
  import("./pages/lab/chemistry/Electrochemistry.jsx")
);

// Biology Experiments
const CellExplorer = lazy(() =>
  import("./pages/lab/biology/CellExplorer.jsx")
);

const EcosystemSim = lazy(() =>
  import("./pages/lab/biology/EcosystemSim.jsx")
);

const GeneticsPlay = lazy(() =>
  import("./pages/lab/biology/GeneticsPlay.jsx")
);

// Loader
function LoaderFallback() {
  return (
    <div style={{ padding: 28, color: "#fff" }}>
      <h3>Loading...</h3>
      <p>Please wait while the lab loads.</p>
    </div>
  );
}

export default function App() {
  // ensure language provider side-effects run if available
  useLang?.();

  const location = useLocation();

  // Hide TopBar only on login page
  const hideTopBar = location.pathname === "/login";

  return (
    <ThemeProvider>
      <div
        className="app-root"
        style={{
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <Particles />
        <Confetti />

        <AuthProvider>
          {!hideTopBar && <TopBar />}

          <main style={{ marginTop: hideTopBar ? 0 : 24 }}>
            <Routes>
                            {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/quiz/:category" element={<QuizPage />} />

              {/* Lab Hub */}
              <Route path="/games/lab" element={<LabGames />} />
              <Route path="/games/lab/:labId" element={<LabGames />} />

              {/* Lab Home Pages */}
              <Route
                path="/games/lab/physics"
                element={
                  <PrivateRoute>
                    <PhysicsLab />
                  </PrivateRoute>
                }
              />

              <Route
                path="/games/lab/chemistry"
                element={
                  <PrivateRoute>
                    <ChemistryLab />
                  </PrivateRoute>
                }
              />

              <Route
                path="/games/lab/biology"
                element={
                  <PrivateRoute>
                    <BiologyLab />
                  </PrivateRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Front />
                  </PrivateRoute>
                }
              />

              <Route
                path="/grades"
                element={
                  <PrivateRoute>
                    <GradeList />
                  </PrivateRoute>
                }
              />


              <Route
                path="/result/:score"
                element={
                  <PrivateRoute>
                    <Result />
                  </PrivateRoute>
                }
              />

              {/* Games */}
              <Route
                path="/games"
                element={
                  <PrivateRoute>
                    <Games />
                  </PrivateRoute>
                }
              />

              <Route
                path="/games/tictactoe"
                element={
                  <PrivateRoute>
                    <TicTacToe />
                  </PrivateRoute>
                }
              />

              <Route
                path="/games/arithmetica"
                element={
                  <PrivateRoute>
                    <ArithmeticA />
                  </PrivateRoute>
                }
              />

              <Route
                path="/games/visualmemory"
                element={
                  <PrivateRoute>
                    <VisualMemory />
                  </PrivateRoute>
                }
              />

              <Route
                path="/games/wordsearch"
                element={
                  <PrivateRoute>
                    <WordSearch />
                  </PrivateRoute>
                }
              />

              <Route
                path="/games/puzzlequest"
                element={
                  <PrivateRoute>
                    <PuzzleQuest />
                  </PrivateRoute>
                }
              />

              <Route
                path="/games/sudoku"
                element={
                  <PrivateRoute>
                    <Sudoku />
                  </PrivateRoute>
                }
              />

              <Route
                path="/games/riddles"
                element={
                  <PrivateRoute>
                    <RiddlesGame />
                  </PrivateRoute>
                }
              />

              {/* Physics Experiments */}
              <Route
                path="/games/lab/physics/pendulum"
                element={
                  <PrivateRoute>
                    <Suspense fallback={<LoaderFallback />}>
                      <PendulumPro />
                    </Suspense>
                  </PrivateRoute>
                }
              />

              <Route
                path="/games/lab/physics/springmass"
                element={
                  <PrivateRoute>
                    <Suspense fallback={<LoaderFallback />}>
                      <SpringMass />
                    </Suspense>
                  </PrivateRoute>
                }
              />

              <Route
                path="/games/lab/physics/projectile"
                element={
                  <PrivateRoute>
                    <Suspense fallback={<LoaderFallback />}>
                      <ProjectileLab />
                    </Suspense>
                  </PrivateRoute>
                }
              />

              {/* Chemistry Experiments */}
              <Route
                path="/games/lab/chemistry/titration"
                element={
                  <PrivateRoute>
                    <Suspense fallback={<LoaderFallback />}>
                      <Titration />
                    </Suspense>
                  </PrivateRoute>
                }
              />

              <Route
                path="/games/lab/chemistry/kinetics"
                element={
                  <PrivateRoute>
                    <Suspense fallback={<LoaderFallback />}>
                      <ReactionKinetics />
                    </Suspense>
                  </PrivateRoute>
                }
              />

              <Route
                path="/games/lab/chemistry/electro"
                element={
                  <PrivateRoute>
                    <Suspense fallback={<LoaderFallback />}>
                      <Electrochemistry />
                    </Suspense>
                  </PrivateRoute>
                }
              />

              {/* Biology Experiments */}
              <Route
                path="/games/lab/biology/cell"
                element={
                  <PrivateRoute>
                    <Suspense fallback={<LoaderFallback />}>
                      <CellExplorer />
                    </Suspense>
                  </PrivateRoute>
                }
              />

              <Route
                path="/games/lab/biology/ecosystem"
                element={
                  <PrivateRoute>
                    <Suspense fallback={<LoaderFallback />}>
                      <EcosystemSim />
                    </Suspense>
                  </PrivateRoute>
                }
              />

              <Route
                path="/games/lab/biology/genetics"
                element={
                  <PrivateRoute>
                    <Suspense fallback={<LoaderFallback />}>
                      <GeneticsPlay />
                    </Suspense>
                  </PrivateRoute>
                }
              />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <div style={{ padding: 28, color: "#fff" }}>
                    <h2>404 — Page not found</h2>
                  </div>
                }
              />
                          </Routes>
          </main>
        </AuthProvider>
      </div>
    </ThemeProvider>
  );
}