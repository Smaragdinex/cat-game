let miniGameManager;
let groundTileImg;

class MiniGameManager {
  constructor() {
    this.state = "idle";
    this.cat = null;
    this.platformManager = new PlatformManager();
    this.gravity = 1;
    this.jumpStrength = -12;
    this.isJumping = false;
  }

  start() {
    this.state = "playing";
    this.isJumping = false;

    // 初始化平台
    this.platformManager.platforms = [
      new Platform(0, 400, 960, 20),
      new Platform(300, 320, 150, 16),
      new Platform(600, 260, 150, 16)
    ];

    // 初始化貓咪
    if (game?.cat) {
      this.cat = game.cat;
      this.cat.x = 100;
      this.cat.y = 200;
      this.cat.vx = 0;
      this.cat.vy = 0;
      this.cat.hitbox = this.cat.getHitbox(); // ✅ 初始化 hitbox
    }
  }

  update() {
    if (this.state !== "playing" || !this.cat) return;

    this.cat.vy += this.gravity;
    this.cat.y += this.cat.vy;

    this.cat.hitbox = this.cat.getHitbox(); // ✅ 每幀更新 hitbox
    this.platformManager.checkCollision(this.cat);

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
    
    if (groundTileImg) {
      console.debug("✅ groundTileImg 存在，正在畫地磚");
      for (let x = 0; x < width; x += 32) {
        image(groundTileImg, x, 400, 32, 32);
      }
    }
    
    this.platformManager.display();
    this.cat.display();
  }

  keyPressed(keyCode) {
    if (keyCode === 32) this.jump();
    if (keyCode === LEFT_ARROW || keyCode === 65) this.moveLeft();
    if (keyCode === RIGHT_ARROW || keyCode === 68) this.moveRight();
  }

  keyReleased(keyCode) {
    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW ||
        keyCode === 65 || keyCode === 68) {
      this.stop();
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
}

function keyReleasedMiniGame(keyCode) {
  miniGameManager?.keyReleased(keyCode);
}

function preloadMiniGameAssets() {
  groundTileImg = loadImage("data/minigame/GroundBlock.png", 
    () => console.log("✅ 地磚圖載入成功"),
    () => console.error("❌ 地磚圖載入失敗")
  );
}
