let game;
let gearX = 0, gearY = 20, gearSize = 40;
let c


function preload() {
  game = new Game();
  game.preload();
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
  game.mousePressed(mouseX, mouseY);
}

