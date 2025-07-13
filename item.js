class Item {
  constructor(type, x, y, framesOrSprite) {
    this.type = type;   // "coin", "fish", "key"
    this.x = x;
    this.y = y;
    this.w = 32;
    this.h = 32;
    this.collected = false;
    
    this.vx = 0;              
    this.vy = 0;              
    this.ay = 0;              
    this.floating = false;   
    this.spawnOffset = 0;
    this.attachedBlock = null; 
    
    if (type === "coin" && Array.isArray(framesOrSprite)) {
      this.frames = framesOrSprite; // ⬅️ 傳入的是 array
      this.frameIndex = 0;
      this.frameCount = 0;
      this.frameDelay = 6; // 每幾幀切換一次
    } else {
      this.sprite = framesOrSprite; // 單張圖
    }
  }
  
  getHitbox() {
      return {
        x: this.x,
        y: this.y,
        w: this.w,
        h: this.h
      };
    }

  update() {
    console.log("🟢 update() 有執行, collected=", this.collected, "floating=", this.floating);

    if (this.collected) return;

    if (this.type === "coin" && this.frames) {
      this.frameCount++;
      if (this.frameCount % this.frameDelay === 0) {
        this.frameIndex = (this.frameIndex + 1) % this.frames.length;
      }
    }

    // ✅ 如果還在浮動，先執行浮動
    if (this.floating) {
      this.y += this.vy;
      this.spawnOffset += this.vy;
      if (this.spawnOffset <= 0) {
        this.floating = false;
        console.log("🟢 浮動結束，清除 attachedBlock");
        this.attachedBlock = null;
        console.log("🟢 浮動結束，attachedBlock已清空:", this.attachedBlock);
        if (this.type === "fish") {
          this.vx = 2.0;
          this.ay = 0.5;
          this.vy = 0;
          console.log("🐟 魚浮出完成，開始移動 vx =", this.vx);
        }
      }
      return;
    }

    // ✅ 如果還在附著，就繼續跟著block
    if (this.attachedBlock) {
      console.log("🔍 目前attachedBlock還存在", this.attachedBlock);
      this.y = this.attachedBlock.y - this.h;
      // ⚠️ 如果它已經不應該存在，這裡要立刻清掉
      if (!this.floating && this.type === "fish") {
        console.warn("⚠️ fish 已經不在浮動但還有attachedBlock，強制清空");
        this.attachedBlock = null;
      }
      return;
    }

    // 🟢 正常掉落
    this.x += this.vx ?? 0;
    this.vy += this.ay ?? 0;
    this.y += this.vy ?? 0;

    // 偵測落地
    for (let platform of miniGameManager.platformManager.platforms) {
      // 假設每個平台有 x, y, w, h
      if (
        this.x + this.w > platform.x &&
        this.x < platform.x + platform.w &&
        this.y + this.h <= platform.y + this.vy && // 本次移動前在上方
        this.y + this.h + this.vy >= platform.y    // 本次移動後將要穿越
      ) {
        // 落地
        this.y = platform.y - this.h;
        this.vy = 0;
      }
    }
    
    handlePipeSideCollision(this, miniGameManager.pipes || []);

  }
    

  

  display() {
    if (this.collected) return;
    let img = this.sprite;
    
    if (this.type === "coin" && this.frames) {
      img = this.frames[this.frameIndex];
    }
    
    if (!img) {
      console.warn("❗ Item image is undefined:", this.type, this);
      return;
    }

    image(img, this.x, this.y, this.w, this.h);
  }

  checkCollisionWith(cat) {
    if (this.collected) return false;

    const a = {
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h
    };
    const b = cat.hitbox;

    const overlap = (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );

    if (overlap) {
      this.collected = true;
      this.onCollected(cat);
      return true;
    }

    return false;
  }

  onCollected(cat) {
    if (this.type === "coin") {
      console.log("🪙 貓咪吃到金幣！");
      // 增加分數、播放音效...
    } else if (this.type === "fish") {
      console.log("🐟 貓咪吃到魚了！");
      cat.state = "big"; // 例如成長
    } else if (this.type === "key") {
      console.log("🗝️ 貓咪撿到鑰匙！");
      cat.hasKey = true;
    }
  }
}
// item.js
function getItemsForMiniGame(coinImgs, fishImg, keyImg) {
  return [
    //new Item("coin", 500, 350, coinImgs),
  ];
}


function handlePipeSideCollision(item, pipes) {
  for (let pipe of pipes) {
    // 假設pipe有 {x,y,w,h,type}
    if (pipe.type !== "pipe") continue;

    // 只有當y高度重疊才要檢查左右
    if (
      item.y + item.h > pipe.y &&
      item.y < pipe.y + pipe.h
    ) {
      // 從右撞到左側
      if (
        item.vx > 0 &&
        item.x + item.w <= pipe.x &&
        item.x + item.w + item.vx >= pipe.x
      ) {
        item.x = pipe.x - item.w;
        item.vx *= -1;
        console.log("🟢 從右撞到水管左側，反向");
      }

      // 從左撞到右側
      if (
        item.vx < 0 &&
        item.x >= pipe.x + pipe.w &&
        item.x + item.vx <= pipe.x + pipe.w
      ) {
        item.x = pipe.x + pipe.w;
        item.vx *= -1;
        console.log("🟢 從左撞到水管右側，反向");
      }
    }
  }
}
