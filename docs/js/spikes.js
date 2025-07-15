// js/spikes.js

import { 
  DESIGN_WIDTH,
  DESIGN_HEIGHT,
  SPIKE_HEIGHT_FRAC,
  SPIKE_COUNT
} from './config.js';
import { SPIKE_COLOR } from './config.js';

export class Spikes {
  constructor() {
    this.height = DESIGN_HEIGHT * SPIKE_HEIGHT_FRAC;
    this.y = DESIGN_HEIGHT - this.height;
  }

  draw(ctx) {
    const spikeWidth = DESIGN_WIDTH / SPIKE_COUNT;
    for (let i = 0; i < SPIKE_COUNT; i++) {
      const leftX = i * spikeWidth;
      const rightX = (i + 1) * spikeWidth;
      const apexX = leftX + (spikeWidth / 2);
      const apexY = this.y;

      // Vertices for the triangle spike
      const baseLeft = { x: leftX,  y: this.y + this.height };
      const baseRight = { x: rightX, y: this.y + this.height };
      const apex = { x: apexX, y: apexY };

      ctx.beginPath();
      ctx.moveTo(baseLeft.x, baseLeft.y);
      ctx.lineTo(baseRight.x, baseRight.y);
      ctx.lineTo(apex.x, apex.y);
      ctx.closePath();
      ctx.fillStyle = SPIKE_COLOR;
      ctx.fill();
    }
  }
}
