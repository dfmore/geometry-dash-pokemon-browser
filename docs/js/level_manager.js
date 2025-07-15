// js/level_manager.js

import seedrandom from "https://cdn.jsdelivr.net/npm/seedrandom@3.0.5/+esm";

import {
  DESIGN_WIDTH, DESIGN_HEIGHT, LEVEL_DURATION, SPEED, COLLISION_TOLERANCE
} from './config.js';
import * as lvl from './levels_config.js';
import { Platform } from './game_platform.js';
import { Obstacle } from './obstacle.js';
import { StarCoin } from './coin.js';

// Helper for seeded random integer in [a, b] (inclusive)
function randInt(a, b, rng) {
  return Math.floor(a + rng() * (b - a + 1));
}

export class LevelManager {
  constructor(pokemonImages, coinImage) {
    this.pokemonImages = pokemonImages;
    this.coinImage = coinImage;

    this.platforms = [];
    this.obstacles = [];
    this.starCoins = [];
    this.coinsSpawned = 0;

    this.levelIndex = lvl.CURRENT_LEVEL;

    this.generateSeededLevel(this.levelIndex);
  }

  generateSeededLevel(levelIndex) {
    this.platforms = [];
    this.obstacles = [];
    this.starCoins = [];
    this.coinsSpawned = 0;

    if (levelIndex < 0 || levelIndex >= lvl.LEVELS.length) {
      console.warn(`levelIndex ${levelIndex} out of range. Defaulting to 0.`);
      levelIndex = 0;
    }
    const levelData = lvl.LEVELS[levelIndex];
    console.log(`Generating level: ${levelData.name || "Unknown"}`);

    // --- Use a seedable RNG for level structure ---
    const seedVal = levelData.seed || 0;
    const rng = seedrandom(seedVal);

    const platformCount = Math.floor(LEVEL_DURATION);

    const safeGapMin = levelData.safe_gap_min ?? 50;
    const safeGapMax = levelData.safe_gap_max ?? 140;
    const verticalOffsetMin = levelData.vertical_offset_min ?? -10;
    const verticalOffsetMax = levelData.vertical_offset_max ?? 10;
    const minPy = levelData.min_platform_y ?? 550;
    const maxPy = levelData.max_platform_y ?? 600;
    const obstacleChance = levelData.obstacle_spawn_chance ?? 0.3;
    const obstacleMax = levelData.obstacle_max_per_platform ?? 1;
    const coinChance = levelData.coin_chance ?? 0.3;

    // 1) First platform
    const firstY = randInt(minPy, maxPy, rng);
    const firstPlatform = new Platform(100, firstY);
    this.platforms.push(firstPlatform);

    // 2) Generate more platforms
    for (let i = 1; i < platformCount; i++) {
      const lastPlat = this.platforms[this.platforms.length - 1];
      const gap = randInt(safeGapMin, safeGapMax, rng);
      const newX = lastPlat.x + lastPlat.width + gap;
      const offset = randInt(verticalOffsetMin, verticalOffsetMax, rng);
      let newY = lastPlat.y + offset;
      newY = Math.max(minPy, Math.min(newY, maxPy));

      const p = new Platform(newX, newY);
      this.platforms.push(p);

      // 3) Maybe spawn obstacles
      if (rng() < obstacleChance) {
        const numObs = randInt(1, obstacleMax, rng);
        for (let j = 0; j < numObs; j++) {
          const obs = new Obstacle(0, 0, this.pokemonImages, rng); // pass rng if you want seeded image choice too
          obs.x = p.x + randInt(0, Math.max(0, p.width - obs.width), rng);
          obs.y = p.y - obs.height;
          this.obstacles.push(obs);
        }
      }

      // 4) Maybe spawn coin
      if (rng() < coinChance) {
        const cObj = new StarCoin(0, 0, this.coinImage);
        let attempts = 5;
        let placed = false;
        while (attempts > 0 && !placed) {
          const coinX = p.x + randInt(0, Math.max(0, p.width - cObj.width), rng);
          const coinY = p.y - cObj.height - 10;
          const coinRect = { x: coinX, y: coinY, width: cObj.width, height: cObj.height };
          let overlap = false;
          // Check obstacles on the same platform to avoid overlap
          for (let obs of this.obstacles) {
            if (obs.x >= p.x && obs.x <= (p.x + p.width)) {
              const obsRect = { x: obs.x, y: obs.y, width: obs.width, height: obs.height };
              if (this.rectsCollide(coinRect, obsRect)) {
                overlap = true;
                break;
              }
            }
          }
          if (!overlap) {
            cObj.x = coinX;
            cObj.y = coinY;
            this.starCoins.push(cObj);
            this.coinsSpawned++;
            placed = true;
          }
          attempts--;
        }
      }
    }
  }

  updatePlatforms() {
    for (let p of [...this.platforms]) {
      p.move();
      if (p.offScreen()) {
        this.platforms.splice(this.platforms.indexOf(p), 1);
      }
    }
  }

  updateObstacles() {
    for (let obs of [...this.obstacles]) {
      obs.move();
      if (obs.offScreen()) {
        this.obstacles.splice(this.obstacles.indexOf(obs), 1);
      }
    }
  }

  updateCoins() {
    for (let ccoin of [...this.starCoins]) {
      ccoin.x -= SPEED;
      if ((ccoin.x + ccoin.width) < 0) {
        this.starCoins.splice(this.starCoins.indexOf(ccoin), 1);
      }
    }
  }

  checkObstacleCollisions(playerRect) {
    for (let obs of this.obstacles) {
      let obsRect = { x: obs.x, y: obs.y, width: obs.width, height: obs.height };
      let inflated = {
        x: obsRect.x + COLLISION_TOLERANCE,
        y: obsRect.y + COLLISION_TOLERANCE,
        width: obsRect.width - 2 * COLLISION_TOLERANCE,
        height: obsRect.height - 2 * COLLISION_TOLERANCE
      };
      if (this.rectsCollide(playerRect, inflated)) {
        return true;
      }
    }
    return false;
  }

  rectsCollide(r1, r2) {
    return !(
      r1.x + r1.width < r2.x ||
      r1.x > r2.x + r2.width ||
      r1.y + r1.height < r2.y ||
      r1.y > r2.y + r2.height
    );
  }
}
