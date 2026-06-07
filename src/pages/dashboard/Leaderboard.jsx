import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  clearLeaderboard,
  getLeaderboard,
  getLeaderboardStats,
  LEADERBOARD_EVENT,
} from "../../state/leaderboard";
import "./Leaderboard.css";

const PAGE_SIZE = 10;
const SORT_KEYS = {
  rank: "rank",
  score: "score",
  accuracy: "accuracy",
  date: "date",
};

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function Leaderboard() {
  const [entries, setEntries] = useState(() => getLeaderboard());
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("score");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);

  const refresh = useCallback(() => setEntries(getLeaderboard()), []);

  useEffect(() => {
    refresh();
    const onStorage = (e) => {
      if (e.key === "quiz_leaderboard") refresh();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(LEADERBOARD_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(LEADERBOARD_EVENT, refresh);
    };
  }, [refresh]);

  const stats = useMemo(() => getLeaderboardStats(entries), [entries]);

  const ranked = useMemo(() => {
    let list = entries.map((e) => ({
      ...e,
      accuracy: e.total > 0 ? Math.round((e.score / e.total) * 100) : e.accuracy || 0,
    }));

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.school.toLowerCase().includes(q) ||
          e.place.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "score") cmp = a.score - b.score;
      else if (sortBy === "accuracy") cmp = a.accuracy - b.accuracy;
      else if (sortBy === "date") cmp = new Date(a.date) - new Date(b.date);
      else cmp = 0;
      return sortDir === "desc" ? -cmp : cmp;
    });

    return list.map((e, i) => ({ ...e, rank: i + 1 }));
  }, [entries, search, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(ranked.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const pageRows = ranked.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);
  const podium = ranked.slice(0, 3);

  function toggleSort(key) {
    if (sortBy === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortBy(key);
      setSortDir("desc");
    }
  }

  return (
    <div className="lb-page">
      <div className="lb-glow lb-glow-left" aria-hidden />
      <div className="lb-glow lb-glow-right" aria-hidden />

      <div className="lb-shell">
        <header className="lb-header">
          <div>
            <p className="lb-eyebrow">EduQuest Analytics</p>
            <h1>Leaderboard</h1>
            <p className="lb-subtitle">Quiz performance rankings — updated after every completed quiz.</p>
          </div>
          <div className="lb-header-actions">
            <button type="button" className="lb-btn lb-btn-ghost" onClick={refresh}>
              Refresh
            </button>
            <button
              type="button"
              className="lb-btn lb-btn-danger"
              onClick={() => {
                if (window.confirm("Clear all leaderboard entries? This cannot be undone.")) {
                  clearLeaderboard();
                  setEntries([]);
                  setPage(1);
                }
              }}
            >
              Clear
            </button>
          </div>
        </header>

        <section className="lb-stats-row">
          <div className="lb-stat-card">
            <span className="lb-stat-label">Total Players</span>
            <strong className="lb-stat-value">{stats.totalPlayers}</strong>
          </div>
          <div className="lb-stat-card">
            <span className="lb-stat-label">Average Score</span>
            <strong className="lb-stat-value">{stats.averageScore}</strong>
          </div>
          <div className="lb-stat-card">
            <span className="lb-stat-label">Highest Score</span>
            <strong className="lb-stat-value">{stats.highestScore}</strong>
          </div>
          <div className="lb-stat-card">
            <span className="lb-stat-label">Total Attempts</span>
            <strong className="lb-stat-value">{stats.totalEntries}</strong>
          </div>
        </section>

        {podium.length > 0 && (
          <section className="lb-podium">
            {[1, 0, 2].map((idx) => {
              const player = podium[idx];
              if (!player) return <div key={idx} className="lb-podium-slot empty" />;
              const medal = player.rank === 1 ? "🥇" : player.rank === 2 ? "🥈" : "🥉";
              return (
                <div key={player.rank} className={`lb-podium-slot place-${player.rank}`}>
                  <span className="lb-podium-medal">{medal}</span>
                  <span className="lb-podium-name">{player.name}</span>
                  <strong className="lb-podium-score">{player.score}</strong>
                  <span className="lb-podium-acc">{player.accuracy}% accuracy</span>
                </div>
              );
            })}
          </section>
        )}

        <section className="lb-table-section">
          <div className="lb-toolbar">
            <input
              type="search"
              className="lb-search"
              placeholder="Search players…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <div className="lb-sort-group">
              {Object.entries(SORT_KEYS).map(([label, key]) => (
                <button
                  key={key}
                  type="button"
                  className={`lb-sort-btn${sortBy === key ? " active" : ""}`}
                  onClick={() => toggleSort(key)}
                >
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                  {sortBy === key && (sortDir === "desc" ? " ↓" : " ↑")}
                </button>
              ))}
            </div>
          </div>

          <div className="lb-table-wrap">
            {pageRows.length === 0 ? (
              <div className="lb-empty">
                <span className="lb-empty-icon">📊</span>
                <h3>No scores yet</h3>
                <p>Complete a quiz to appear on the leaderboard.</p>
              </div>
            ) : (
              <table className="lb-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Score</th>
                    <th>Accuracy</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((row) => (
                    <tr key={`${row.name}-${row.date}-${row.score}`}>
                      <td>
                        <span className={`lb-rank-badge${row.rank <= 3 ? " top" : ""}`}>#{row.rank}</span>
                      </td>
                      <td>
                        <div className="lb-player-cell">
                          <strong>{row.name}</strong>
                          {(row.school || row.place) && (
                            <span className="lb-player-meta">
                              {[row.school, row.place].filter(Boolean).join(" · ")}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <strong className="lb-score">{row.score}</strong>
                        {row.total > 0 && <span className="lb-score-meta"> / {row.total}</span>}
                      </td>
                      <td>
                        <span className={`lb-acc-pill${row.accuracy >= 80 ? " high" : row.accuracy >= 50 ? " mid" : " low"}`}>
                          {row.accuracy}%
                        </span>
                      </td>
                      <td className="lb-date">{fmtDate(row.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {ranked.length > PAGE_SIZE && (
            <div className="lb-pagination">
              <button type="button" className="lb-btn lb-btn-ghost" disabled={pageSafe <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </button>
              <span className="lb-page-info">
                Page {pageSafe} of {totalPages}
              </span>
              <button type="button" className="lb-btn lb-btn-ghost" disabled={pageSafe >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
