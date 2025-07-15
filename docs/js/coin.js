// js/coin.js

export class StarCoin {
  constructor(x, y, coinImage) {
    this.coinImage = coinImage;
    this.width = coinImage.width;
    this.height = coinImage.height;
    this.x = x;
    this.y = y;
  }

  draw(ctx) {
    ctx.drawImage(this.coinImage, this.x, this.y, this.width, this.height);
  }

  getRect() {
    // For collision checking (AABB)
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}
