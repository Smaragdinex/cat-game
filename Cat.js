const CAT_DISPLAY_SIZE = 120;

class Cat {
  constructor() {
    this.animations = {};  // 統一動畫管理器
    this.currentFrame = 0;
    this.sitFrameIndex = 0;
    
    this.state = 'idle';
    this.direction = 'right';
    
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
    this.hitboxOffsetY = 35;
    this.hitboxWidth = 55;
    this.hitboxHeight = 45;
    
    this.debugMode = false;

  }
  
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

  update() {
    this.currentFrame++;
    
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

    this.hitbox = this.getHitbox();

  }

  display() {
    
    this.debugDrawHitbox(); // 🐾 測試視覺化用

    
    if (this.isSleeping) {
      const key = this.direction === 'right' ? 'sleeping-right' : 'sleeping-left';
      const frames = this.animations[key];
      if (frames) {
        const index = Math.floor(this.currentFrame / 20) % frames.length;
        image(frames[index], this.x, this.y, CAT_DISPLAY_SIZE, CAT_DISPLAY_SIZE);
      } else {
        console.warn('Missing sleep frames:', key);
      }
      return;
    }
    
    // 🪑 坐下動畫 or 起來動畫
    if (this.isSitting || this.isSittingDown) {
      const sitKey = `sit-${this.direction}`;
      const sitFrames = this.animations[sitKey];
      if (sitFrames) {
        let index;
        if (this.isSittingDown) {
          index = this.sitFrameIndex % sitFrames.length;
        } else {
          index = sitFrames.length - 1;
        }
        image(sitFrames[index], this.x, this.y, CAT_DISPLAY_SIZE, CAT_DISPLAY_SIZE);
      } else {
        console.warn('Missing sit frames:', sitKey);
      }
      return;
    }
    
    //Meow
    if (this.isMeowing) {
      const key = `meow-${this.direction}`;
      const frames = this.animations[key];
      if (frames) {
        const index = Math.floor(this.currentFrame / 4) % frames.length;
        image(frames[index], this.x, this.y, CAT_DISPLAY_SIZE, CAT_DISPLAY_SIZE);
      } else {
        console.warn('Missing meow frames:', key);
      }
      return;
    }

    // 🐾 其他移動或 idle 動畫
    const key = `${this.state}-${this.direction}`;
    const frames = this.animations[key];
    if (frames) {
      const index = this.currentFrame % frames.length;
      const img = frames[index];
      image(img, this.x, this.y, CAT_DISPLAY_SIZE, CAT_DISPLAY_SIZE);
    } else {
      console.warn('Missing animation:', key);
    }
    
    
    if (this.debugMode) {
      push();
      fill(255);
      textSize(16);
      textAlign(LEFT, TOP);
      text("Cat X: " + Math.floor(this.x), this.x + 5, this.y - 20);
      pop();
    }
  }

  keyPressed(keyCode) {
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

      // ✅ 接著才是 NPC 對話
      const npcs = sceneManager.getCurrentScene().npcs || [];
      for (let npc of npcs) {
        if (npc.isNear(this)) {
          npc.speak();
          return;
        }
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

  debugDrawHitbox() {
    
    if (!this.debugMode) return;
    
    push();
    noFill();
    stroke(255, 0, 0);
    strokeWeight(2);
    rect(this.x, this.y, CAT_DISPLAY_SIZE, CAT_DISPLAY_SIZE); // 🟥 圖片邊界紅框

    if (this.hitbox) {
      stroke(0, 255, 0);
      strokeWeight(1.5);
      rect(this.hitbox.x, this.hitbox.y, this.hitbox.w, this.hitbox.h); // 🟩 碰撞 hitbox 綠框
    }
    pop();   
  }

    getHitbox() {
      return {
        x: this.x + this.hitboxOffsetX,
        y: this.y + this.hitboxOffsetY,
        w: this.hitboxWidth,
        h: this.hitboxHeight
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
        const moveSpeed = this.isRunning ? this.speed * 2 : this.speed;
        this.x += this.direction === 'right' ? moveSpeed : -moveSpeed;
        this.state = this.isRunning ? 'run' : 'walk';
      } else {
        this.state = 'idle';
      }

      // 邊界限制
      if (this.x < -30) this.x = -30;
      if (this.x > width - 90) this.x = width - 90;
    }


}