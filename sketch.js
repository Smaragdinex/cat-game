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
  if (game && typeof game.mousePressed === "function") {
    game.mousePressed(mouseX, mouseY);
  }
}

function touchStarted() {
  if (!bgmStarted) {
    playBgm();
    bgmStarted = true;
  }
}

