let game;
let gearX = 0, gearY = 20, gearSize = 40;
let cat;


function preload() {
  game = new Game();
  game.preload();
  preloadMusic();
}

function setup() {
  game.setup();
  playBgm();
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

