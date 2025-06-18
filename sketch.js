
let game;
let gearX = 0, gearY = 20, gearSize = 40;
let cat;
let bgmStarted = false;
let cubicFont;

function preload() {
  cubicFont = loadFont("data/Font/Cubic_11.ttf");
  game = new Game(cubicFont);
  game.preload();
}

function setup() {
  game.setup();
}

function draw() {
  game.draw();
}

function keyPressed() {
  if (game.dialogue.handleChoiceKey(keyCode)) return;
  handleKeyPressed(game, keyCode);
}

function keyReleased() {
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
  if (game) game.handleInteraction(x, y);
}


