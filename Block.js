class Block {
  constructor(x, y, type, sheet, sx, sy, sw = 16, sh = 16, scale = 2) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.sheet = sheet;
    this.sx = sx;
    this.sy = sy;
    this.sw = sw;
    this.sh = sh;
    this.scale = scale;

    this.w = this.sw * this.scale;
    this.h = this.sh * this.scale;

    // ✅ 定義哪些類型有碰撞平台
    this.hasCollision = ["brick", "hard", "mystery", "ground", "pipe", "pipeB"].includes(this.type);

    this.platform = this.getPlatform();

    // ✅ 擴充互動邏輯屬性
    this.hitCount = 0;
    this.maxHits = 1;
    this.itemType = "coin"; // 可設定為 "mushroom"、"star" 等
    this.broken = false;
  }

  display(cameraOffsetX = 0) {
    if (!this.sheet || this.broken) return;

    image(
      this.sheet,
      this.x,
      this.y,
      this.w,
      this.h,
      this.sx,
      this.sy,
      this.sw,
      this.sh
    );

    if (game?.debugMode) {
      push();
      noFill();
      stroke(255, 0, 0);
      rect(this.x, this.y, this.w, this.h);
      pop();
    }
  }

  getPlatform() {
    if (!this.hasCollision || this.broken) return null;

    const platform = new Platform(this.x, this.y, this.w, this.h);
    platform.source = this;
    return platform;
  }

  // ✅ 玩家從下方撞擊 block 時觸發
  onHitFromBelow(cat) {
    if (this.broken) return;

    if (this.type === "mystery") {
      this.triggerItem(this.itemType);
      this.type = "empty";
      this.playBounce();
    } else if (this.type === "brick") {
      if (this.hitCount < this.maxHits) {
        this.spawnCoin();
        this.hitCount++;
        this.playBounce();
        if (this.hitCount >= this.maxHits) {
          this.type = "empty";
        }
      }
    } else if (this.type === "brickBreakable") {
      this.break();
    }
  }

  triggerItem(type) {
    console.log(`🎁 block triggered item: ${type}`);
    // ✅ 可擴充 spawn mushroom 等實體
  }

  spawnCoin() {
    console.log("🪙 block spawned coin");
    // ✅ 可加音效動畫等
  }

  playBounce() {
    // ✅ 可簡化為記錄動畫狀態，這裡先簡單印出
    console.log("🔄 block bounced");
  }

  break() {
    this.broken = true;
    console.log("💥 block broken");
    // ✅ 可加入爆炸動畫、刪除 block、移除平台
  }
}

