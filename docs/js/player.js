// js/player.js

import { 
  DESIGN_WIDTH, DESIGN_HEIGHT,
  SQUARE_WIDTH_FRAC, GRAVITY, PLATFORM_EDGE_TOLERANCE
} from './config.js';

export class Player {
  constructor() {
    // Scale player size to the current canvas logical width
    const side = DESIGN_WIDTH * SQUARE_WIDTH_FRAC;
    this.width = side;
    this.height = side;

    // Starting position and nudge logic
    this.x = 100;
    this.y = 320;
    this.default_x = this.x;

    this.velY = 0;
    this.onGround = true;
    this.charging = false;
    this.jumpCharge = 0;
    this.canDoubleJump = true;
  }

  move(platforms) {
    this.velY += GRAVITY;
    this.y += this.velY;
    this.onGround = false;

    // Player rectangle for collision checks
    const playerRect = {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };

    // Platform collision logic
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
        playerRect.y = this.y;
      }
    }
  }

  rectsCollide(r1, r2) {
    // Simple AABB collision
    return !(
      r1.x + r1.width < r2.x ||
      r1.x > r2.x + r2.width ||
      r1.y + r1.height < r2.y ||
      r1.y > r2.y + r2.height
    );
  }

  draw(ctx) {
    ctx.fillStyle = "#0000FF"; // Blue, as in your Python code
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
