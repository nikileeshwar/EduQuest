// src/state/leaderboard.js
const STORAGE_KEY = "quiz_leaderboard";
export const MAX_ENTRIES = 500;
export const LEADERBOARD_EVENT = "eduquest:leaderboard-updated";

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.warn("leaderboard: parse error", e);
    return null;
  }
}

function notifyUpdate() {
  try {
    window.dispatchEvent(new CustomEvent(LEADERBOARD_EVENT));
  } catch {
    /* SSR / tests */
  }
}

export function getLeaderboard() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = safeParse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeEntry);
  } catch (e) {
    console.warn("leaderboard: getLeaderboard error", e);
    return [];
  }
}

function saveFullLeaderboard(arr) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr || []));
    notifyUpdate();
  } catch (e) {
    console.warn("leaderboard: save error", e);
  }
}

export function normalizeEntry(raw = {}) {
  const score = Number.isFinite(Number(raw.score)) ? Number(raw.score) : 0;
  const total = Number.isFinite(Number(raw.total)) ? Number(raw.total) : 0;
  const accuracy =
    total > 0
      ? Math.round((score / total) * 100)
      : Number.isFinite(Number(raw.accuracy))
        ? Number(raw.accuracy)
        : 0;

  const e = {
    name: raw.name ? String(raw.name) : "Anonymous",
    school: raw.school ? String(raw.school) : "",
    place: raw.place ? String(raw.place) : "",
    category: raw.category ? String(raw.category) : "",
    score,
    total,
    accuracy: Math.min(100, Math.max(0, accuracy)),
    date: raw.date ? String(raw.date) : new Date().toISOString(),
  };

  if (isNaN(new Date(e.date).getTime())) e.date = new Date().toISOString();
  return e;
}

function entryKey(e) {
  return `${e.name}||${e.school}||${e.place}||${e.score}||${e.total}||${e.date}`;
}

function entriesEqual(a, b) {
  if (!a || !b) return false;
  return entryKey(a) === entryKey(b);
}

export function addScoreEntry(entry) {
  try {
    const normalized = normalizeEntry(entry);
    const current = getLeaderboard();

    if (current.length > 0 && entriesEqual(current[0], normalized)) {
      return current;
    }

    current.unshift(normalized);

    current.sort((a, b) => {
      const scoreDiff = Number(b.score) - Number(a.score);
      if (scoreDiff !== 0) return scoreDiff;
      return new Date(b.date) - new Date(a.date);
    });

    const trimmed = current.slice(0, MAX_ENTRIES);
    saveFullLeaderboard(trimmed);
    return trimmed;
  } catch (e) {
    console.warn("leaderboard: addScoreEntry error", e);
    return getLeaderboard();
  }
}

export function clearLeaderboard() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    notifyUpdate();
  } catch (e) {
    console.warn("leaderboard: clear error", e);
  }
}

export function dedupeLeaderboard() {
  try {
    const arr = getLeaderboard();
    const seen = new Set();
    const out = [];
    for (const e of arr) {
      const key = entryKey(e);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(e);
    }
    saveFullLeaderboard(out);
    return out;
  } catch (e) {
    console.warn("leaderboard: dedupe error", e);
    return getLeaderboard();
  }
}

export function setLeaderboard(entries = []) {
  if (!Array.isArray(entries)) throw new Error("setLeaderboard expects an array");
  const normalized = entries
    .map(normalizeEntry)
    .sort((a, b) => {
      const sd = Number(b.score) - Number(a.score);
      if (sd !== 0) return sd;
      return new Date(b.date) - new Date(a.date);
    })
    .slice(0, MAX_ENTRIES);
  saveFullLeaderboard(normalized);
  return normalized;
}

export function getLeaderboardStats(entries = getLeaderboard()) {
  const list = entries || [];
  const players = new Set(list.map((e) => `${e.name}||${e.school}`.toLowerCase())).size;
  const scores = list.map((e) => Number(e.score) || 0);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const highest = scores.length ? Math.max(...scores) : 0;
  return { totalPlayers: players, averageScore: avg, highestScore: highest, totalEntries: list.length };
}
