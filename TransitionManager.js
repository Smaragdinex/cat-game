class TransitionManager {
  constructor() {
    this.active = false;
    this.opacity = 0;
    this.speed = 5; // 控制淡入淡出的速度
    this.mode = null; // 'out' → 淡出黑, 'in' → 淡入遊戲
    this.onComplete = null;
  }

  start(callback) {
    this.active = true;
    this.mode = 'out';
    this.opacity = 0;
    this.onComplete = callback;
  }

  update() {
    if (!this.active) return;

    if (this.mode === 'out') {
      this.opacity += this.speed;
      if (this.opacity >= 255) {
        this.opacity = 255;
        if (this.onComplete) {
          this.onComplete();        // ⬅️ 切換場景
        }
        this.mode = 'in';           // ⬅️ 進入下一階段
      }
    } else if (this.mode === 'in') {
      this.opacity -= this.speed;
      if (this.opacity <= 0) {
        this.opacity = 0;
        this.active = false;       // ⬅️ 淡入結束
      }
    }
  }

  draw() {
    if (!this.active) return;
    fill(0, this.opacity);
    noStroke();
    rect(0, 0, width, height);
  }

}
