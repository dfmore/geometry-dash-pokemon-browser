// js/player.js

import {
  DESIGN_WIDTH,
  DESIGN_HEIGHT,
  SQUARE_WIDTH_FRAC,
  GRAVITY,
  PLATFORM_EDGE_TOLERANCE,
  SPEED,
  MIN_JUMP_STRENGTH,
  MAX_JUMP_STRENGTH,
  CHARGE_RATE,
} from './config.js';

export class Player {
  constructor() {
    // Sizing and position
    const side = DESIGN_WIDTH * SQUARE_WIDTH_FRAC;
    this.width = side;
    this.height = side;
    this.x = 100;
    this.y = 320;

    // Physics
    this.velY = 0;

    // Jumping
    this.charging = false;      // True while holding Space and charging
    this.jumpCharge = 0;        // Current charge level
    this.onGround = true;
    this.canDoubleJump = true;
  }

  update(platforms, keyStates) {
    // --- Horizontal movement ---
    if (keyStates["ArrowLeft"])  this.x -= SPEED;
    if (keyStates["ArrowRight"]) this.x += SPEED;
    this.x = Math.max(0, Math.min(DESIGN_WIDTH - this.width, this.x));

    // --- Gravity ---
    this.velY += GRAVITY;
    this.y += this.velY;

    // --- Platform collision ---
    let wasOnGround = this.onGround;
    this.onGround = false;
    for (let platform of platforms) {
      const pLeft = platform.x - PLATFORM_EDGE_TOLERANCE;
      const pRight = platform.x + platform.width + PLATFORM_EDGE_TOLERANCE;
      const pTop = platform.y;
      const pBottom = platform.y + platform.height;

      const playerBottom = this.y + this.height;
      const playerPrevBottom = this.y + this.height - this.velY;

      // Check collision only if falling
      if (
        playerPrevBottom <= pTop &&
        playerBottom >= pTop &&
        this.x + this.width > pLeft &&
        this.x < pRight
      ) {
        this.y = pTop - this.height;
        this.velY = 0;
        this.onGround = true;
        this.canDoubleJump = true;
      }
    }

    // --- Charged jump bar logic (while on ground and charging) ---
    if (this.charging && this.onGround) {
      this.jumpCharge = Math.min(MAX_JUMP_STRENGTH, this.jumpCharge + CHARGE_RATE);
    }

    // --- If you walk off a platform while charging, stop charging and reset ---
    if (this.charging && !this.onGround) {
      this.charging = false;
      this.jumpCharge = 0;
    }
  }

  // Called when Space is pressed
  startCharge() {
    if (this.onGround) {
      this.charging = true;
      this.jumpCharge = MIN_JUMP_STRENGTH;
    }
  }

  // Called when Space is released
  releaseCharge() {
    if (this.charging && this.onGround) {
      this.velY = -this.jumpCharge;
      this.charging = false;
      this.jumpCharge = 0;
      this.onGround = false;
      this.canDoubleJump = true;
    } else {
      this.charging = false;
      this.jumpCharge = 0;
    }
  }

  // Called when X is pressed (instant/double jump)
  jump() {
    if (this.onGround) {
      this.velY = -MIN_JUMP_STRENGTH;
      this.onGround = false;
      this.canDoubleJump = true;
    } else if (this.canDoubleJump) {
      this.velY = -MIN_JUMP_STRENGTH;
      this.canDoubleJump = false;
    }
  }

  draw(ctx) {
    // Replace with your sprite logic as needed
    ctx.fillStyle = "#0084ff";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // Optionally, draw charge bar
    if (this.charging && this.onGround) {
      ctx.fillStyle = "#FFD700";
      let barWidth = (this.jumpCharge - MIN_JUMP_STRENGTH) / (MAX_JUMP_STRENGTH - MIN_JUMP_STRENGTH) * this.width;
      ctx.fillRect(this.x, this.y - 10, barWidth, 6);
    }
  }
}
