// js/game_platform.js

import {
  DESIGN_WIDTH,
  DESIGN_HEIGHT,
  PLATFORM_WIDTH_FRAC,
  PLATFORM_HEIGHT_FRAC,
  SPEED
} from './config.js';

export class Platform {
  constructor(x, y) {
    this.width  = DESIGN_WIDTH * PLATFORM_WIDTH_FRAC;
    this.height = DESIGN_HEIGHT * PLATFORM_HEIGHT_FRAC;
    this.x = x;
    this.y = y;
    this.speed = SPEED;
  }

  move() {
    this.x -= this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = "#00FF00"; // Green, as in your Python code
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  offScreen() {
    return (this.x + this.width) < 0;
  }
}
