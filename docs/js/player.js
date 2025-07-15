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
  CHARGE_RATE
} from './config.js';

export class Player {
  constructor() {
    // Size and position
    const side = DESIGN_WIDTH * SQUARE_WIDTH_FRAC;
    this.width = side;
    this.height = side;

    this.x = 100;
    this.y = 320;
    this.default_x = this.x;

    // Movement
    this.velY = 0;
    this.velX = 0;

    // Jumping and state
    this.onGround = true;
    this.charging = false;
    this.chargeJumping = false;
    this.jumpCharge = 0;
    this.canDoubleJump = true;
  }

  // Call every frame, passing currently pressed keys as { ArrowLeft: true, ArrowRight: true, ... }
  update(platforms, keyStates) {
    // --- Horizontal movement ---
    if (keyStates["ArrowLeft"])  this.x -= SPEED;
    if (keyStates["ArrowRight"]) this.x += SPEED;
    // Clamp to game area
    this.x = Math.max(0, Math.min(DESIGN_WIDTH - this.width, this.x));

    // --- Gravity ---
    this.velY += GRAVITY;
    this.y += this.velY;
    this.onGround = false;

    // --- Platform collision ---
    const playerRect = { x: this.x, y: this.y, width: this.width, height: this.height };
    for (let platform of platforms) {
      const platformRect = {
        x: platform.x - PLATFORM_EDGE_TOLERANCE,
        y: platform.y,
        width: platform.width + 2 * PLATFORM_EDGE_TOLERANCE,
        height: platform.height,
      };
      if (
        this.velY > 0 &&
        this.rectsCollide(playerRect, platformRect)
      ) {
        this.y = platform.y - this.height;
        this.velY = 0;
        this.onGround = true;
        this.canDoubleJump = true;
      }
    }

    // --- Jump charging (Shift key) ---
    if (this.chargeJumping) {
      this.jumpCharge = Math.min(MAX_JUMP_STRENGTH, this.jumpCharge + CHARGE_RATE);
    }
  }

  // Normal jump (Spacebar)
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

  // Start charge (Shift key down)
  startCharge() {
    if (this.onGround) {
      this.chargeJumping = true;
      this.jumpCharge = MIN_JUMP_STRENGTH;
    }
  }

  // Release charge (Shift key up)
  releaseCharge() {
    if (this.chargeJumping && this.onGround) {
      this.velY = -this.jumpCharge;
      this.chargeJumping = false;
      this.jumpCharge = 0;
      this.onGround = false;
      this.canDoubleJump = true;
    } else {
      // Cancel charge if not on ground
      this.chargeJumping = false;
      this.jumpCharge = 0;
    }
  }

  rectsCollide(r1, r2) {
    return !(
      r1.x + r1.width < r2.x ||
      r1.x > r2.x + r2.width ||
      r1.y + r1.height < r2.y ||
      r1.y > r2.y + r2.height
    );
  }

  draw(ctx) {
    ctx.fillStyle = "#0000FF";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
