// VirtualJoystick.js (Class Version)

class VirtualJoystick {
  constructor(baseX, baseY, radius = 40) {
    this.baseX = baseX;
    this.baseY = baseY;
    this.radius = radius;
    this.knobX = baseX;
    this.knobY = baseY;
    this.inputVector = { x: 0, y: 0 };
    this.active = true;
  }

  isMobile() {
    return /iPhone|iPad|Android/i.test(navigator.userAgent);
  }

  update(touchPoints) {
    if (!this.active) return;

    this.inputVector = { x: 0, y: 0 }; // 重設方向
    for (let t of touchPoints) {
      const dx = t.x - this.baseX;
      const dy = t.y - this.baseY;
      const distFromCenter = dist(t.x, t.y, this.baseX, this.baseY);

      if (distFromCenter < this.radius) {
        this.knobX = t.x;
        this.knobY = t.y;

        const len = max(1, sqrt(dx * dx + dy * dy));
        this.inputVector.x = dx / len;
        this.inputVector.y = dy / len;
        return;
      }
    }

    // 沒碰到 → knob回中
    this.knobX = this.baseX;
    this.knobY = this.baseY;
  }

  draw() {
    if (!this.active) return;

    // 畫底座
    fill(180, 180, 180, 80);
    noStroke();
    ellipse(this.baseX, this.baseY, this.radius * 2);

    // 畫搖桿控制圓
    fill(100, 100, 100, 180);
    ellipse(this.knobX, this.knobY, 28);
  }

  getDirection() {
    return this.inputVector;
  }

  drawDebug() {
    if (!this.active) return;

    // 底座中心點
    stroke(0, 255, 255);
    strokeWeight(2);
    noFill();
    ellipse(this.baseX, this.baseY, this.radius * 2);

    // 畫方向箭頭
    const arrowScale = 40;
    const endX = this.baseX + this.inputVector.x * arrowScale;
    const endY = this.baseY + this.inputVector.y * arrowScale;

    stroke(255, 100, 100);
    line(this.baseX, this.baseY, endX, endY);
    fill(255, 100, 100);
    ellipse(this.knobX, this.knobY, 12); // 當前 knob 圓圈
  }

  // 📦 動態調整搖桿位置（可在 resize 或設計階段呼叫）
  setPosition(x, y) {
    this.baseX = x;
    this.baseY = y;
    this.knobX = x;
    this.knobY = y;
  }
}

// ✅ 管理搖桿位置（建議在 setup 或 resize 時呼叫）
function joystickPositionManager(joystick) {
  const marginX = 60;      
  const marginY = 65;
  const x = marginX;
  const y = height - marginY;
  joystick.setPosition(x, y);
}
