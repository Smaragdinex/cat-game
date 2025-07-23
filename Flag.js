class Flag {
  constructor(x, y, poleImg, flagImg) {
    this.x = x;
    this.baseY = y;
    this.y = y;
    this.poleImg = poleImg;
    this.flagImg = flagImg;
    this.w = 32;
    this.h = 320; // 高度自己調整
    this.collected = false;
  }

  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h
    };
  }
  
  startSlideDown() {
    if (this.floating) return;
    this.floating = true;
    this.slideStartY = this.y;
    this.slideTargetY = this.baseY + this.h - 48;
    this.slideProgress = 0;
  }

  update() {
    if (this.floating && this.slideProgress < 1) {
      this.slideProgress += 0.02;
      this.y = lerp(this.slideStartY, this.slideTargetY, this.slideProgress);
    }
  }

  display(offsetX = 0) {  
    // 先畫旗桿
    image(this.poleImg, this.x - offsetX, this.baseY, this.w, this.h);

    // 設定旗子位置（旗子會在桿子右上角）
    const flagX = this.x - offsetX + this.w / 1.7;
    const flagY = this.y + 25;

    // ⬅ 水平翻轉旗子（三角朝右）
    push();
    translate(flagX + 12, flagY + 12);  // ⬅ 將座標移到旗子中心
    scale(-1, 1);                        // ⬅ 水平翻轉
    image(this.flagImg, -12, -12, 24, 24); // ⬅ 從中心點畫出
    pop();
  }

  checkCollision(cat, onCollide) {
    if (this.collected) return;

    const catHitbox = cat.getHitbox();
    const flagHitbox = this.getHitbox();

    const overlap = (
      catHitbox.x < flagHitbox.x + flagHitbox.w &&
      catHitbox.x + catHitbox.w > flagHitbox.x &&
      catHitbox.y < flagHitbox.y + flagHitbox.h &&
      catHitbox.y + catHitbox.h > flagHitbox.y
    );

    if (overlap) {
      this.collected = true;
      if (typeof onCollide === "function") onCollide();
    }
  }
  
}
