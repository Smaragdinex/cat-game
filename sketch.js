let game;
let gearX = 0, gearY = 20, gearSize = 40;
let cat;
let bgmStarted = false;


function preload() {
  game = new Game();
  game.preload();
}

function setup() {
  game.setup();
}

function draw() {
  console.log("cat.x =", game.cat.x, "cat.width =", game.cat.width, "右邊界判斷值 =", width - 40 - game.cat.width);
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
  let x = touches[0]?.x ?? mouseX;
  let y = touches[0]?.y ?? mouseY;
  if (game) game.mousePressed(x, y);
}

