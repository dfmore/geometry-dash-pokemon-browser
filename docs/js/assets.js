// js/assets.js

import { DESIGN_WIDTH, OBSTACLE_WIDTH_FRAC, COIN_WIDTH_FRAC } from './config.js';

// Helper to load and scale an image
function loadAndScaleImage(src, newWidth) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Maintain aspect ratio
      const aspect = img.height / img.width;
      const newHeight = Math.round(newWidth * aspect);
      // Create a canvas to draw the scaled image
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      // Create a new Image with the scaled content
      const scaledImg = new Image();
      scaledImg.onload = () => resolve(scaledImg);
      scaledImg.src = canvas.toDataURL();
    };
    img.onerror = reject;
    img.src = src;
  });
}

export async function loadAssets() {
  const assets = {};

  // --- Pokémon obstacles ---
  const obstacleDesiredW = Math.round(OBSTACLE_WIDTH_FRAC * DESIGN_WIDTH);
  const pokemonImagePaths = [
    'assets/pikachu.png',
    'assets/charmander.png',
    'assets/bulbasaur.png',
    'assets/squirtle.png'
  ];
  assets.pokemon_images = await Promise.all(
    pokemonImagePaths.map(src => loadAndScaleImage(src, obstacleDesiredW))
  );

  // --- Star coin ---
  const coinDesiredW = Math.round(COIN_WIDTH_FRAC * DESIGN_WIDTH);
  assets.coin_image = await loadAndScaleImage('assets/star_coin.gif', coinDesiredW);

  // --- Sounds (simple, not pre-buffered) ---
  assets.boing_sound = new Audio('assets/boing.mp3');
  assets.coin_sound = new Audio('assets/coin.mp3');

  return assets;
}
