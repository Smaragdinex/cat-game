class Decoration {
  constructor(x, y, spritesheet, sx, sy, sw, sh, dw = sw, dh = sh) {
    this.x = x;
    this.y = y;
    this.sheet = spritesheet;
    this.sx = sx;
    this.sy = sy;
    this.sw = sw;
    this.sh = sh;
    this.dw = dw;
    this.dh = dh;
  }

  display(offsetX = 0) {
    image(
      this.sheet,
      this.x - offsetX, this.y, this.dw, this.dh,
      this.sx, this.sy, this.sw, this.sh
    );
  }
}
