let game;
let gearX = 0, gearY = 20, gearSize = 40;
let cat;
let bgmStarted = false;

function preload() {
  game = new Game();
  game.preload();
  preloadMusic();
}

function setup() {
  game.setup();
}

function draw() {
  game.draw();
}

function keyPressed() {
  game.keyPressed(keyCode);
}

function keyReleased() {
  game.keyReleased(keyCode);
}

function mousePressed() {
  if (!bgmStarted) {
    playBgm();
    bgmStarted = true;
  }
  let x = mouseX, y = mouseY;
  // 手機或平板觸控時，mouseX/mouseY 可能是 0，要抓 touches[0]
  if (touches.length > 0) {
    x = touches[0].x;
    y = touches[0].y;
  }
  if (game) game.mousePressed(x, y);
}

function touchStarted() {
  if (!bgmStarted) {
    playBgm();
    bgmStarted = true;
  }
}

