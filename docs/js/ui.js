// js/ui.js

import {
  DESIGN_WIDTH, DESIGN_HEIGHT,
  SPIKE_HEIGHT_FRAC, SPIKE_BG_COLOR, SPIKE_BG_OVERLAP,
  MAX_JUMP_STRENGTH, BLACK
} from './config.js';
import { LEVELS } from './levels_config.js';

// Draw the black bar behind spikes at the bottom of the screen
export function drawBlackBarBehindSpikes(ctx) {
  const spikeHeight = DESIGN_HEIGHT * SPIKE_HEIGHT_FRAC;
  let blackBarTop = DESIGN_HEIGHT - spikeHeight - SPIKE_BG_OVERLAP;
  let blackBarHeight = spikeHeight + SPIKE_BG_OVERLAP;
  if (blackBarTop < 0) {
    blackBarTop = 0;
    blackBarHeight = DESIGN_HEIGHT;
  }
  ctx.fillStyle = SPIKE_BG_COLOR;
  ctx.fillRect(0, blackBarTop, DESIGN_WIDTH, blackBarHeight);
}

// Draw the jump charge/power-up bar for the player
export function drawPowerupBar(ctx, player) {
  const barMaxHeight = DESIGN_HEIGHT / 6;
  const barWidth = 30;

  let fraction = player.jumpCharge / MAX_JUMP_STRENGTH;
  fraction = Math.max(0, Math.min(fraction, 1));

  const fillHeight = barMaxHeight * fraction;
  const barX = DESIGN_WIDTH - barWidth - 10;
  const barY = DESIGN_HEIGHT - 10 - barMaxHeight;

  // Outline
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#000000";
  ctx.strokeRect(barX, barY, barWidth, barMaxHeight);

  // Fill
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(barX, barY + (barMaxHeight - fillHeight), barWidth, fillHeight);
}

// Draws all HUD text: timer, coins, level, lives
export function drawHudText(ctx, game, remainingTime, font = "20px Arial") {
  ctx.font = font;
  ctx.fillStyle = BLACK;

  // Timer (left)
  ctx.textAlign = "left";
  ctx.fillText(`Time: ${Math.floor(remainingTime)}`, 10, 30);

  // Coins (right)
  const totalCoins = (game.baselineCoins || 0) + (game.currentLevelCoins || 0);
  ctx.textAlign = "right";
  ctx.fillText(`Coins: ${totalCoins}`, DESIGN_WIDTH - 10, 30);

  // Level (center)
  ctx.textAlign = "center";
  ctx.fillText(
    `Level: ${(game.currentLevelIndex ?? 0) + 1} / ${LEVELS.length}`,
    DESIGN_WIDTH / 2,
    30
  );

  // Lives (left, lower)
  ctx.textAlign = "left";
  ctx.fillText(`Lives: ${game.lives ?? 0}`, 10, 60);

  // Reset align for safety
  ctx.textAlign = "left";
}
