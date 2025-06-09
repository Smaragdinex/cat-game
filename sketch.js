let cat;

function preload() {
  cat = new Cat();
  cat.preload();
  
}

function setup() {
  createCanvas(800, 400);
  frameRate(10);
  cat.setupAnimations();


}

function draw() {
  background(30);
  cat.update();
  cat.display();
}

function keyPressed() {
  cat.keyPressed(keyCode);
}

function keyReleased() {
  cat.keyReleased(keyCode);
}
