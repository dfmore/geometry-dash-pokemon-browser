// js/main.js

import { FULLSCREEN, DESIGN_WIDTH, DESIGN_HEIGHT } from './config.js';
import { Game } from './game_manager.js';      // You'll create this file/class
import { loadAssets } from './assets.js';      // Handles image/audio preloading

window.addEventListener('load', async () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx    = canvas.getContext('2d');

  // — Fullscreen or fixed design size —
  function resize() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(vw / DESIGN_WIDTH, vh / DESIGN_HEIGHT);

    // Set the pixel buffer for crisp rendering on Hi-DPI screens
    canvas.width  = DESIGN_WIDTH  * window.devicePixelRatio;
    canvas.height = DESIGN_HEIGHT * window.devicePixelRatio;

    // Scale CSS to fit the window, preserving aspect
    canvas.style.width  = `${DESIGN_WIDTH  * scale}px`;
    canvas.style.height = `${DESIGN_HEIGHT * scale}px`;

    // Set the transform so drawing logic remains in design coordinates
    ctx.setTransform(
      scale * window.devicePixelRatio, 0,
      0, scale * window.devicePixelRatio,
      0, 0
    );
  }
  window.addEventListener('resize', resize);
  resize();

  // — Background music (looped) —
  const music = new Audio('assets/signal.mp3');
  music.loop = true;
  try {
    await music.play();
  } catch (e) {
    // Some browsers block autoplay; will play on first user interaction
    console.warn('Autoplay prevented; user gesture required to start audio.');
    document.body.addEventListener('mousedown', () => music.play(), { once: true });
    document.body.addEventListener('touchstart', () => music.play(), { once: true });
  }

  // — Load assets and start game —
  const assets = await loadAssets(); // image/audio loader (you'll create)
  const game   = new Game(canvas, assets);    // mirrors game_manager.main()

  game.start();
});
