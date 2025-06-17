class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
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


  // ✅ 檢查角色是否腳底站在平台上
  isStandingOn(hitbox) {
    const feetY = hitbox.y + hitbox.h;
    const isAbove = feetY <= this.y && feetY + 5 >= this.y; // 容許誤差範圍
    const isWithinX = hitbox.x + hitbox.w > this.x && hitbox.x < this.x + this.w;
    return isAbove && isWithinX;
  }
}

class PlatformManager {
  constructor() {
    this.platforms = [];
    this.groundY = 389;
  }

  setupPlatformsForScene(sceneName) {
    this.platforms = []; // 先清空舊平台

    if (sceneName === "000") {
      this.platforms.push(new Platform(200, 390, 300, 20)); // 地板
      this.platforms.push(new Platform(600, 300, 200, 20)); // 浮空台
    }

    if (sceneName === "001") {
      this.platforms.push(new Platform(100, 350, 400, 20));
      this.platforms.push(new Platform(550, 270, 150, 20));
    }

    // 沒有對應場景則不加平台
  }


  // ✅ 平台碰撞邏輯（將角色貼齊平台頂部）
  checkCollision(cat) {
  
    cat.isOnPlatform = false;

    for (let p of this.platforms) {
      if (p.isStandingOn(cat.hitbox)) {
        cat.adjustToPlatformY(p.y);
        cat.isOnPlatform = true;
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

  display() {
    for (let p of this.platforms) {
      p.display();
    }
  }
}
