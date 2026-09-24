let miniGameManager;
let overworldImg, mysteryAnimImg;
let coinImgs;
let playMusic = true;

class MiniGameManager {
  constructor() {
    this.state = "idle";
    this.cat = null;
    this.platformManager = new PlatformManager();
    this.gravity = 1;
    this.jumpStrength = -16;       // 走路時的跳躍力
    this.jumpStrengthRun = -19;    // 跑步(Shift / 肉球鍵)時跳更高
    this.jumpCutVy = -6;           // 早放開跳躍鍵就把上升速度砍到這個值 → 輕點小跳、長按大跳(瑪利歐手感)
    this.coyote = 0;               // 離開平台後還能起跳的幀數(coyote time)
    this.jumpBuffer = 0;           // 落地前先按了跳 → 落地瞬間自動起跳(jump buffer)
    this.isJumping = false;
    this.cameraOffsetX = 0;
    this.mapWidth = 6912; 
    this.blocks = [];
    this.decorations = [];
    this.flag = new Flag(6432, 48, poleImg, flagImg); // 6432
    
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
    
    this.items = window.getItemsForMiniGame(coinImgs, fishImg, keyImg);
    // 敵人:香菇與烏龜(位置沿關卡分布,避開水管與洞)
    this.enemies = [
      new Enemy('goomba', 720), new Enemy('koopa', 1180), new Enemy('goomba', 1520), new Enemy('goomba', 2150),
      new Enemy('koopa', 2700), new Enemy('goomba', 3400), new Enemy('koopa', 3850), new Enemy('goomba', 4480),
      new Enemy('koopa', 5100), new Enemy('goomba', 5560),
    ];
    this.invincibleUntil = 0;
  
    const b1 = new Block(640, 300, "mystery", overworldImg, 64, 0);
    const b2 = new Block(2624, 300, "mystery", overworldImg, 64, 0);
    const b3 = new Block(3584, 150, "mystery", overworldImg, 64, 0);
    b1.itemType = "fish";
    b2.itemType = "fish";
    b3.itemType = "fish";
    
    this.blocks.push(
        b1,
        b2,
        b3,
        new Block(608, 300, "brick", overworldImg, 48, 0),
        new Block(480, 300, "mystery", overworldImg, 64, 0),
        new Block(672, 300, "brick", overworldImg, 48, 0), // mid
        new Block(704, 300, "mystery", overworldImg, 64, 0),
        new Block(736, 300, "brick", overworldImg, 48, 0),
        new Block(672, 200, "mystery", overworldImg, 64, 0),
        
        new Block(2592, 300, "brick", overworldImg, 48, 0),
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
      this.cat.y = 340 - this.cat.hitboxHeight - this.cat.hitboxOffsetY;
      this.cat.vx = 0;
      this.cat.vy = 0;
      this.cat.isOnPlatform = false;
      this.cat.isDead = false;
      this.cat.hurtByEnemy = false;
      this.cat.deathTime = 0;
      this.cat.resetPower?.();          // 每局從小貓開始
      this.cat.controlEnabled = true;
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

      if (this.cat.isOnPlatform) {
        this.cat.groundStickCounter = (this.cat.groundStickCounter ?? 0) + 1;

        // 連續兩幀都在平台上，才正式停止下墜
        if (this.cat.groundStickCounter >= 2 && this.cat.vy > 0) {
          this.cat.vy = 0;
          
          const platform = this.platformManager.getStandingPlatform(this.cat.hitbox);
          if (platform) {
            this.cat.y = platform.y - this.cat.hitbox.h - this.cat.hitboxOffsetY;
          }
        }
      } else {
        this.cat.groundStickCounter = 0;
      }

    // ✅ 更新碰撞框
    cat.hitbox = cat.getHitbox();

    // 被敵人打死:往上彈一下然後掉出畫面(不做碰撞),2 秒後重開
    if (cat.isDead && cat.hurtByEnemy) {
      if (millis() - cat.deathTime > 2000) this.start();
      return;
    }

    // ✅ 封裝：落地與撞擊方塊邏輯已整合
    this.platformManager.checkCollision(cat, [...this.blocks, ...this.pipes]);

    this.updateEnemies();

    // coyote time + jump buffer(60fps:6 幀 ≈ 0.1 秒)
    if (cat.isOnPlatform) this.coyote = 6; else if (this.coyote > 0) this.coyote--;
    if (this.jumpBuffer > 0) { this.jumpBuffer--; if (cat.isOnPlatform && !this.isJumping) this.doJump(); }

    // ✅ 檢查是否掉出畫面視為死亡
    const feetY = cat.hitbox.y + cat.hitbox.h;
    if (!cat.isOnPlatform && !cat.isDead && feetY > height + 100) {
      cat.isDead = true;
      cat.vx = 0;
      cat.vy = 0;
      cat.deathTime = millis();
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
    
    for (let deco of this.decorations) {
      if (typeof deco.update === "function") deco.update();
    }
    
    for (let item of this.items) {
      item.update();

      // ✅ 判斷是否落在平台上
      if (!item.floating && item.vy >= 0) {
        for (let platform of this.platformManager.platforms) {
          const hitbox = item.getHitbox?.();
          if (platform.isItemStandingOn?.(hitbox)) {
            item.vy = 0;
            item.y = platform.y - item.h;
          }
        }
      }

      item.checkCollisionWith(this.cat);
    }
    
    if (this.flag) {
      this.flag.checkCollision(this.cat, () => {
          this.enterGoalSequence();
      });
    }
    
    // ✅ 加上旗子 update
      this.flag.update();

    if (this.goalStarted) {
      this.handleGoalSequence();
    }

  }

  jump() {
    if (!this.cat) return;
    if (!this.isJumping && (this.cat.isOnPlatform || this.coyote > 0)) this.doJump();
    else this.jumpBuffer = 8;                              // 還在空中:記住,落地就跳
  }

  doJump() {
    const running = this.cat.isRunning || this.cat.touchRunning || keyIsDown(SHIFT);
    const boost = -1.5 * (this.cat.powerLevel || 0);       // 每吃一條魚跳高一點
    this.cat.vy = (running ? this.jumpStrengthRun : this.jumpStrength) + boost;
    this.isJumping = true;
    this.cat.isOnPlatform = false;
    this.coyote = 0; this.jumpBuffer = 0;
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
    
    // 敵人
    for (const e of this.enemies || []) {
      if (e.x + 64 < visibleLeft || e.x - 32 > visibleRight) continue;
      e.display();
    }

    //item
    for (let item of this.items) {
      item.display(this.cameraOffsetX);
      item.update();                       
      item.checkCollisionWith(this.cat); 
    }
    
    this.flag.display(); // 不要再給 offsetX

    // ✅ 顯示平台碰撞框
    this.platformManager.display(this.debugMode);

    // ✅ 顯示角色與碰撞框
    if (!(millis() < this.invincibleUntil && Math.floor(frameCount / 4) % 2 === 0)) this.cat.display();   // 受傷無敵時閃爍
    this.cat.debugDrawHitbox(this.debugMode);

    // ✅ 顯示平台紅框 tile 編號
    this.drawPlatformTilesWithDebug();

    pop();
  }

  updateEnemies() {
    const cat = this.cat, solids = [...this.blocks, ...this.pipes];
    for (const e of this.enemies) {
      e.update(solids);
      if (e.dead || cat.isDead) continue;

      // 移動中的龜殼撞到其他敵人 → 對方飛出去
      if (e.state === 'shell' && e.shellVx !== 0) {
        for (const o of this.enemies) {
          if (o === e || o.dead || o.state === 'flying' || o.state === 'squashed') continue;
          const a = e.hitbox, b = o.hitbox;
          if (a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y) o.hitByShell();
        }
      }

      // 和貓的碰撞
      const hb = cat.hitbox, eb = e.hitbox;
      const hit = hb.x < eb.x + eb.w && hb.x + hb.w > eb.x && hb.y < eb.y + eb.h && hb.y + hb.h > eb.y;
      if (!hit || e.state === 'squashed' || e.state === 'flying') continue;
      const stomp = cat.vy > 0 && (hb.y + hb.h) - eb.y < 20;        // 從上方踩到(腳底剛過敵人頭頂)
      const bounce = () => { cat.vy = -9; this.isJumping = true; cat.isOnPlatform = false; };

      if (e.state === 'walk') {
        if (stomp) { e.stomp(); bounce(); }
        else this.hurtCat();
      } else if (e.state === 'shell') {
        if (e.shellVx === 0) {                                       // 靜止的殼:踢出去(從哪邊碰就往另一邊飛)
          e.kick(hb.x + hb.w / 2 < eb.x + eb.w / 2 ? 1 : -1);
          if (stomp) bounce();
        } else if (stomp) { e.shellVx = 0; bounce(); }              // 踩住移動中的殼 → 停下
        else if (e.kickCooldown <= 0) this.hurtCat();
      }
    }
    this.enemies = this.enemies.filter(e => !e.dead);
  }

  hurtCat() {
    const cat = this.cat;
    if (millis() < this.invincibleUntil || cat.isDead) return;
    if ((cat.powerLevel || 0) > 0) {                                 // 有吃過魚:縮小一級 + 1.5 秒無敵
      cat.powerLevel--; cat.sizeTarget = 1 + 0.25 * cat.powerLevel;
      this.invincibleUntil = millis() + 1500;
      return;
    }
    cat.isDead = true; cat.hurtByEnemy = true; cat.deathTime = millis();
    cat.vy = -14; cat.vx = 0; cat.controlEnabled = false; cat.isOnPlatform = false;
  }

  keyPressed(keyCode) {
    if (this.cat?.isDead) return;
    if (keyCode === 32) this.jump();
    if (keyCode === 1003) this.cat.keyPressed(1003);
    if (keyCode === LEFT_ARROW || keyCode === 65) this.moveLeft();
    if (keyCode === RIGHT_ARROW || keyCode === 68) this.moveRight();
  }

  keyReleased(keyCode) {
    if ([LEFT_ARROW, RIGHT_ARROW, 65, 68].includes(keyCode)) {
      this.stop();
    }
    if (keyCode === 32 && this.cat && this.cat.vy < this.jumpCutVy) {
      this.cat.vy = this.jumpCutVy;   // 還在上升就放開 → 小跳
    }
    if (keyCode === 1003) {
    this.cat.keyReleased(1003);
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

handleGoalSequence() {
  const castleDoorX = 6528;
  
  // A. 貓咪跟旗子一起下滑
  if (this.goalPhase === "sliding") {
    
    const progress = this.cat.slideProgress ?? 0;

    if (this.cat.goalSlideStartY == null) {
       this.cat.goalSlideStartY = this.cat.y;
    }
    
    const startY = this.cat.goalSlideStartY;
    const targetY = this.flag.y + this.flag.h - 48 - this.cat.height + 10;
    
    this.cat.y = lerp(startY, targetY, progress);
    this.cat.slideProgress = progress + 0.08;
    
    this.cat.vx = 0;
    this.cat.x = this.flag.x + this.flag.w - this.cat.width + 2;

    if (this.cat.slideProgress >= 1) {
      this.goalPhase = "flagDown";
      this.flag.startSlideDown?.();
    }
  }

  // B. 滑落完成，開始自動行走進城堡
  if (this.goalPhase === "flagDown") {
    if (this.flag.slideProgress >= 1) {
      this.goalPhase = "walking";
    }
  }

  // C. 自動走到門口，觸發轉場
  if (this.goalPhase === "walking") {
      this.cat.vx = 2.5;
      this.cat.x += this.cat.vx;
      this.cat.isMoving = true;
      this.cat.facing = "right";
      this.cat.state = "walk";

    if (this.cat.x >= castleDoorX) {
      this.goalPhase = "done";
      this.cat.vx = 0;
      this.cat.isMoving = false;
    
        endMiniGame();
    }
  }
}

enterGoalSequence() {
    if (this.cat.isDead || this.goalStarted) return;
    
    this.goalStarted = true;
    this.goalPhase = "sliding";   
    this.cat.stop(); // 停止操作
    this.cat.controlEnabled = false;
   
    this.cat.slideProgress = 0;
    this.cat.goalSlideStartY = null;
    
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
  
  // 👉 記錄進入小遊戲前的位置
  game.savedCatPosition = {
    x: game.cat.x,
    y: game.cat.y
  };
  
  initTouchBindings("minigame");
  frameRate(60);                 // 小遊戲用 60fps(主場景是 10fps,平台跳躍會很卡)
  miniGameManager = new MiniGameManager();
  miniGameManager.start();
  game.mode = "minigame";
  stopBgm();
  if (playMusic && sceneMusic["minigame"]) playBgm("minigame");
}

function endMiniGame() {
  // 街機模式:沒有捷運場景可回,通知外層頁面後直接重開一局
  if (window.ARCADE_MODE) {
    try { window.parent.postMessage({ type: "catgame-finished" }, "*"); } catch (e) {}
    startMiniGame();
    return;
  }
  console.log("🎬 小遊戲結束，返回主遊戲！");
  frameRate(10);
  game.cat.controlEnabled = true;
  initTouchBindings("main");
  game.mode = "main";
  miniGameManager = null;
  
  // 切換到場景
  sceneManager.setScene(1);
  
  // 👉 回復記錄的貓咪位置
  if (game.savedCatPosition) {
    game.cat.x = game.savedCatPosition.x;
    game.cat.y = game.savedCatPosition.y;
  }
   
  stopBgm();  // 先關閉舊音樂
  if (playMusic && sceneMusic["train"]) {
      playBgm("train");
    }
  }

function updateMiniGame() {
  miniGameManager?.update();
  
  game?.handleJoystickInput();

  checkTouchControls(); // ✅ 每幀持續檢查是否在按右側按鈕
}

function drawMiniGame() {
  miniGameManager?.draw();
  
  if (game?.joystick) {
    game.joystick.update(touches);
    game.joystick.draw();
  }
  drawTouchButtons();
}

function keyPressedMiniGame(keyCode) {
  miniGameManager?.keyPressed(keyCode);
  // (原本按 D 會切換 debug 顯示,但 D 同時也是「往右走」,玩家一按就跑出 debug 框線,已移除)
}

function keyReleasedMiniGame(keyCode) {
  miniGameManager?.keyReleased(keyCode);
}

function preloadMiniGameAssets() {
  overworldImg = loadImage("data/minigame/OverWorld.png");
  mysteryAnimImg = loadImage("data/minigame/mysteryAnim.png");
  coinImgs = [
    loadImage("data/minigame/coin01.png"),
    loadImage("data/minigame/coin02.png"),
    loadImage("data/minigame/coin03.png"),
    loadImage("data/minigame/coin04.png")
  ];
  fishImg = loadImage("data/minigame/fish.png");
  keyImg = loadImage("data/minigame/key.png");
  poleImg = loadImage("data/minigame/FlagPole.png");
  flagImg = loadImage("data/minigame/Flag.png");
  castleImg = loadImage("data/minigame/Castle.png");
  enemySheet = loadImage("data/minigame/Enemies.png");   // 注意大小寫:GitHub Pages 分大小寫

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
  
  if (type === "castle") {
    return new Decoration(type, x, y, castleImg, 0, 0, 80, 80, 160, 160);
  }

  if (!(type in params)) return null;

  const [sx, sy, sw, sh, dw, dh] = params[type];
  return new Decoration(type,x, y, overworldImg, sx, sy, sw, sh, dw, dh);
}


