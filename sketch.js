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
  
  TOUCH_BINDINGS = [
    { code: LEFT_ARROW,  x: 60, y: height - 100 },
    { code: RIGHT_ARROW, x: 160, y: height - 100 },
    { code: SHIFT,       x: width - 140, y: height - 160 }, // 跑步
    { code: 88,          x: width - 60,  y: height - 220 }, // 'X'
  ];

}

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
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
  
  if (!activePanel && isMobileDevice()) {
    checkTouchControls();  
  }

  if (isMobileDevice()) {
    drawTouchButtons();    
  }
  
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

