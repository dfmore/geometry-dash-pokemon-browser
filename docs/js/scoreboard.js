// js/scoreboard.js

const SCOREBOARD_KEY = "geometryPokemonDash.scoreboard";
const MAX_ENTRIES = 20;

// Loads scoreboard from localStorage, returns [{ name: "ABC", score: 99 }, ...]
export function loadScoreboard() {
  const data = localStorage.getItem(SCOREBOARD_KEY);
  if (!data) return [];
  try {
    const entries = JSON.parse(data);
    return Array.isArray(entries) ? entries : [];
  } catch {
    return [];
  }
}

// Saves array of entries to localStorage
export function saveScoreboard(entries) {
  localStorage.setItem(SCOREBOARD_KEY, JSON.stringify(entries));
}

// Adds a new score and returns the updated list (sorted, truncated)
export function addScore(name, score) {
  let entries = loadScoreboard();
  entries.push({ name, score });
  // Sort descending by score
  entries.sort((a, b) => b.score - a.score);
  // Keep only top MAX_ENTRIES
  entries = entries.slice(0, MAX_ENTRIES);
  saveScoreboard(entries);
  return entries;
}
