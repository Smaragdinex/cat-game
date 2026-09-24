const CAT_DISPLAY_SIZE = 120;

class Cat {
  constructor() {
    this.animations = {};  // 統一動畫管理器
    this.currentFrame = 0;
    this.sitFrameIndex = 0;
    
    this.state = 'idle';
    this.direction = 'right';
    
    this.height = 48;
    this.width = 48;
    this.x = 0;
    this.speed = 5;
    
    this.runLeftCat = [];
    this.runRightCat = [];   
    this.sitRightFrames = [];         
    this.sitLeftFrames = [];
    this.idleRightFrames = [];
    this.idleLeftFrames = [];
    this.walkRightFrames = [];
    this.walkLeftFrames = [];
    this.meowRightFrames = [];
    this.meowLeftFrames = [];
    
    this.isMoving = false;
    this.isRunning = false;
    this.isSitting = false;           
    this.isSittingDown = false;
    this.isSleeping = false;
    this.isMeowing = false;
    this.sitDirection = 1;    
    this.sleepStartTime = 0;
    this.lastWakeTime = 0;
       
    this.meowSound = null;
    
    this.hitboxOffsetX = 35;
    this.hitboxOffsetY = 45;
    this.hitboxWidth = 50;
    this.hitboxHeight = 30;
    
    this.prevY = this.y;

    this.debugMode = false;

    // 吃魚長大(小遊戲用):powerLevel 0~2,顯示尺寸依等級放大,能力(速度、跳躍)也提升
    this.powerLevel = 0;
    this.sizeScale = 1;
    this.sizeTarget = 1;
    this.growFrom = 1;
    this.growAnim = 0;
  }

  grow() {
    if (this.powerLevel >= 2) return;
    this.growFrom = this.sizeTarget;
    this.powerLevel = Math.min(2, this.powerLevel + 1);
    this.sizeTarget = 1 + 0.25 * this.powerLevel;   // 1.25x、1.5x
    this.speed = 5 + this.powerLevel;                // 走路速度 5 → 6 → 7
    this.growAnim = 54;                              // 長大動畫:0.9 秒內小/大交替閃(遊戲暫停),像瑪利歐吃香菇
  }

  shrinkTo(level) {
    this.growFrom = this.sizeTarget;
    this.powerLevel = level;
    this.sizeTarget = 1 + 0.25 * level;
    this.growAnim = 36;                              // 縮小也閃一下
  }

  resetPower() {
    this.powerLevel = 0; this.sizeScale = 1; this.sizeTarget = 1; this.speed = 5; this.growAnim = 0;
  }

  // 依 sizeScale 畫貓,以「碰撞框的腳底中央」為錨點(長大時腳仍精準踩在平台上)
  drawSprite(img) {
    if (this.growAnim > 0) {                                        // 長大/縮小動畫:每 6 幀在舊尺寸和新尺寸間切換
      this.growAnim--;
      this.sizeScale = (Math.floor(this.growAnim / 6) % 2 === 0) ? this.sizeTarget : this.growFrom;
      if (this.growAnim === 0) this.sizeScale = this.sizeTarget;
    } else {
      this.sizeScale = this.sizeTarget;
    }
    const k = this.sizeScale, S = CAT_DISPLAY_SIZE * k;
    const feetY = this.hitboxOffsetY + this.hitboxHeight;           // 腳底在原圖框內的 y(75)
    const feetX = this.hitboxOffsetX + this.hitboxWidth / 2;        // 腳底中心在原圖框內的 x(60)
    image(img, this.x + feetX - feetX * k, this.y + feetY - feetY * k, S, S);
  }

  // 小遊戲跑 60fps,精靈動畫每 6 幀換一格;主場景維持 10fps 每幀換一格
  animStep() { return (typeof game !== 'undefined' && game.mode === 'minigame') ? 6 : 1; }
  
  isNearLeftEdge() {
      return this.getHitboxLeft() <= 30;
  }

  isNearRightEdge() {
      return this.getHitboxRight() >= width - 30;
  }

  preload() {
    this.runSheet = loadImage("data/Cat/Cat-1-Run.png");
    this.sitSheet = loadImage("data//Cat/Cat-1-Laying.png");
    this.idleSheet = loadImage("data/Cat/Cat-1-Idle.png");
    this.walkSheet = loadImage("data/Cat/Cat-1-Walk.png");
    this.sleepRightSheet = loadImage("data/Cat/Cat-1-Sleeping.png");
    this.sleepLeftSheet = loadImage("data/Cat/Cat-1-SleepingLeft.png");
    this.meowSheet = loadImage("data/Cat/Cat-1-Meow.png");
    this.meowSound = loadSound("data/Sound/cat1a.mp3");
    
  }
  
  setupAnimations() {
    this.setupAnimation('idle', this.idleSheet, 10);
    this.setupAnimation('walk', this.walkSheet, 8);
    this.setupAnimation('run', this.runSheet, 8);
    this.setupAnimation('sit', this.sitSheet, 8);
    this.setupAnimation("meow", this.meowSheet, 4);
    
    this.setupAnimation('sleeping', this.sleepRightSheet, 2, false);
    this.animations['sleeping-left'] = this.sliceFrames(this.sleepLeftSheet, 2);
  }

  setupAnimation(name, sheet, frameCount, flip = true) {
    const frames = this.sliceFrames(sheet, frameCount);
    this.animations[`${name}-right`] = frames;
    if(flip){
    this.animations[`${name}-left`] = frames.map(f => this.flipImageHorizontally(f));
    }
  }
  
  stop() {
    this.isMoving = false;
    this.isRunning = false;
    this.vx = 0;
    this.vy = 0;
  }

  update() {
    
    this.currentFrame++;
    
    this.hitbox = this.getHitbox();
    
    this.prevY = this.y;
    this.prevFeetY = this.y + this.hitboxOffsetY + this.hitboxHeight;
    
    if (this.handleMeowState()) return;
    if (this.handleSitDown()) return;

    this.handleSleepCheck();
  
    if (this.isSitting) {
      this.isMoving = false;
      this.state = 'idle';
      return;
    }
    
    this.handleMovementInput();
    this.applyMovement();
    
    this.updateMiniGameJumpState();

  }
  
  display() {
    
    this.debugDrawHitbox(); // 🐾 測試視覺化用
    
    if (this.displaySleeping()) return;
    if (this.displaySitting()) return;
    if (this.displayMeowing()) return;
    if (this.displayMinigameJumpFrame()) return;

    this.displayStandardAnimation();
    this.displayDebugInfo();
    
  }

  keyPressed(keyCode) {
    
    if (this.controlEnabled === false) return; // 🚫 禁止控制
    
    this.isSleeping = false;
    this.sleepStartTime = 0;
    
    if (keyCode === 88) {
      // ✅ 先判斷邊界場景切換
      if (this.isNearLeftEdge() && this.direction === 'left') {
        this.tryMoveScene("left");
        return;
      }
      if (this.isNearRightEdge() && this.direction === 'right') {
        this.tryMoveScene("right");
        return;
      }

      // ✅ 最後才是坐下/起來
      if (!this.isSittingDown) {
        this.isSittingDown = true;
        this.sitDirection = this.isSitting ? -1 : 1;
      }
      return;
    }
    
    // meow C key
    if (keyCode === 67) { 
      if (!this.isSitting && !this.isSittingDown) {
        this.state = "meow";
        this.isMeowing = true;
        this.currentFrame = 0;
        this.meowStartTime = millis();
        this.meowSound.play();
      }
    }

    if ((keyCode === 39 || keyCode === 37) && this.isSitting) {
      this.isSittingDown = true;
      this.sitDirection = -1;
      return;
    }
    if ((keyCode === 1001 || keyCode === 1002) && this.isSitting) {
      this.isSittingDown = true;
      this.sitDirection = -1;
      return;
    }
    
    if (keyCode === 39) {
        this.direction = 'right';
        this.isMoving = true;
      } else if (keyCode === 37) {
        this.direction = 'left';
        this.isMoving = true;
      } else if (keyCode === 16) {
        this.isRunning = true;
      }
    
    if (keyCode === 1001) this.touchMovingLeft = true;
    if (keyCode === 1002) this.touchMovingRight = true;
    if (keyCode === 1003) this.touchRunning = true;
    
}
  keyReleased(keyCode) {
    
    if (this.controlEnabled === false) return; // 🚫 禁止控制
    
    if (keyCode === 39 || keyCode === 37) {
      this.isMoving = false;
    }
    if (keyCode === 16) {
    this.isRunning = false; 
    }
    
    if (keyCode === 1001) this.touchMovingLeft = false;
    if (keyCode === 1002) this.touchMovingRight = false;
    if (keyCode === 1003) this.touchRunning = false;
  }
  
  /** 🔧 通用切割器 */
  sliceFrames(sheet, frameCount) {
    let frames = [];
    let w = sheet.width / frameCount;
    let h = sheet.height;
    for (let i = 0; i < frameCount; i++) {
      frames.push(sheet.get(i * w, 0, w, h));
    }
    return frames;
  }
  
  flipImageHorizontally(img) {
    let flipped = createGraphics(img.width, img.height);
    flipped.push();
    flipped.translate(img.width, 0);
    flipped.scale(-1, 1); // 水平翻轉
    flipped.image(img, 0, 0);
    flipped.pop();
    return flipped.get(); // 回傳作為 PImage
  }
  updateYByBackground(bgY, scale) {
    let catY_in_design = 142;  // 設計稿上腳底y
    let catOriginalH = 32;     // 角色原圖高
    let catScaledH = catOriginalH * scale;
    this.y = bgY + (catY_in_design * scale) - catScaledH;
  }
  
  tryMoveScene(direction) {
    const scene = sceneManager.getCurrentScene();
    const entry = scene.entryMap[direction];
    if (entry?.canGo) {
      sceneManager.transition(direction, this);
      hideDialog();
    }
  }

  debugDrawHitbox(debugMode = false) {
    
    if (!this.debugMode) return;
    
    if (this.hitbox) {
      stroke(0, 255, 0);
      strokeWeight(1.5);
      rect(this.hitbox.x, this.hitbox.y, this.hitbox.w, this.hitbox.h); // 🟩 碰撞 hitbox 綠框
    }
  }

    // 碰撞框跟著長大(寬高 × sizeScale),但腳底線與中心 x 不變 → 變大後撞磚、落地的位置才會和圖對得上
    getHitbox() {
      const k = this.sizeScale || 1;
      const w = this.hitboxWidth * k, h = this.hitboxHeight * k;
      return {
        x: this.x + this.hitboxOffsetX + this.hitboxWidth / 2 - w / 2,
        y: this.y + this.hitboxOffsetY + this.hitboxHeight - h,
        w, h
      };
    }

    getHitboxLeft() {
      return this.hitbox?.x ?? this.x;
    }
      
    getHitboxRight() {
      return this.hitbox?.x + this.hitbox?.w ?? this.x + this.width;
    }

    handleMeowState() {
      if (this.isMeowing) {
        const meowFrames = this.animations[`meow-${this.direction}`];
        const max = meowFrames?.length || 0;
        if (millis() - this.meowStartTime > max * 100) {
          this.isMeowing = false;
        }
        return true;
      }
      return false;
    }

    handleSitDown() {
      if (this.isSittingDown) {
        this.sitFrameIndex += this.sitDirection;
        const max = this.animations[`sit-${this.direction}`].length - 1;

        if (this.sitFrameIndex > max) {
          this.sitFrameIndex = max;
          this.isSittingDown = false;
          this.isSitting = true;
          this.currentFrame = 0;
        }

        if (this.sitFrameIndex < 0) {
          this.sitFrameIndex = 0;
          this.isSittingDown = false;
          this.isSitting = false;
          this.currentFrame = 0;
        }
        return true;
      }
      return false;
    }

    handleSleepCheck() {
      if (this.isSitting && !this.isSleeping) {
        if (this.sleepStartTime === 0 && millis() - this.lastWakeTime > 10000) {
          this.sleepStartTime = millis(); // 開始計時
        } else if (this.sleepStartTime > 0 && millis() - this.sleepStartTime >= 5000) {
          this.isSleeping = true;
          this.currentFrame = 0;
        }
      } else {
        this.sleepStartTime = 0;
      }
    }

    handleMovementInput() {
      
      if (this.controlEnabled === false) {
        this.isMoving = false;
        return;
      }
      
      const movingRight = keyIsDown(RIGHT_ARROW) || this.touchMovingRight;
      const movingLeft = keyIsDown(LEFT_ARROW) || this.touchMovingLeft;
      this.isRunning = keyIsDown(SHIFT) || this.touchRunning;

      if (movingRight) {
        this.direction = 'right';
        this.isMoving = true;
      } else if (movingLeft) {
        this.direction = 'left';
        this.isMoving = true;
      } else {
        this.isMoving = false;
      }
    }

    applyMovement() {
      if (this.isMoving) {
        // 小遊戲(60fps):走 3.2 px/幀、跑 ×1.75,每吃一條魚 +0.4;主場景(10fps)維持原本 speed / ×2
        const mini = typeof game !== 'undefined' && game.mode === 'minigame';
        const base = mini ? (3.2 + 0.4 * (this.powerLevel || 0)) : this.speed;
        const moveSpeed = this.isRunning ? base * (mini ? 1.75 : 2) : base;
        this.x += this.direction === 'right' ? moveSpeed : -moveSpeed;
        this.state = this.isRunning ? 'run' : 'walk';
      } else {
        this.state = 'idle';
      }

     // 🎯 只在主遊戲限制邊界，minigame 中讓貓自由移動
      if (typeof game !== "undefined" && game.mode !== "minigame") {
        if (this.x < -30) this.x = -30;
        if (this.x > width - 90) this.x = width - 90;
      }

    }
    
      displaySleeping() {
      if (!this.isSleeping) return false;
      const key = this.direction === 'right' ? 'sleeping-right' : 'sleeping-left';
      const frames = this.animations[key];
      if (frames) {
        const index = Math.floor(this.currentFrame / 20) % frames.length;
        this.drawSprite(frames[index]);
      } else {
        console.warn('Missing sleep frames:', key);
      }
      return true;
    }
      
      displaySitting() {
      if (!this.isSitting && !this.isSittingDown) return false;

      const sitKey = `sit-${this.direction}`;
      const sitFrames = this.animations[sitKey];
      if (sitFrames) {
        let index = this.isSittingDown
          ? this.sitFrameIndex % sitFrames.length
          : sitFrames.length - 1;
        this.drawSprite(sitFrames[index]);
      } else {
        console.warn('Missing sit frames:', sitKey);
      }
      return true;
    }
      
    displayMeowing() {
      if (!this.isMeowing) return false;

      const key = `meow-${this.direction}`;
      const frames = this.animations[key];
      if (frames) {
        const index = Math.floor(this.currentFrame / 4) % frames.length;
        this.drawSprite(frames[index]);
      } else {
        console.warn('Missing meow frames:', key);
      }
      return true;
    }
    
    displayStandardAnimation() {
      
      const key = `${this.state}-${this.direction}`;
      const frames = this.animations[key];

      // ✅ 一般動畫播放
      if (frames) {
        const index = Math.floor(this.currentFrame / this.animStep()) % frames.length;
        this.drawSprite(frames[index]);
      } else {
        console.warn('Missing animation:', key);
      }
    }

    displayDebugInfo() {
      if (!this.debugMode) return;
      push();
      fill(255);
      textSize(16);
      textAlign(LEFT, TOP);
      text("Cat X: " + Math.floor(this.x), this.x + 5, this.y - 20);
      pop();
    }
      
    adjustToPlatformY(platformY) {
      // 腳底線 = y + hitboxOffsetY + hitboxHeight(不受 sizeScale 影響)
      this.y = platformY - this.hitboxOffsetY - this.hitboxHeight;
    }

    updateMiniGameJumpState() {
      if (typeof game !== "undefined" && game.mode === "minigame") {
        if (!this.isOnPlatform) {
          this.jumpState = (this.vy < 0) ? "jumping" : "falling";
        } else {
          this.jumpState = null;
        }
      } else {
        this.jumpState = null;
      }
    }
      
   displayMinigameJumpFrame() {
      if (
        typeof game === "undefined" ||
        game.mode !== "minigame" ||
        this.isOnPlatform ||
        !this.jumpState ||
        !this.animations[`run-${this.direction}`]
      ) {
        return false;
      }

      const runFrames = this.animations[`run-${this.direction}`];

      // 跳躍階段使用第 4 幀，落下階段使用第 5 幀
      const index = (this.jumpState === "jumping") ? 3 : 4;

      const safeIndex = constrain(index, 0, runFrames.length - 1);
      this.drawSprite(runFrames[safeIndex]);

      return true;
    }

}