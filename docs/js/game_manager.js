// js/game_manager.js

import {
  DESIGN_WIDTH, DESIGN_HEIGHT, LEVEL_DURATION, LIGHT_BLUE,
  COYOTE_FRAMES, NUDGE_RANGE, NUDGE_SPEED
} from './config.js';
import { LEVELS } from './levels_config.js';
import { Player } from './player.js';
import { Spikes } from './spikes.js';
import { LevelManager } from './level_manager.js';
import { Bubble } from './bubbles.js';
import {
  drawBlackBarBehindSpikes,
  drawPowerupBar,
  drawHudText
} from './ui.js';
import {
  showCompletionScreen,
  showGameOverScreen,
  showOutOfLivesScreen,
  showScoreboard,
} from './screens.js';
import { addScore } from './scoreboard.js';

let persistentBaselineCoins = 0;
let persistentLives = 10;

export class Game {
  constructor(canvas, assets) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.assets = assets;

    // Game objects
    this.levelManager = new LevelManager(this.assets.pokemon_images, this.assets.coin_image);
    this.player = new Player();
    this.spikes = new Spikes();
    this.bubbles = [];

    // Persistent values
    this.lives = persistentLives;
    this.baselineCoins = persistentBaselineCoins;
    this.currentLevelCoins = 0;
    this.finalCoinsForScoreboard = 0;
    this.levelIndex = 0;

    // Game state
    this.state = "playing"; // other: "levelComplete", "gameOver", "outOfLives", "scoreboard", "waiting"
    this.startTime = performance.now();
    this.levelComplete = false;

    // Platformer helpers (coyote, jump buffer)
    this.coyoteFrames = 0;
    this.jumpBufferFrames = 0;

    // Input
    this.keyStates = {};
    window.addEventListener('keydown', e => this.handleKeyDown(e));
    window.addEventListener('keyup', e => this.handleKeyUp(e));
  }

  start() {
    this.run();
  }

  run() {
    // (Re)start current level
    this.currentLevelCoins = 0;
    this.levelComplete = false;
    this.state = "playing";
    this.startTime = performance.now();

    // Reset objects (player, platforms, obstacles, bubbles)
    this.levelManager.generateSeededLevel(this.levelIndex);
    this.player = new Player();
    this.bubbles = [];

    // Reset coyote and jump buffer
    this.coyoteFrames = 0;
    this.jumpBufferFrames = 0;

    this.looping = true;
    this.loop();
  }

  loop() {
    if (!this.looping) return;
    this.processInput();
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }

  // --------------- EVENT HANDLING AND INPUT LOGIC ---------------

  handleKeyDown(e) {
    this.keyStates[e.code] = true;

    if (this.state !== "playing") return;

    // Charged jump (hold Space to charge)
    if (e.code === "Space") {
      if (this.player.onGround /* or coyote time if you implement it */) {
        this.player.startCharge();
        // Optionally: clear jump buffer, coyote, etc.
      }
    }

    // Instant jump/double jump (X)
    if (e.code === "KeyX") {
      this.player.jump();
      // Optionally: clear jump buffer, coyote, etc.
    }
  }

  handleKeyUp(e) {
    this.keyStates[e.code] = false;

    if (this.state !== "playing") return;

    // Release charged jump (Space up)
    if (e.code === "Space") {
      this.player.releaseCharge();
    }
  }


  processInput() {
  // 1) Compute arrow‑key nudge
    let horizontalInput = 0;
    if (this.keyStates["ArrowLeft"])  horizontalInput = -1;
    if (this.keyStates["ArrowRight"]) horizontalInput = +1;

    // 2) Compute your nudge target around the “home” X
    const targetX = this.player.default_x + horizontalInput * NUDGE_RANGE;

    // 3) Smoothly nudge toward it
    this.player.x += NUDGE_SPEED * (targetX - this.player.x);
    
    // Clamp to game area
    this.player.x = Math.max(0, Math.min(DESIGN_WIDTH - this.player.width, this.player.x));
  }

  // --------------- GAME UPDATE LOGIC ---------------

  update() {
    if (this.state !== "playing") return;

    // --- Bubbles (background effect) ---
    if (Math.random() < 0.03) {
      this.bubbles.push(new Bubble(
        Math.random() * DESIGN_WIDTH,
        DESIGN_HEIGHT - 5
      ));
    }
    this.bubbles.forEach(b => b.update());
    this.bubbles = this.bubbles.filter(b => !b.offScreen());

    // --- Player movement, gravity, platform collision ---
    this.player.update(this.levelManager.platforms, this.keyStates);

    // --- Obstacles update ---
    this.levelManager.updateObstacles();

    // --- Platforms update ---
    this.levelManager.updatePlatforms();

    // --- Coins update ---
    this.levelManager.updateCoins();

    // --- Coyote time / jump buffer handling ---
    if (this.player.onGround) {
      this.coyoteFrames = COYOTE_FRAMES;
      // Allow jump buffer: if jump pressed just before landing
      if (this.jumpBufferFrames > 0) {
        this.player.jump();
        this.jumpBufferFrames = 0;
      }
    } else {
      if (this.coyoteFrames > 0) this.coyoteFrames--;
      if (this.jumpBufferFrames > 0) this.jumpBufferFrames--;
    }

    // --- Collect coins ---
    for (let i = this.levelManager.starCoins.length - 1; i >= 0; i--) {
      const coin = this.levelManager.starCoins[i];
      if (this.rectsCollide(this.player, coin)) {
        this.currentLevelCoins += 1;
        this.assets.coin_sound && this.assets.coin_sound.play();
        this.levelManager.starCoins.splice(i, 1);
      }
    }

    // --- Check for player death (spikes) ---
    if (this.player.y + this.player.height > DESIGN_HEIGHT - this.spikes.height) {
      this.assets.boing_sound && this.assets.boing_sound.play();
      this.gameOver();
      return;
    }

    // --- Check for obstacle collisions ---
    if (this.levelManager.checkObstacleCollisions(this.player)) {
      this.assets.boing_sound && this.assets.boing_sound.play();
      this.gameOver();
      return;
    }

    // --- Level completion ---
    const elapsed = (performance.now() - this.startTime) / 1000;
    if (elapsed > LEVEL_DURATION) {
      this.completeLevel();
    }
  }

  draw() {
    // Clear
    this.ctx.fillStyle = LIGHT_BLUE;
    this.ctx.fillRect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);

    // Draw background bar and bubbles
    drawBlackBarBehindSpikes(this.ctx);
    this.bubbles.forEach(b => b.draw(this.ctx));

    // Platforms
    this.levelManager.platforms.forEach(p => p.draw(this.ctx));
    // Obstacles
    this.levelManager.obstacles.forEach(o => o.draw(this.ctx));
    // Coins
    this.levelManager.starCoins.forEach(c => c.draw(this.ctx));

    // Spikes
    this.spikes.draw(this.ctx);

    // Player
    this.player.draw(this.ctx);

    // UI/HUD
    const elapsed = (performance.now() - this.startTime) / 1000;
    drawHudText(this.ctx, this, Math.max(0, LEVEL_DURATION - elapsed));
    drawPowerupBar(this.ctx, this.player);
  }

  // ------------ COLLISION -----------
  rectsCollide(a, b) {
    return !(
      a.x + a.width < b.x ||
      a.x > b.x + b.width ||
      a.y + a.height < b.y ||
      a.y > b.y + b.height
    );
  }

  // ------------ GAME STATE TRANSITIONS -----------
  completeLevel() {
    this.state = "levelComplete";
    this.looping = false;
    persistentBaselineCoins = this.baselineCoins + this.currentLevelCoins;
    showCompletionScreen(this.ctx, this.levelIndex, () => {
      this.levelIndex++;
      if (this.levelIndex >= LEVELS.length) {
        // All levels complete, show scoreboard/final
        this.handleGameFinished();
      } else {
        this.run();
      }
    });
  }

  gameOver() {
    this.state = "gameOver";
    this.looping = false;
    this.lives -= 1;
    persistentLives = this.lives;
    if (this.lives <= 0) {
      this.finalCoinsForScoreboard = this.baselineCoins + this.currentLevelCoins;
      showOutOfLivesScreen(this.ctx, this.finalCoinsForScoreboard, initials => {
        // Save score and show scoreboard
        const entries = addScore(initials, this.finalCoinsForScoreboard);
        showScoreboard(this.ctx, entries, () => this.restartGame(true));
      });
    } else {
      this.currentLevelCoins = 0;
      showGameOverScreen(this.ctx, this.levelIndex, () => this.run());
    }
  }

  handleGameFinished() {
    // All levels complete: prompt for initials, show scoreboard, reset
    showOutOfLivesScreen(this.ctx, this.baselineCoins + this.currentLevelCoins, initials => {
      const entries = addScore(initials, this.baselineCoins + this.currentLevelCoins);
      showScoreboard(this.ctx, entries, () => this.restartGame(true));
    });
  }

  restartGame(resetAll = false) {
    if (resetAll) {
      this.levelIndex = 0;
      this.lives = 10;
      this.baselineCoins = 0;
      persistentBaselineCoins = 0;
      persistentLives = 10;
    }
    this.run();
  }
}
