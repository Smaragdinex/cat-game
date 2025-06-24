class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.active = true;
  }

  display(debugMode = false) {
    if (!debugMode) return;

    push();
    noFill();
    stroke(0, 255, 255); // Cyan
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.h);
    pop();
  }

  isStandingOn(hitbox, cat) {
    if (!this.active) return false;
    const footCenter = hitbox.x + hitbox.w / 2;
    const feetY = hitbox.y + hitbox.h;
    const isAbove = Math.abs(feetY - this.y) <= 6;
    const isWithinX = footCenter >= this.x && footCenter <= this.x + this.w;
    const isFalling = cat.vy >= 0;
    return isAbove && isWithinX && isFalling;
  }
}

class PlatformManager {
  constructor() {
    this.platforms = [];
    this.groundY = 389;
  }

  setupPlatformsForScene(sceneName) {
    this.platforms = [];
    // 自定場景平台清單
  }

  checkCollision(cat) {
    cat.isOnPlatform = false;

    // ✅ 獲取當前畫面範圍
    const visibleLeft = game?.miniGameManager?.cameraOffsetX ?? 0;
    const visibleRight = visibleLeft + width;

    for (let p of this.platforms) {
      if (p.isStandingOn(cat.hitbox, cat)) {
        cat.adjustToPlatformY(p.y);
        cat.isOnPlatform = true;
        cat.vy = 0;
        break;
      }
    }

    if (!cat.isOnPlatform) {
      cat.y += 5; // 模擬簡單重力
      const offsetY = cat.hitbox.y - cat.y;
      const maxY = this.groundY - cat.hitboxHeight - offsetY;
      if (cat.y > maxY) cat.y = maxY;
    }

    cat.hitbox = cat.getHitbox(); // 更新 hitbox
  }

  display(debugMode = false) {
    for (let p of this.platforms) {
      p.display(debugMode);
    }
  }
}
