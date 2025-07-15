// js/game_manager.js

import { DESIGN_WIDTH, DESIGN_HEIGHT, LEVEL_DURATION, LIGHT_BLUE } from './config.js';
import { loadAssets } from './assets.js';
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
  showOutOfLivesScreen 
} from './screens.js';

// "Persistent" class variables
let persistentBaselineCoins = 0;
let persistentLives = 10;

export class Game {
  constructor(canvas, assets) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.assets = assets;

    // Player, spikes, level manager, etc.
    this.levelManager = new LevelManager(this.assets.pokemonImages, this.assets.coinImage);
    this.player = new Player();
    this.spikes = new Spikes();
    this.bubbles = [];

    // Persistent
    this.lives = persistentLives;
    this.baselineCoins = persistentBaselineCoins;

    this.currentLevelCoins = 0;
    this.finalCoinsForScoreboard = 0;

    // Timers
    this.startTime = null;
    this.levelComplete = false;
    this.coyoteFramesCharged = 0;
    this.jumpBufferFramesCharged = 0;
    this.coyoteFramesInstant = 0;
    this.jumpBufferFramesInstant = 0;

    // Bind input handling
    this.keyStates = {};
    window.addEventListener('keydown', e => this.handleKeyDown(e));
    window.addEventListener('keyup', e => this.handleKeyUp(e));
    // TODO: Gamepad/joystick support
  }

  start() {
    this.mainLoop = this.mainLoop.bind(this);
    this.run();
  }

  run() {
    this.currentLevelCoins = 0;
    this.levelComplete = false;
    this.startTime = performance.now();
    this.looping = true;
    this.loop();
  }

  loop() {
    if (!this.looping) return;
    this.update();
    this.draw();
    requestAnimationFrame(this.loop.bind(this));
  }

  update() {
    // TODO: update bubbles, handle inputs, collisions, levelManager, etc.
    // Example:
    // this.updateBubbles();
    // this.processEvents();
    // this.updateInput();
    // this.updateObjects();
    // this.player.move(this.levelManager.platforms);
    // ...
    // Handle win/loss states, collisions, etc.
  }

  draw() {
    // Clear the canvas
    this.ctx.fillStyle = LIGHT_BLUE;
    this.ctx.fillRect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);

    // Draw bubbles, background bar, player, spikes, platforms, coins, obstacles, HUD
    // drawBlackBarBehindSpikes(this);
    // this.player.draw(this.ctx);
    // this.spikes.draw(this.ctx);
    // ...
    // drawHudText(this, ...);
    // drawPowerupBar(this);
  }

  // Input event handlers
  handleKeyDown(e) {
    this.keyStates[e.code] = true;
    // Handle pressed keys: jump, instant jump, pause, etc.
    // if (e.code === 'Space') ...
  }
  handleKeyUp(e) {
    this.keyStates[e.code] = false;
    // Handle key release: e.g. end jump charging
  }

  // Other methods: updateBubbles, processEvents, updateInput, updateObjects, drawBubbles, collision checks, etc.

  // Game end states
  completeLevel() {
    this.levelComplete = true;
    this.looping = false;
    persistentBaselineCoins = this.baselineCoins + this.currentLevelCoins;
    showCompletionScreen(this);
  }
  gameOver() {
    this.looping = false;
    this.lives -= 1;
    persistentLives = this.lives;
    if (this.lives <= 0) {
      this.finalCoinsForScoreboard = this.baselineCoins + this.currentLevelCoins;
      showOutOfLivesScreen(this);
    } else {
      this.currentLevelCoins = 0;
      showGameOverScreen(this);
    }
  }
}

export function main(canvas, assets) {
  // You could use this for repeated runs/restarts
  const game = new Game(canvas, assets);
  game.start();
}
