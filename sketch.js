
let game;
let gearX = 0, gearY = 20, gearSize = 40;
let cat;
let bgmStarted = false;
let cubicFont;

function preload() {
  cubicFont = loadFont("data/Font/Cubic_11.ttf");
  
  preloadMiniGameAssets();
  
  game = new Game(cubicFont);
  game.preload();
}

function setup() {
  game.setup();
  
  // ✅ 強制進入 minigame 模式
  //game.mode = "minigame";
  //startMiniGame();             
}

function draw() {
  
  if (game.mode === "minigame") {
    updateMiniGame();
    drawMiniGame();
    return;
  }
  game.draw();
}

function keyPressed() {
  
  if (game.mode === "minigame") {
    keyPressedMiniGame(keyCode);
    return;
  }
  
  if (game.dialogue.handleChoiceKey(keyCode)) return;
  handleKeyPressed(game, keyCode);
}

function keyReleased() {
  if (game.mode === "minigame") {
    keyReleasedMiniGame(keyCode);
    return;
  }
  
  handleKeyReleased(game, keyCode);
  
}

function mousePressed() {
  let x = mouseX, y = mouseY;
  if (touches.length > 0) {
    x = touches[0].x;
    y = touches[0].y;
  }
  if (game) game.handleInteraction(x, y);
}

function touchStarted() {
  let x = touches[0]?.x ?? mouseX;
  let y = touches[0]?.y ?? mouseY;
  
  if (game?.mode === "minigame") {
    checkTouchControls?.();       // 右側按鈕處理
    joystick?.handleTouch?.(x, y); // 左側搖桿處理（如果你有這方法）
    return false; // ✅ 防止頁面捲動
  }
  
  if (game) game.handleInteraction(x, y);
}



