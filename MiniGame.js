let miniGameManager;
let hillImg, cloudImg, bushImg;
let overworldImg;
let minigameBgm;
let playMusic = false; // turn off music


class MiniGameManager {
  constructor() {
    this.state = "idle";
    this.cat = null;
    this.platformManager = new PlatformManager();
    this.gravity = 1;
    this.jumpStrength = -16;
    this.isJumping = false;
    this.cameraOffsetX = 0;
    this.mapWidth = 4096; 
    this.blocks = [];
    this.decorations = [];
    this.debugMode = false;

  }

  start() {
    this.state = "playing";
    this.isJumping = false;
    this.platformManager.platforms = [];
    this.blocks = [];
    this.pipes = [];
    
    // ✅ 加入所有磚塊（地板 + 上層）
    for (let i = 0; i < 81; i++) {
      let x = i * 32;
      this.blocks.push(new Block(x, 400, "ground", overworldImg, 0, 0));
    }

    this.blocks.push(
        new Block(480, 300, "mystery", overworldImg, 64, 0),
        new Block(608, 300, "brick", overworldImg, 48, 0),
        new Block(640, 300, "mystery", overworldImg, 64, 0),
        new Block(672, 300, "brick", overworldImg, 48, 0), // mid
        new Block(704, 300, "mystery", overworldImg, 64, 0),
        new Block(736, 300, "brick", overworldImg, 48, 0),
        new Block(672, 200, "mystery", overworldImg, 64, 0),
        
      //new Block(416, 300, "hard", overworldImg, 16, 0),
      //new Block(448, 300, "empty", overworldImg, 32, 0),
    
    );
    // ✅ pipe block 獨立管理，避免畫在 blocks 上層被蓋住
    this.pipes = [
      new Block(992, 336, "pipe", overworldImg, 96, 0, 32, 32, 2),
      new Block(992, 368, "pipeB", overworldImg, 96, 16, 32, 16, 2),
      
      new Block(1376, 304, "pipe", overworldImg, 96, 0, 32, 32, 2),
      new Block(1376, 336, "pipeB", overworldImg, 96, 16, 32, 16, 2),
      new Block(1376, 368, "pipeB", overworldImg, 96, 16, 32, 16, 2)
    ];

    // ✅ 自動加入有碰撞的 Block 所對應的平台
    for (let block of this.blocks) {
      const platform = block.getPlatform();
      if (platform) {
        this.platformManager.platforms.push(platform);
      }
    }
    
    // ✅ 自動加入 pipe 的平台
    for (let pipe of this.pipes) {
      const platform = pipe.getPlatform();
      if (platform) {
        this.platformManager.platforms.push(platform);
      }
    }

    // ✅ 裝飾物（純顯示用）
    this.decorations = [
      new Decoration(10, 308, overworldImg, 48, 64, 80, 48, 160, 96), // hill
      new Decoration(352, 368, overworldImg, 8, 96, 32, 16, 64, 32), // bush
      new Decoration(384, 368, overworldImg, 8, 96, 32, 16, 64, 32), //bush
      new Decoration(416, 368, overworldImg, 8, 96, 32, 16, 64, 32), //bush
      new Decoration(448, 338, overworldImg, 48, 64, 80, 48, 160, 96), // hill
      new Decoration(600, 50, overworldImg, 88, 33, 32, 22, 64, 44), // cloud
      new Decoration(736, 368, overworldImg, 8, 96, 32, 16, 64, 32), // bush
      
      new Decoration(1000, 100, overworldImg, 88, 33, 32, 22, 64, 44), // cloud
      new Decoration(1050, 100, overworldImg, 88, 33, 32, 22, 64, 44), // cloud
      new Decoration(1100, 100, overworldImg, 88, 33, 32, 22, 64, 44), // cloud
      
      new Decoration(1350, 50, overworldImg, 88, 33, 32, 22, 64, 44), // cloud
      new Decoration(1400, 50, overworldImg, 88, 33, 32, 22, 64, 44), // cloud
    
    ];
    
    // ✅ 將 pipe 放回 blocks 末尾，確保畫在其他磚塊之後
    for (let pipe of this.pipes) {
      this.blocks.push(pipe);
    }

    if (game?.cat) {
      this.cat = game.cat;
      this.cat.x = 0;
      this.cat.y = 300 - this.cat.hitboxHeight - this.cat.hitboxOffsetY;
      this.cat.vx = 0;
      this.cat.vy = 0;
      this.cat.isOnPlatform = false;
      this.cat.isDead = false;
      this.cat.deathTime = 0;
      this.cat.hitbox = this.cat.getHitbox();
    
      this.cat.onLanded = () => {
          this.isJumping = false;
        };
    }
  }

  update() {
    if (this.state !== "playing" || !this.cat) return;
    
    const cat = this.cat;

    // ✅ 相機跟隨邏輯
    const catCenterX = cat.x + cat.width / 2;
    this.cameraOffsetX = catCenterX - width / 2;
    this.cameraOffsetX = constrain(this.cameraOffsetX, 0, this.mapWidth - width);

    // ✅ 模擬重力
    if (!this.cat.isOnPlatform) {
      this.cat.vy += this.gravity;
      this.cat.y += this.cat.vy;
    } else {
      this.cat.vy = 0; // ✅ 停止下落速度
    }
    
    // ✅ 更新碰撞框
    cat.hitbox = cat.getHitbox();

    // ✅ 使用正確平台碰撞邏輯（包含落地回調）
    //this.platformManager.checkCollision(cat);
    
    // ✅ 封裝：落地與撞擊方塊邏輯已整合
    this.platformManager.checkCollision(cat, [...this.blocks, ...this.pipes]);

    // ✅ 檢查是否掉出畫面視為死亡
    const feetY = cat.hitbox.y + cat.hitbox.h;
    if (!cat.isOnPlatform && !cat.isDead && feetY > height + 100) {
      cat.isDead = true;
      cat.vx = 0;
      cat.vy = 0;
      cat.deathTime = millis();
      console.log("🐱 死亡：掉出畫面");
    }

    // ✅ 死亡後 2 秒自動重啟
    if (cat.isDead && millis() - cat.deathTime > 2000) {
      this.start();
    }

    // ✅ 限制水平範圍
    cat.x = constrain(this.cat.x, 0, this.mapWidth - cat.width - 100);

    // ✅ 更新角色邏輯（包含動畫）
    cat.update();
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
    push(); 
    translate(-this.cameraOffsetX, 0);

    this.drawVisibleScreenDebug();
    
    // ✅ 可見區塊邏輯
    const visibleLeft = this.cameraOffsetX;
    const visibleRight = visibleLeft + width;

    // ✅ 顯示所有裝飾物（內部會使用 offset 計算）
    for (let deco of this.decorations) {
      deco.display(0); // ✅ 讓裝飾也改用 translate 控制畫面位置
    }
    
    // ✅ 再畫 pipe block（畫在上層）
    for (let pipe of this.pipes) {
      if (pipe.x + pipe.w < visibleLeft || pipe.x > visibleRight) continue;
      pipe.display(this.cameraOffsetX);
    }
    
   // ✅ 非 pipe 的 block（例如磚塊與地板）
      for (let block of this.blocks) {
      if (block.x + block.w < visibleLeft || block.x > visibleRight) continue;
      block.display(this.cameraOffsetX);
    }

    // ✅ 顯示平台碰撞框
    this.platformManager.display(this.debugMode);

    // ✅ 顯示角色與碰撞框
    this.cat.display();
    this.cat.debugDrawHitbox(this.debugMode);

    // ✅ 顯示平台紅框 tile 編號
    this.drawPlatformTilesWithDebug();

    pop();
  }

  keyPressed(keyCode) {
    if (this.cat?.isDead) return;
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
  stopBgm();
  if (playMusic && minigameBgm) playBgm(minigameBgm);
}

function updateMiniGame() {
  miniGameManager?.update();
  
  // ✅ 搖桿輸入 → 控制貓咪移動
  const dir = game.joystick.getDirection?.();
  if (dir && miniGameManager?.cat) {
    if (dir.x < -0.5) {
      miniGameManager.cat.moveLeft();
    } else if (dir.x > 0.5) {
      miniGameManager.cat.moveRight();
    }
  }

  checkTouchControls(); // ✅ 每幀持續檢查是否在按右側按鈕
}

function drawMiniGame() {
  miniGameManager?.draw();
  
  game.joystick?.draw();
  drawTouchButtons();
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


function stopMinigameBgm() {
  if (minigameBgm && minigameBgm.isPlaying()) {
    minigameBgm.stop();
  }
}

