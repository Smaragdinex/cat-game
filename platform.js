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

    const feetY = hitbox.y + hitbox.h;
    const wasAbove = cat.prevFeetY <= this.y;
    const nowBelow = feetY >= this.y;
    const isCrossing = wasAbove && nowBelow;

    const footCenter = hitbox.x + hitbox.w / 2;
    const isWithinX = footCenter >= this.x && footCenter <= this.x + this.w;

    const isFalling = cat.vy >= 0;

    const result = isCrossing && isWithinX && isFalling;
  
    // ✅ 只印失敗情況，協助定位
    if (!result && nowBelow && isFalling) {
      console.log(
        `[平台偵測失敗] pY=${this.y} | wasAbove=${wasAbove} | nowBelow=${nowBelow} | footY=${feetY} | footCenter=${footCenter} | isWithinX=${isWithinX} | vy=${cat.vy}`
      );
    }

    return result;
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
      if (!p.active) continue;

      if (p.y === 400) {
        console.log(`✅ Ground platform 參與碰撞：p.x=${p.x} ~ ${p.x + p.w}`);
      }

      if (p.isStandingOn(cat.hitbox, cat)) {
        cat.adjustToPlatformY(p.y);
        cat.isOnPlatform = true;
        cat.vy = 0;

        if (typeof cat.onLanded === 'function') {
          cat.onLanded();
        }

        return;
      }
    }

    // ✅ 不再限制 cat.y，不強制貼回地面，讓角色自由掉落
    // （由死亡判定腳底觸發控制死亡）

    // ✅ 更新碰撞框（確保下一幀正確）
    cat.hitbox = cat.getHitbox();
  }

  display(debugMode = false) {
    for (let p of this.platforms) {
      p.display(debugMode);
    }
  }
}


// ✅ platform.js 內需搭配以下 checkCollision 方法：

PlatformManager.prototype.checkCollision = function(cat, allBlocks = []) {
  cat.isOnPlatform = false;

   // ✅ 處理落地邏輯（改為呼叫 isStandingOn）
  for (let p of this.platforms) {
    if (!p.active) continue;

    if (p.isStandingOn(cat.hitbox, cat)) {
      cat.adjustToPlatformY(p.y);
      cat.isOnPlatform = true;
      cat.vy = 0;

      if (typeof cat.onLanded === 'function') {
        cat.onLanded();
      }

      return;
    }
  }


  // ✅ 處理從下方撞擊 block 的邏輯
  for (let p of this.platforms) {
    if (!p.active) continue;

    const headY = cat.hitbox.y;
    const headCenter = cat.hitbox.x + cat.hitbox.w / 2;
    const isBelow = Math.abs(p.y + p.h - headY) <= 6;
    const isWithinX = headCenter >= p.x && headCenter <= p.x + p.w;
    const isJumpingUp = cat.vy < 0;

    if (isBelow && isWithinX && isJumpingUp) {
      const targetBlock = allBlocks.find(b => b.platform === p);
      if (targetBlock) targetBlock.onHitFromBelow?.(cat);
      cat.vy = 0;
    }
  }
  
  // ✅ 橫向碰撞處理（左右牆壁阻擋）
  for (let p of this.platforms) {
    if (!p.active) continue;

    const a = cat.hitbox;
    const b = p;

    if (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    ) {
      const overlapX = (a.x + a.w / 2 < b.x + b.w / 2)
        ? (a.x + a.w) - b.x
        : b.x + b.w - a.x;
      const overlapY = (a.y + a.h / 2 < b.y + b.h / 2)
        ? (a.y + a.h) - b.y
        : b.y + b.h - a.y;

      if (overlapX < overlapY) {
        if (a.x + a.w / 2 < b.x + b.w / 2) {
          cat.x -= overlapX;
        } else {
          cat.x += overlapX;
        }
        cat.vx = 0;
      } else {
        if (a.y + a.h / 2 < b.y + b.h / 2) {
          cat.y -= overlapY;
          cat.vy = 0;
          cat.isOnPlatform = true;
          if (typeof cat.onLanded === 'function') cat.onLanded();
        } else {
          cat.y += overlapY;
          cat.vy = 0;
        }
      }
       cat.hitbox = cat.getHitbox();
    }
  }

  // ✅ 更新碰撞框（確保下一幀正確）
  cat.hitbox = cat.getHitbox();
};