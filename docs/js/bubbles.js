// js/bubbles.js

import {
  DESIGN_WIDTH,
  DESIGN_HEIGHT,
  BUBBLE_MIN_RADIUS,
  BUBBLE_MAX_RADIUS,
  BUBBLE_SPEED_MIN,
  BUBBLE_SPEED_MAX,
  BUBBLE_COLOR
} from './config.js';

export class Bubble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    // Random radius and speed
    this.radius = Math.floor(BUBBLE_MIN_RADIUS + Math.random() * (BUBBLE_MAX_RADIUS - BUBBLE_MIN_RADIUS + 1));
    this.speed = BUBBLE_SPEED_MIN + Math.random() * (BUBBLE_SPEED_MAX - BUBBLE_SPEED_MIN);
  }

  update() {
    // Bubbles rise upward
    this.y -= this.speed;
  }

  offScreen() {
    // Off the top of the canvas
    return (this.y + this.radius) < 0;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = BUBBLE_COLOR;
    ctx.globalAlpha = 0.6;
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }
}
