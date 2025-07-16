// js/obstacle.js
import { SPEED } from './config.js';

export class Obstacle {
  constructor(x, y, pokemonImages, rng = Math.random) {
    // Use provided RNG for reproducible selection (seeded)
    this.image = pokemonImages[Math.floor(rng() * pokemonImages.length)];
    this.width = this.image.width;
    this.height = this.image.height;
    this.x = x;
    this.y = y;
    // SPEED should be imported from config.js
    // (if not, add: import { SPEED } from './config.js';)
    this.speed = SPEED
  }

  move() {
    this.x -= this.speed;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  offScreen() {
    return (this.x + this.width) < 0;
  }
}
