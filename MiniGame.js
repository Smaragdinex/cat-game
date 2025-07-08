let miniGameManager;
let overworldImg, mysteryAnimImg;
let minigameBgm;
let playMusic = false; // turn off music

// ✅ 裝飾物（純顯示用）
   const decorationsData = [
    { type: "hill", x: 10, y: 308 },
    { type: "bush", x: 352, y: 368 },
    { type: "bush", x: 384, y: 368 },
    { type: "bush", x: 416, y: 368 },
    { type: "hill", x: 448, y: 338 },
    { type: "cloud", x: 600, y: 50 },
    { type: "bush", x: 736, y: 368 },

    { type: "cloud", x: 1000, y: 100 },
    { type: "cloud", x: 1050, y: 100 },
    { type: "cloud", x: 1100, y: 100 },

    { type: "cloud", x: 1350, y: 50 },
    { type: "cloud", x: 1400, y: 50 },

    { type: "bush", x: 1504, y: 368 },
    { type: "bush", x: 1536, y: 368 },

    { type: "hill", x: 1696, y: 308 },

    { type: "bush", x: 2048, y: 368 },
    { type: "bush", x: 2080, y: 368 },
    { type: "bush", x: 2112, y: 368 },

    { type: "cloud", x: 1952, y: 100 },

    { type: "hill", x: 2144, y: 338 },
    { type: "cloud", x: 2272, y: 50 },
    { type: "bush", x: 2400, y: 368 },

    { type: "cloud", x: 2560, y: 100 },
    { type: "cloud", x: 2592, y: 100 },
    { type: "cloud", x: 2624, y: 100 },

    { type: "cloud", x: 2848, y: 50 },
    { type: "cloud", x: 2880, y: 50 },

    { type: "bush", x: 2976, y: 368 },
    { type: "bush", x: 3008, y: 368 },

    { type: "hill", x: 3168, y: 308 },

    { type: "cloud", x: 3424, y: 100 },

    { type: "bush", x: 3552, y: 368 },
    { type: "bush", x: 3584, y: 368 },
    { type: "bush", x: 3616, y: 368 },
    { type: "hill", x: 3648, y: 338 },
    { type: "cloud", x: 3776, y: 50 },

    { type: "bush", x: 3904, y: 368 },

    { type: "cloud", x: 4064, y: 100 },
    { type: "cloud", x: 4096, y: 100 },
    { type: "cloud", x: 4128, y: 100 },

    { type: "cloud", x: 4352, y: 50 },
    { type: "cloud", x: 4384, y: 50 },

    { type: "bush", x: 4502, y: 368 },
    { type: "bush", x: 4534, y: 368 },

    { type: "hill", x: 4682, y: 308 },

    { type: "cloud", x: 4992, y: 100 },

    { type: "hill", x: 5184, y: 338 },

    { type: "cloud", x: 5344, y: 50 },
    { type: "bush", x: 5472, y: 368 },

    { type: "cloud", x: 5600, y: 100 },
    { type: "cloud", x: 5632, y: 100 },
    { type: "cloud", x: 5664, y: 100 },

    { type: "cloud", x: 5920, y: 50 },
    { type: "cloud", x: 5952, y: 50 },

    { type: "hill", x: 6240, y: 308 },

    { type: "cloud", x: 6528, y: 100 },
    { type: "hill", x: 6752, y: 338 },
  ];

  
class MiniGameManager {
  constructor() {
    this.state = "idle";
    this.cat = null;
    this.platformManager = new PlatformManager();
    this.gravity = 1;
    this.jumpStrength = -16;
    this.isJumping = false;
    this.cameraOffsetX = 0;
    this.mapWidth = 6912; 
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
    for (let i = 0; i < 73; i++) {
      let x = i * 32;
      this.blocks.push(new Block(x, 400, "ground", overworldImg, 0, 0));
    }
    
    for (let i = 75; i < 90; i++) {
      let x = i * 32;
      this.blocks.push(new Block(x, 400, "ground", overworldImg, 0, 0));
    }
    
    for (let i = 93; i < 156; i++) {
      let x = i * 32;
      this.blocks.push(new Block(x, 400, "ground", overworldImg, 0, 0));
    }
    
    for (let i = 158; i < 216; i++) {
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
        
        new Block(2592, 300, "brick", overworldImg, 48, 0),
        new Block(2624, 300, "mystery", overworldImg, 64, 0),
        new Block(2656, 300, "brick", overworldImg, 48, 0), 
      
        new Block(2688, 150, "brick", overworldImg, 48, 0), 
        new Block(2720, 150, "brick", overworldImg, 48, 0), 
        new Block(2752, 150, "brick", overworldImg, 48, 0), 
        new Block(2784, 150, "brick", overworldImg, 48, 0), 
        new Block(2816, 150, "brick", overworldImg, 48, 0), 
        new Block(2848, 150, "brick", overworldImg, 48, 0), 
        new Block(2880, 150, "brick", overworldImg, 48, 0), 
        new Block(2912, 150, "brick", overworldImg, 48, 0),
      
        new Block(3040, 150, "brick", overworldImg, 48, 0), 
        new Block(3072, 150, "brick", overworldImg, 48, 0), 
        new Block(3104, 150, "brick", overworldImg, 48, 0),
        new Block(3136, 150, "mystery", overworldImg, 64, 0),
        new Block(3136, 300, "brick", overworldImg, 48, 0),
      
        new Block(3296, 300, "brick", overworldImg, 48, 0),
        new Block(3328, 300, "brick", overworldImg, 48, 0),
      
        new Block(3488, 300, "mystery", overworldImg, 64, 0),
        new Block(3584, 300, "mystery", overworldImg, 64, 0),
        new Block(3584, 150, "mystery", overworldImg, 64, 0),
        new Block(3680, 300, "mystery", overworldImg, 64, 0),
      
        new Block(3872, 300, "brick", overworldImg, 48, 0),
      
        new Block(3968, 150, "brick", overworldImg, 48, 0),
        new Block(4000, 150, "brick", overworldImg, 48, 0),
        new Block(4032, 150, "brick", overworldImg, 48, 0),
      
        new Block(4192, 150, "brick", overworldImg, 48, 0),
        new Block(4224, 150, "mystery", overworldImg, 64, 0),
        new Block(4256, 150, "mystery", overworldImg, 64, 0),
        new Block(4288, 150, "brick", overworldImg, 48, 0),
      
        new Block(4224, 300, "brick", overworldImg, 48, 0),
        new Block(4256, 300, "brick", overworldImg, 48, 0),
        
        new Block(4384, 368, "hard", overworldImg, 16, 0),
      
        new Block(4416, 368, "hard", overworldImg, 16, 0),
        new Block(4416, 336, "hard", overworldImg, 16, 0),
      
        new Block(4448, 368, "hard", overworldImg, 16, 0),
        new Block(4448, 336, "hard", overworldImg, 16, 0),
        new Block(4448, 304, "hard", overworldImg, 16, 0),
      
        new Block(4480, 368, "hard", overworldImg, 16, 0),
        new Block(4480, 336, "hard", overworldImg, 16, 0),
        new Block(4480, 304, "hard", overworldImg, 16, 0),
        new Block(4480, 272, "hard", overworldImg, 16, 0),
      
        new Block(4576, 368, "hard", overworldImg, 16, 0),
        new Block(4576, 336, "hard", overworldImg, 16, 0),
        new Block(4576, 304, "hard", overworldImg, 16, 0),
        new Block(4576, 272, "hard", overworldImg, 16, 0),
      
        new Block(4608, 368, "hard", overworldImg, 16, 0),
        new Block(4608, 336, "hard", overworldImg, 16, 0),
        new Block(4608, 304, "hard", overworldImg, 16, 0),
      
        new Block(4640, 368, "hard", overworldImg, 16, 0),
        new Block(4640, 336, "hard", overworldImg, 16, 0),
        
        new Block(4672, 368, "hard", overworldImg, 16, 0),
      
        new Block(4832, 368, "hard", overworldImg, 16, 0),
      
        new Block(4864, 368, "hard", overworldImg, 16, 0),
        new Block(4864, 336, "hard", overworldImg, 16, 0),
      
        new Block(4896, 368, "hard", overworldImg, 16, 0),
        new Block(4896, 336, "hard", overworldImg, 16, 0),
        new Block(4896, 304, "hard", overworldImg, 16, 0),
      
        new Block(4928, 368, "hard", overworldImg, 16, 0),
        new Block(4928, 336, "hard", overworldImg, 16, 0),
        new Block(4928, 304, "hard", overworldImg, 16, 0),
        new Block(4928, 272, "hard", overworldImg, 16, 0),
      
        new Block(4960, 368, "hard", overworldImg, 16, 0),
        new Block(4960, 336, "hard", overworldImg, 16, 0),
        new Block(4960, 304, "hard", overworldImg, 16, 0),
        new Block(4960, 272, "hard", overworldImg, 16, 0),
      
        new Block(5056, 368, "hard", overworldImg, 16, 0),
        new Block(5056, 336, "hard", overworldImg, 16, 0),
        new Block(5056, 304, "hard", overworldImg, 16, 0),
        new Block(5056, 272, "hard", overworldImg, 16, 0),
      
        new Block(5088, 368, "hard", overworldImg, 16, 0),
        new Block(5088, 336, "hard", overworldImg, 16, 0),
        new Block(5088, 304, "hard", overworldImg, 16, 0),
      
        new Block(5120, 368, "hard", overworldImg, 16, 0),
        new Block(5120, 336, "hard", overworldImg, 16, 0),
      
        new Block(5152, 368, "hard", overworldImg, 16, 0),
      
        new Block(5472, 300, "brick", overworldImg, 48, 0),
        new Block(5504, 300, "brick", overworldImg, 48, 0),
        new Block(5536, 300, "mystery", overworldImg, 64, 0),
        new Block(5568, 300, "brick", overworldImg, 48, 0),
      
        new Block(5888, 368, "hard", overworldImg, 16, 0),
      
        new Block(5920, 368, "hard", overworldImg, 16, 0),
        new Block(5920, 336, "hard", overworldImg, 16, 0),
      
        new Block(5952, 368, "hard", overworldImg, 16, 0),
        new Block(5952, 336, "hard", overworldImg, 16, 0),
        new Block(5952, 304, "hard", overworldImg, 16, 0),
      
        new Block(5984, 368, "hard", overworldImg, 16, 0),
        new Block(5984, 336, "hard", overworldImg, 16, 0),
        new Block(5984, 304, "hard", overworldImg, 16, 0),
        new Block(5984, 272, "hard", overworldImg, 16, 0),
      
        new Block(6016, 368, "hard", overworldImg, 16, 0),
        new Block(6016, 336, "hard", overworldImg, 16, 0),
        new Block(6016, 304, "hard", overworldImg, 16, 0),
        new Block(6016, 272, "hard", overworldImg, 16, 0),
        new Block(6016, 240, "hard", overworldImg, 16, 0),
      
        new Block(6048, 368, "hard", overworldImg, 16, 0),
        new Block(6048, 336, "hard", overworldImg, 16, 0),
        new Block(6048, 304, "hard", overworldImg, 16, 0),
        new Block(6048, 272, "hard", overworldImg, 16, 0),
        new Block(6048, 240, "hard", overworldImg, 16, 0),
        new Block(6048, 208, "hard", overworldImg, 16, 0),
      
        new Block(6080, 368, "hard", overworldImg, 16, 0),
        new Block(6080, 336, "hard", overworldImg, 16, 0),
        new Block(6080, 304, "hard", overworldImg, 16, 0),
        new Block(6080, 272, "hard", overworldImg, 16, 0),
        new Block(6080, 240, "hard", overworldImg, 16, 0),
        new Block(6080, 208, "hard", overworldImg, 16, 0),
        new Block(6080, 176, "hard", overworldImg, 16, 0),
      
        new Block(6112, 368, "hard", overworldImg, 16, 0),
        new Block(6112, 336, "hard", overworldImg, 16, 0),
        new Block(6112, 304, "hard", overworldImg, 16, 0),
        new Block(6112, 272, "hard", overworldImg, 16, 0),
        new Block(6112, 240, "hard", overworldImg, 16, 0),
        new Block(6112, 208, "hard", overworldImg, 16, 0),
        new Block(6112, 176, "hard", overworldImg, 16, 0),
        new Block(6112, 144, "hard", overworldImg, 16, 0),
      
        new Block(6144, 368, "hard", overworldImg, 16, 0),
        new Block(6144, 336, "hard", overworldImg, 16, 0),
        new Block(6144, 304, "hard", overworldImg, 16, 0),
        new Block(6144, 272, "hard", overworldImg, 16, 0),
        new Block(6144, 240, "hard", overworldImg, 16, 0),
        new Block(6144, 208, "hard", overworldImg, 16, 0),
        new Block(6144, 176, "hard", overworldImg, 16, 0),
        new Block(6144, 144, "hard", overworldImg, 16, 0),
      
        new Block(6432, 368, "hard", overworldImg, 16, 0),
        
      //new Block(448, 300, "empty", overworldImg, 32, 0),
    
    );
    
    // ✅ pipe block 獨立管理，避免畫在 blocks 上層被蓋住
    this.pipes = [
      new Block(992, 336, "pipe", overworldImg, 96, 0, 32, 32, 2),
      new Block(992, 368, "pipeB", overworldImg, 96, 16, 32, 16, 2),
      
      new Block(1376, 304, "pipe", overworldImg, 96, 0, 32, 32, 2),
      new Block(1376, 336, "pipeB", overworldImg, 96, 16, 32, 16, 2),
      new Block(1376, 368, "pipeB", overworldImg, 96, 16, 32, 16, 2),
      
      new Block(1632, 272, "pipe", overworldImg, 96, 0, 32, 32, 2),
      new Block(1632, 304, "pipeB", overworldImg, 96, 16, 32, 16, 2),
      new Block(1632, 336, "pipeB", overworldImg, 96, 16, 32, 16, 2),
      new Block(1632, 368, "pipeB", overworldImg, 96, 16, 32, 16, 2),
      
      new Block(1952, 272, "pipe", overworldImg, 96, 0, 32, 32, 2),
      new Block(1952, 304, "pipeB", overworldImg, 96, 16, 32, 16, 2),
      new Block(1952, 336, "pipeB", overworldImg, 96, 16, 32, 16, 2),
      new Block(1952, 368, "pipeB", overworldImg, 96, 16, 32, 16, 2),
      
      new Block(5312, 336, "pipe", overworldImg, 96, 0, 32, 32, 2),
      new Block(5312, 368, "pipeB", overworldImg, 96, 16, 32, 16, 2),
      
      new Block(5824, 336, "pipe", overworldImg, 96, 0, 32, 32, 2),
      new Block(5824, 368, "pipeB", overworldImg, 96, 16, 32, 16, 2),
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
    this.decorations = decorationsData.map(d => createDecoration(d.type, d.x, d.y)).filter(d => d !== null);
    
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
      this.cat.vy += this.gravity;
      this.cat.y += this.cat.vy;
    
    if (this.cat.isOnPlatform && this.cat.vy > 0) {
      this.cat.vy = 0;
     }

    // ✅ 更新碰撞框
    cat.hitbox = cat.getHitbox();

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
    
    for (let block of this.blocks) {
      if (typeof block.update === "function") block.update();
    }

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
  overworldImg = loadImage("data/minigame/OverWorld.png");
  minigameBgm = loadSound("data/minigame/001.mp3");
  mysteryAnimImg = loadImage("data/minigame/mysteryAnim.png");


}

function stopMinigameBgm() {
  if (minigameBgm && minigameBgm.isPlaying()) {
    minigameBgm.stop();
  }
}

function createDecoration(type, x, y) {
  const params = {
    hill:  [48, 64, 80, 48, 160, 96],
    bush:  [8, 96, 32, 16, 64, 32],
    cloud: [88, 33, 32, 22, 64, 44],
  };

  if (!(type in params)) return null;

  const [sx, sy, sw, sh, dw, dh] = params[type];
  return new Decoration(x, y, overworldImg, sx, sy, sw, sh, dw, dh);
}


