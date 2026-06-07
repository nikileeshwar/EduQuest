// Login.jsx
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../state/AuthContext";

import {
  User,
  School,
  MapPin,
  ArrowRight,
  Info,
} from "lucide-react";

import "./Login.css";

export default function Login() {
  const auth = useAuth?.();
  const nav = useNavigate();

  if (!auth) {
    return (
      <div className="login-loading">
        <h2>AuthProvider not mounted</h2>
      </div>
    );
  }

  const { login } = auth;

  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [place, setPlace] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = useCallback(
    (e) => {
      e.preventDefault();

      setErr("");

      if (!name.trim() || !school.trim()) {
        setErr("Please enter both name and school.");
        return;
      }

      const payload = {
        name: name.trim(),
        school: school.trim(),
        place: place.trim(),
      };

      login(payload);
      nav("/", { replace: true });
    },
    [name, school, place, login, nav]
  );

  return (
    <div className="login-page">

      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>
      <div className="bg-glow glow-3"></div>

      <div className="login-layout">

        {/* LEFT SIDE */}

        <section className="left-panel">

          <div className="magic-line"></div>

          <div className="brand-wrap">

            <h1 className="brand-title">
              EduQuest
            </h1>

            <p className="brand-subtitle">
              A QUIZ ADVENTURE
            </p>

            <div className="left-content">

              <h2>
                Learn • Think • Compete
              </h2>

              <p>
                Explore quizzes, labs and games designed
                to make learning engaging, interactive
                and rewarding for every student.
              </p>

            </div>

          </div>

        </section>

        {/* RIGHT SIDE */}

        <section className="right-panel">

          <form
            className="glass-card"
            onSubmit={handleLogin}
          >

            <h2 className="welcome-title">
              Welcome!!
            </h2>

            <p className="welcome-subtitle">
              Ready to challenge yourself today?
            </p>

            {err && (
              <div className="error-box">
                {err}
              </div>
            )}

            <label>
              Student Name
            </label>

            <div className="input-wrap">
              <User size={20} />
              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your name"
              />
            </div>

            <label>
              School Name
            </label>

            <div className="input-wrap">
              <School size={20} />
              <input
                value={school}
                onChange={(e) =>
                  setSchool(e.target.value)
                }
                placeholder="Enter school name"
              />
            </div>

            <label>
              Place
            </label>

            <div className="input-wrap">
              <MapPin size={20} />
              <input
                value={place}
                onChange={(e) =>
                  setPlace(e.target.value)
                }
                placeholder="Enter your place"
              />
            </div>
                        <button
              type="submit"
              className="login-btn"
            >
              Start Journey
              <ArrowRight size={20} />
            </button>

            <div className="bottom-actions">

              <button
                type="button"
                className="about-btn"
                onClick={() => {
  console.log("about clicked");
  nav("/about");
}}
                title="About EduQuest"
              >
                <Info size={20} />
              </button>

            </div>

          </form>

        </section>

      </div>
    </div>
  );
}