class TrainShaker {
  constructor() {
    this.intensity = 2.0;     // 震動強度
    this.shakeDuration = 3000; // 每次震動持續時間（毫秒）
    this.shakeInterval = 20000; // 間隔時間（毫秒）10 秒
    this.lastShakeTime = 0;
    this.shaking = false;
    this.time = 0;
  }

  start() {
    this.enabled = true;
  }

  stop() {
    this.enabled = false;
    this.shaking = false;
  }

  update() {
    if (!this.enabled) return;

    const now = millis();

    // 是否該開始震動？
    if (!this.shaking && now - this.lastShakeTime > this.shakeInterval) {
      this.shaking = true;
      this.shakeStartTime = now;
      this.lastShakeTime = now;
    }

    // 是否該結束震動？
    if (this.shaking && now - this.shakeStartTime > this.shakeDuration) {
      this.shaking = false;
    }

    if (this.shaking) {
      this.time += 0.1;
      const offsetX = random(-this.intensity, this.intensity);
      const offsetY = sin(this.time * 20) * this.intensity;
      push();
      translate(offsetX, offsetY);
    }
  }

  reset() {
    if (this.shaking) {
      pop(); // 還原畫布狀態
    }
  }
}
