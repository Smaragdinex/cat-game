// VirtualJoystick.js (Class Version)

class VirtualJoystick {
  constructor(baseX, baseY, radius = 40) {
    this.baseX = baseX;
    this.baseY = baseY;
    this.radius = radius;
    this.knobX = baseX;
    this.knobY = baseY;
    this.inputVector = { x: 0, y: 0 };
    this.active = this.isMobile();
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
} 

// 使用方法：
// joystick = new VirtualJoystick(100, height - 100);
// joystick.update(touches);
// joystick.draw();
// let dir = joystick.getDirection();
// if (dir.x > 0.5) ...  // 控制右移
