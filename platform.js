// platform.js

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

  isItemStandingOn(hitbox) {
    if (!this.active) return false;

    const feetY = hitbox.y + hitbox.h;
    const footCenter = hitbox.x + hitbox.w / 2;

    const isWithinX = footCenter >= this.x && footCenter <= this.x + this.w;
    const isTouchingTop = Math.abs(feetY - this.y) <= 1; // 誤差容許

    return isWithinX && isTouchingTop;
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

  display(debugMode = false) {
    for (let p of this.platforms) {
      p.display(debugMode);
    }
  }
  
  getStandingPlatform(hitbox) {
    for (let p of this.platforms) {
      if (!p.active) continue;

      // 這裡用類似 isStandingOn 的條件，但不需要 cat，只用 hitbox
      const feetY = hitbox.y + hitbox.h;
      const footCenter = hitbox.x + hitbox.w / 2;

      const isWithinX = footCenter >= p.x && footCenter <= p.x + p.w;
      const isAlignedY = Math.abs(feetY - p.y) < 1; // 可調容差值

      if (isWithinX && isAlignedY) {
        return p;
      }
    }
    return null;
  }


  checkCollision(cat, allBlocks = []) {
    cat.isOnPlatform = false;
    let landed = false;

    for (let p of this.platforms) {
      if (!p.active) continue;

      if (p.isStandingOn(cat.hitbox, cat)) {
        cat.adjustToPlatformY(p.y);
        cat.vy = 0;
        cat.isOnPlatform = true;

        if (!landed) {
          if (typeof cat.onLanded === 'function') {
            cat.onLanded();
          }
          landed = true;
        }
      }
    }

    for (let p of this.platforms) {
      if (!p.active) continue;

      const headY = cat.hitbox.y;
      const headCenter = cat.hitbox.x + cat.hitbox.w / 2;
      const isBelow = Math.abs(p.y + p.h - headY) <= 6;
      const isWithinX = headCenter >= p.x && headCenter <= p.x + p.w;
      const isJumpingUp = cat.vy < 0;

      if (isBelow && isWithinX && isJumpingUp) {
        const targetBlock = allBlocks.find(b => b.platform === p);
        if (targetBlock) {
          targetBlock.onHitFromBelow?.(cat);
        cat.vy = 0;
        }
      }
    }

    for (let p of this.platforms) {
      if (!p.active) continue;

      const a = cat.hitbox;
      const b = p;

      const horizontalOverlap = a.x < b.x + b.w && a.x + a.w > b.x;
      const verticalOverlap = a.y < b.y + b.h && a.y + a.h > b.y;

      if (horizontalOverlap && verticalOverlap) {
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
            if (!landed && typeof cat.onLanded === 'function') cat.onLanded();
          } else {
            cat.y += overlapY;
            cat.vy = 0;
          }
        }
        cat.hitbox = cat.getHitbox();
      }
    }

    cat.hitbox = cat.getHitbox();
  }
}
