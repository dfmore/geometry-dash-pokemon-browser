// js/screens.js

import {
  DESIGN_WIDTH, DESIGN_HEIGHT,
  RED, WHITE, BLACK
} from './config.js';
import { LEVELS } from './levels_config.js';

// Helper: draws centered text overlay
function drawCenteredText(ctx, text, color = RED, y = DESIGN_HEIGHT / 2, font = "32px Arial") {
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, DESIGN_WIDTH / 2, y);
  ctx.restore();
}

// Completion overlay, call when level finished
export function showCompletionScreen(ctx, levelIndex, onContinue) {
  drawCenteredText(
    ctx,
    `Level ${levelIndex + 1} Complete! Press any key or Y to continue.`,
    RED
  );

  // Listen for key or 'Y' button press once
  function handler(e) {
    window.removeEventListener('keydown', handler);
    window.removeEventListener('gamepadbuttondown', handler);
    if (typeof onContinue === "function") onContinue();
  }
  window.addEventListener('keydown', handler, { once: true });
  // If you want actual gamepad 'Y', you’d use the Gamepad API—can add later
}

// Game over overlay (with remaining lives)
export function showGameOverScreen(ctx, levelIndex, onRetry) {
  drawCenteredText(
    ctx,
    `Game Over! Press any key or Y to retry level ${levelIndex + 1}`,
    RED
  );

  function handler(e) {
    window.removeEventListener('keydown', handler);
    window.removeEventListener('gamepadbuttondown', handler);
    if (typeof onRetry === "function") onRetry();
  }
  window.addEventListener('keydown', handler, { once: true });
}

// Out of lives: prompt for initials and display scoreboard
export function showOutOfLivesScreen(ctx, finalCoins, onInitials, font = "32px Arial") {
  let entered = "";

  function drawPrompt() {
    ctx.clearRect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
    drawCenteredText(ctx, "Enter your initials (up to 3 letters), then Press Enter:", WHITE, 150, font);
    drawCenteredText(ctx, entered || "AAA", WHITE, 250, font);
    drawCenteredText(ctx, "[Backspace=delete | Enter=confirm]", "#CCCCCC", 350, "18px Arial");
  }

  drawPrompt();

  function handler(e) {
    if (e.key === "Backspace") {
      entered = entered.slice(0, -1);
    } else if (e.key === "Enter") {
      window.removeEventListener('keydown', handler);
      if (typeof onInitials === "function") onInitials(finalizeInitials(entered));
      return;
    } else if (/^[a-zA-Z]$/.test(e.key) && entered.length < 3) {
      entered += e.key.toUpperCase();
    }
    drawPrompt();
  }
  window.addEventListener('keydown', handler);

  function finalizeInitials(str) {
    str = (str || "AAA").toUpperCase();
    while (str.length < 3) str += "A";
    return str.slice(0, 3);
  }
}

// Show scoreboard: pass array of entries { name, score }
export function showScoreboard(ctx, entries, onExit) {
  ctx.clearRect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);
  drawCenteredText(ctx, "TOP SCORES", WHITE, 50, "32px Arial");
  let yStart = 150;
  ctx.font = "24px Arial";
  ctx.textAlign = "left";
  entries.forEach((entry, i) => {
    ctx.fillStyle = WHITE;
    ctx.fillText(`${i + 1}. ${entry.name}  -  ${entry.score} coins`, 100, yStart + i * 40);
  });

  // Wait for user to press a key or button
  function handler(e) {
    window.removeEventListener('keydown', handler);
    if (typeof onExit === "function") onExit();
  }
  window.addEventListener('keydown', handler, { once: true });
}

// Final message after all levels
export function showFinalMessage(ctx, msg, onDone) {
  drawCenteredText(ctx, msg, RED);
  function handler(e) {
    window.removeEventListener('keydown', handler);
    if (typeof onDone === "function") onDone();
  }
  window.addEventListener('keydown', handler, { once: true });
}
