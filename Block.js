const BlockConfig = {
  // 會裂開的磚塊（撞一次就爆）
  breakableBricks: new Set([
  ]),

  // 撞幾次會變 empty 的磚塊（brick 類）
  hitBricks: new Map([
    ["2592,300", 2]
  ])
};

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
    
    this.vy = 0;             
    this.originalY = this.y; 
    
    if (this.type === "brick") {
      const key = `${this.x},${this.y}`;

      if (BlockConfig.breakableBricks.has(key)) {
        this.type = "brickBreakable"; // ✅ 改為會爆的磚
      } else if (BlockConfig.hitBricks.has(key)) {
        this.hitCount = 0;
        this.maxHits = BlockConfig.hitBricks.get(key);
        this.hasCoin = true;
      } else {
        // 預設：不能破壞，只會彈跳
        this.hitCount = 0;
        this.maxHits = Infinity;
        this.hasCoin = false;
      }
    }
    
    if (this.type === "mystery") {
      this.animationFrame = 0;
      this.animationSpeed = 5; // 每幾幀切換一次（可以調整）
      this.frameCount = 0;
      this.totalFrames = 3;
    }

  }
  
  update() {
      if (this.y !== this.originalY || this.vy !== 0) {
        this.y += this.vy;
        this.vy += 0.5; // 模擬重力加速度，讓磚塊下來

        if (this.y >= this.originalY) {
          this.y = this.originalY;
          this.vy = 0;
        }
        // ✅ 同步更新平台位置
        if (this.platform) {
          this.platform.y = this.y;
        }
      }
        
        // ✅ 如果是 mystery block，就更新動畫格
        if (this.type === "mystery") {
          this.frameCount++;
          if (this.frameCount % this.animationSpeed === 0) {
            this.animationFrame = (this.animationFrame + 1) % this.totalFrames;
          }
        }
  }

  display(cameraOffsetX = 0) {
    if (!this.sheet || this.broken) return;
    
    let sx = this.sx;
    let sy = this.sy;
    let sourceImg = this.sheet;

    if (this.type === "mystery" && typeof mysteryAnimImg !== "undefined") {
      sourceImg = mysteryAnimImg;
      const frame = this.animationFrame;
        if (frame === 0) {
          sx = 0; sy = 0;
        } else if (frame === 1) {
          sx = 16; sy = 0;
        } else if (frame === 2) {
          sx = 0; sy = 16;
        }
    }

    image(
      sourceImg,
      this.x,
      this.y,
      this.w,
      this.h,
      sx,
      sy,
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

    if (!this.platform) {
      this.platform = new Platform(this.x, this.y, this.w, this.h);
      this.platform.source = this;
    }

    return this.platform;
  }

triggerItem(type) {
  
  if (!type || !miniGameManager) return;

  let sprite;

  switch (type) {
    case "coin":
      sprite = coinImgs;  // ✅ 動畫陣列
      break;
    case "fish":
      sprite = fishImg;
      break;
    default:
      return;
  }

  const item = new Item(type, this.x, this.y - 32, sprite);
  
  item.attachedBlock = this;
  
  if (type === "fish") {
    item.spawnOffset = 16;     // 要浮出的距離
    item.vy = -1;              // 浮動速度
    item.floating = true;      // 開始浮動
  }

  miniGameManager.items.push(item);
}



  // ✅ 玩家從下方撞擊 block 時觸發
  onHitFromBelow(cat) {
    if (this.broken) return;

    if (this.type === "mystery") {
      this.triggerItem(this.itemType);
      this.type = "empty";
      this.sx = 32;              
      this.sy = 0;
      this.playBounce();
    } else if (this.type === "brick") {
      if (this.hitCount < this.maxHits) {
        if (this.hasCoin) this.spawnCoin(); // ✅ 只有指定過才冒金幣
        this.hitCount++;
        this.playBounce();

        if (this.hitCount >= this.maxHits && this.maxHits !== Infinity) {
        this.type = "empty";
        }
      }
    } else if (this.type === "brickBreakable") {
      this.break();
    }
  }

  spawnCoin() {
    console.log("🪙 block spawned coin");
    // ✅ 可加音效動畫等
  }

  playBounce() {
    this.vy = -3; // 控制彈跳的初速度，可依喜好調整
  }

  break() {
    this.broken = true;
  }
}

