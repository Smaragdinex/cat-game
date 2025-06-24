
let miniGameManager;
let hillImg, cloudImg, bushImg;
let overworldImg;
let minigameBgm;


class MiniGameManager {
  constructor() {
    this.state = "idle";
    this.cat = null;
    this.platformManager = new PlatformManager();
    this.gravity = 1;
    this.jumpStrength = -20;
    this.isJumping = false;
    this.cameraOffsetX = 0;
    this.mapWidth = 4096; 
    this.blocks = [];
    this.decorations = [];
  }

  start() {
    this.state = "playing";
    this.isJumping = false;
    this.blocks = [];

    // ✅ 加入所有磚塊（地板 + 上層）
    for (let i = 0; i < 41; i++) {
      let x = i * 32;
      this.blocks.push(new Block(x, 400, "ground", overworldImg, 0, 0));
    }

    this.blocks.push(
      new Block(416, 300, "hard", overworldImg, 16, 0),
      new Block(448, 300, "empty", overworldImg, 32, 0),
      new Block(480, 300, "brick", overworldImg, 48, 0),
      new Block(512, 300, "mystery", overworldImg, 64, 0)
    );

    // ✅ 自動加入有碰撞的 Block 所對應的平台
    for (let block of this.blocks) {
      const platform = block.getPlatform();
      if (platform) {
        this.platformManager.platforms.push(platform);
      }
    }

    // ✅ 裝飾物（純顯示用）
    this.decorations = [
      new Decoration(10, 308, overworldImg, 48, 64, 80, 48, 160, 96),
      new Decoration(300, 368, overworldImg, 8, 96, 32, 16, 64, 32),
      new Decoration(600, 80, overworldImg, 88, 33, 32, 22, 64, 44),
      new Decoration(800, 308, overworldImg, 96, 0, 32, 13, 64, 32),
      new Decoration(800, 340, overworldImg, 96, 18, 32, 14, 64, 32),
      new Decoration(800, 371, overworldImg, 96, 18, 32, 14, 64, 32)
    ];

    if (game?.cat) {
      this.cat = game.cat;
      this.cat.x = 0;
      this.cat.y = 325;
      this.cat.vx = 0;
      this.cat.vy = 0;
      this.cat.hitbox = this.cat.getHitbox();
      this.cat.debugMode = false;
    }
  }

  
  
  update() {
    if (this.state !== "playing" || !this.cat) return;

    // ✅ 角色與螢幕滑動邏輯（角色中心對齊畫面中心）
    const catCenterX = this.cat.x + this.cat.width / 2;
    this.cameraOffsetX = catCenterX - width / 2;
    this.cameraOffsetX = constrain(this.cameraOffsetX, 0, this.mapWidth - width);

    // ✅ 模擬重力
    this.cat.vy += this.gravity;
    this.cat.y += this.cat.vy;

    // ✅ 更新碰撞框
    this.cat.hitbox = this.cat.getHitbox();

    // ✅ 檢查與平台碰撞
    this.cat.isOnPlatform = false;

    for (let p of this.platformManager.platforms) {
      if (!p.active) continue;

      // ✅ 判斷貓腳中心是否站在平台上（精準）
      const footCenter = this.cat.hitbox.x + this.cat.hitbox.w / 2;
      const feetY = this.cat.hitbox.y + this.cat.hitbox.h;

      const isAbove = Math.abs(feetY - p.y) <= 6;
      const isWithinX = footCenter >= p.x && footCenter <= p.x + p.w;
      const isFalling = this.cat.vy >= 0;

      if (isAbove && isWithinX && isFalling) {
        this.cat.adjustToPlatformY(p.y);
        this.cat.isOnPlatform = true;
        this.cat.vy = 0;
        this.isJumping = false;
        break;
      }
    }

    // ✅ 掉出畫面底部就死亡（y 超過畫布 + buffer）
    if (!this.cat.isOnPlatform && !this.cat.isDead && this.cat.y > height + 100) {
      this.cat.isDead = true;
      this.cat.vx = 0;
      this.cat.vy = 0;
      this.cat.deathTime = millis();
      console.log("🐱 死亡：掉出畫面");
    }

    // ✅ 死亡後 2 秒自動重開
    if (this.cat.isDead && millis() - this.cat.deathTime > 2000) {
      this.start(); // ✅ 重新開始
    }


    // ✅ 更新角色
    this.cat.x = constrain(this.cat.x, 0, this.mapWidth - this.cat.width - 100);
    this.cat.update();
  }



  jump() {
    if (!this.isJumping && this.cat?.isOnPlatform) {
      this.cat.vy = this.jumpStrength;
      this.isJumping = true;
    } 
  }

  moveLeft() {
    if (this.cat) this.cat.vx = -2;
  }

  moveRight() {
    if (this.cat) this.cat.vx = 2;
  }

  stop() {
    if (this.cat) this.cat.vx = 0;
  }

  
  draw() {
    if (this.state !== "playing" || !this.cat) return;

    background(135, 206, 235);
    push(); // ✅ 全部使用 translate 控制畫面位移
    translate(-this.cameraOffsetX, 0);

    this.drawVisibleScreenDebug();

    // ✅ 顯示所有裝飾物（內部會使用 offset 計算）
    for (let deco of this.decorations) {
      deco.display(0); // ✅ 讓裝飾也改用 translate 控制畫面位置
    }

    // ✅ 顯示 block（直接使用世界座標，因為已在 translate 區域內）
    for (let block of this.blocks) {
      block.display(); // ✅ 改為不傳 offset，讓 block.x 是 world 座標
    }

    // ✅ 顯示平台碰撞框
    this.platformManager.display(this.debugMode);

    // ✅ 顯示角色與碰撞框
    this.cat.display();
    this.cat.debugDrawHitbox();

    // ✅ 顯示平台紅框 tile 編號
    this.drawPlatformTilesWithDebug();

    pop();
  }


  keyPressed(keyCode) {
    if (keyCode === 32) this.jump();
    if (keyCode === LEFT_ARROW || keyCode === 65) this.moveLeft();
    if (keyCode === RIGHT_ARROW || keyCode === 68) this.moveRight();
  }

  keyReleased(keyCode) {
    if ([LEFT_ARROW, RIGHT_ARROW, 65, 68].includes(keyCode)) {
      this.stop();
    }
  }

  drawVisibleScreenDebug() {
    if (!this.debugMode) return;
    push();
    noFill();
    stroke(0, 255, 0);
    strokeWeight(2);
    rect(this.cameraOffsetX, 0, width, height);
    pop();

    fill(0);
    noStroke();
    textSize(14);
    textAlign(LEFT, TOP);
    text(`VisibleX: ${this.cameraOffsetX} ~ ${this.cameraOffsetX + width}`, this.cameraOffsetX + 10, 10);
  }

  drawPlatformTilesWithDebug() {
    const visibleStart = this.cameraOffsetX;
    const visibleEnd = this.cameraOffsetX + width;

    for (let i = 0; i < this.platformManager.platforms.length; i++) {
      const p = this.platformManager.platforms[i];

      // ✅ 僅畫出畫面內的平台
      if (p.x + p.w < visibleStart || p.x > visibleEnd) continue;

      if (this.debugMode) {
        // 畫每個 tile（紅框）
        const tileStartX = Math.floor(p.x / 32) * 32;
        const tileEndX = Math.ceil((p.x + p.w) / 32) * 32;

        for (let x = tileStartX; x < tileEndX; x += 32) {
          stroke(255, 0, 0);
          noFill();
          rect(x, p.y, 32, 32);

          fill(255);
          noStroke();
          textSize(12);
          textAlign(CENTER, CENTER);
          text(`${x / 32}`, x + 16, p.y + 8);
        }

        // 畫平台 cyan 框
        stroke(0, 255, 255);
        noFill();
        rect(p.x, p.y, p.w, p.h);

        fill(0, 255, 255);
        noStroke();
        textSize(12);
        text(`P${i}`, p.x + 4, p.y - 12);
      }
    }
  }

}

function startMiniGame() {
  miniGameManager = new MiniGameManager();
  miniGameManager.start();
  game.mode = "minigame";
}

function updateMiniGame() {
  miniGameManager?.update();
}

function drawMiniGame() {
  miniGameManager?.draw();
}

function keyPressedMiniGame(keyCode) {
  miniGameManager?.keyPressed(keyCode);
  if (keyCode === 68) {
    if (miniGameManager) {
      miniGameManager.debugMode = !miniGameManager.debugMode;
    }
  }
}

function keyReleasedMiniGame(keyCode) {
  miniGameManager?.keyReleased(keyCode);
}

function preloadMiniGameAssets() {
  cloudImg = loadImage("data/minigame/Cloud1.png");
  hillImg = loadImage("data/minigame/Hill1.png");
  bushImg = loadImage("data/minigame/Bush1.png");
  overworldImg = loadImage("data/minigame/OverWorld.png");
  minigameBgm = loadSound("data/minigame/001.mp3");

}


function startMiniGame() {
  miniGameManager = new MiniGameManager();
  miniGameManager.start();
  game.mode = "minigame";

  // ✅ 停掉任何舊 BGM
  stopBgm();

  // ✅ 用封裝播放新 BGM，避免重複
  if (minigameBgm) {
    playBgm(minigameBgm); // 使用封裝函式播放
  }
}


function stopMinigameBgm() {
  if (minigameBgm && minigameBgm.isPlaying()) {
    minigameBgm.stop();
  }
}

