import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  FlaskConical,
  Gamepad2,
  Brain,
  Globe,
  Newspaper,
  Trophy,
  Film,
} from "lucide-react";

export default function About() {
  const nav = useNavigate();

  const features = [
    { icon: BookOpen, text: "Education" },
    { icon: Brain, text: "Aptitude & Reasoning" },
    { icon: FlaskConical, text: "Science & Technology" },
    { icon: Globe, text: "General Knowledge" },
    { icon: Newspaper, text: "Current Affairs" },
    { icon: Trophy, text: "Sports" },
    { icon: Film, text: "Cinema & Entertainment" },
    { icon: Gamepad2, text: "Games & Challenges" },
  ];

  return (
    <>
      <div className="about-page">

        <div className="glow glow1"></div>
        <div className="glow glow2"></div>

        <div className="about-card">

          <button
            className="back-btn"
            onClick={() => nav(-1)}
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="brand">
            <h1>EduQuest</h1>
            <p>A Quiz Adventure</p>
          </div>

          <div className="section">
            <h2>About EduQuest</h2>

            <p>
              EduQuest is an interactive learning platform
              designed to make education engaging through
              quizzes, logical reasoning challenges,
              science activities, games and knowledge-based
              competitions.
            </p>

            <p>
              Our goal is to help students learn,
              explore, compete and improve their
              knowledge in an enjoyable way.
            </p>
          </div>

          <div className="section">
            <h2>Features</h2>

            <div className="feature-grid">
              {features.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="feature-card"
                  >
                    <Icon size={22} />
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="section">
            <h2>Development Team</h2>

            <div className="team-grid">

              <div className="team-card">
                Nikil Eeshwar E
              </div>

              <div className="team-card">
                Nithishvar A
              </div>

              <div className="team-card">
                Nithin R S
              </div>

              <div className="team-card">
                Prashanth R
              </div>

            </div>
          </div>

          <div className="section">
            <h2>Mentor</h2>

            <div className="mentor-card">
              Mr. M P Karthikeyan
              <br />
              Associate Professor / CSE
            </div>
          </div>

        </div>
      </div>

      <style>{`
        *{
          box-sizing:border-box;
        }

        .about-page{
          min-height:100vh;
          padding:40px;

          display:flex;
          justify-content:center;
          align-items:center;

          position:relative;
          overflow:hidden;

          background:
          radial-gradient(
            circle at top,
            #091428,
            #06111f 45%,
            #020617
          );

          color:white;
          font-family:Inter,sans-serif;
        }

        .glow{
          position:absolute;
          border-radius:50%;
          filter:blur(120px);
          opacity:.15;
        }

        .glow1{
          width:350px;
          height:350px;
          background:#8b5cf6;
          top:-100px;
          left:-100px;
        }

        .glow2{
          width:350px;
          height:350px;
          background:#3b82f6;
          bottom:-100px;
          right:-100px;
        }

        .about-card{
          width:min(1000px,95%);
          max-height:90vh;

          overflow:auto;

          padding:40px;

          border-radius:30px;

          background:
          rgba(255,255,255,.05);

          backdrop-filter:blur(20px);

          border:
          1px solid rgba(255,255,255,.08);

          box-shadow:
          0 20px 60px rgba(0,0,0,.35);
        }

        .back-btn{
          border:none;
          background:none;

          color:white;

          display:flex;
          align-items:center;
          gap:8px;

          cursor:pointer;

          margin-bottom:20px;
        }

        .brand{
          text-align:center;
          margin-bottom:30px;
        }

        .brand h1{
          margin:0;

          font-family:"Lucida Handwriting",serif;

          font-size:64px;

          font-weight:400;
        }

        .brand p{
          margin-top:10px;

          letter-spacing:6px;

          color:rgba(255,255,255,.7);
        }

        .section{
          margin-top:30px;
        }

        .section h2{
          margin-bottom:16px;
          font-size:26px;
        }

        .section p{
          line-height:1.8;
          color:rgba(255,255,255,.8);
        }

        .feature-grid{
          display:grid;

          grid-template-columns:
          repeat(auto-fit,minmax(220px,1fr));

          gap:14px;
        }

        .feature-card{
          display:flex;
          align-items:center;
          gap:12px;

          padding:16px;

          border-radius:16px;

          background:
          rgba(255,255,255,.05);

          border:
          1px solid rgba(255,255,255,.08);
        }

        .team-grid{
          display:grid;

          grid-template-columns:
          repeat(auto-fit,minmax(220px,1fr));

          gap:14px;
        }

        .team-card,
        .mentor-card{
          padding:18px;

          border-radius:16px;

          text-align:center;

          background:
          rgba(255,255,255,.05);

          border:
          1px solid rgba(255,255,255,.08);
        }

        .mentor-card{
          max-width:450px;
        }

        @media(max-width:768px){

          .brand h1{
            font-size:42px;
          }

          .about-card{
            padding:25px;
          }
        }
      `}</style>
    </>
  );
}