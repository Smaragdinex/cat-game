let cat;
let gearIcon;
let gearX, gearY, gearSize = 40;
let showControls = false;
let showLanguage = false;

function preload() {
  cat = new Cat();
  cat.preload();
  gearIcon = loadImage('data/Icon/settings_3.png');
}

function setup() {
  createCanvas(1000, 500);
  frameRate(10);
  cat.setupAnimations();
  
  gearX = width - gearSize - 10;
  gearY = 10;

}

function draw() {
  background(30);
  
   gearX = width - gearSize - 20;
   gearY = 20;

  image(gearIcon, gearX, gearY, gearSize, gearSize);
  
  drawMenu();
  drawPanel();

  cat.update();
  cat.display();
  
}

function keyPressed() {
  cat.keyPressed(keyCode);
}

function keyReleased() {
  cat.keyReleased(keyCode);
}

function mousePressed() {
  mousePressedMenu(mouseX, mouseY);

  if (showControls || showLanguage) {
    return;
  }
}

