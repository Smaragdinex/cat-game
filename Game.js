class Game {
  constructor() {
    this.cat = new Cat();
    this.gearSize = 40;
    this.gearY = 20;
    this.gearX = 0;
    this.showMenu = false;
    this.activePanel = null;
    this.currentLang = 'zh';
  }

  preload() {
    this.cat.preload();
    preloadBackgroundImages();
    preloadMenuImages();
    preloadTouchButtonImages();
  }

  setup() {
    console.log("App build version: 20240611-1300");
    createCanvas(960, 540);
    frameRate(10);
    setInputTarget(this.cat);
    this.cat.setupAnimations();
    initTouchBindings();
    this.updateDynamicPositions();
  }

  updateDynamicPositions() {
    // 動態重算 UI/角色/按鈕座標
    let bgOriginalW = 320, bgOriginalH = 180;
    let bgScale = width / bgOriginalW;
    let bgH = bgOriginalH * bgScale;
    let bgY = height - bgH;
    this.cat.updateYByBackground(bgY, bgScale);

    this.gearX = width - this.gearSize - 20;
  }

  draw() {
    background(30);
    drawBackground();

    this.gearX = width - this.gearSize - 20; // 保險每幀重算
    image(gearIcon, this.gearX, this.gearY, this.gearSize, this.gearSize);

    this.drawMenu();
    this.drawPanel();

    this.cat.update();
    this.cat.display();

    checkTouchControls();
    drawTouchButtons();
  }
  
   drawMenu() {
    if (!this.showMenu) return;

    fill(255, 255, 255, 220);
    noStroke();
    rect(width - 200, 50, 180, 100, 10);

    fill(0);
    textSize(16);
    textAlign(LEFT, TOP);
    text(langText[this.currentLang].btn_control, width - 180, 70);
    text(langText[this.currentLang].btn_lang, width - 180, 110);
  }

  drawPanel() {
    if (this.activePanel === 'control') {
      fill(255, 255, 255, 220);
      noStroke();
      rect(width / 2 - 160, height / 2 - 100, 320, 180, 12);
      fill(0);
      textAlign(CENTER, TOP);
      textSize(16);
      text(langText[this.currentLang].control, width / 2, height / 2 - 80);

      fill(200);
      rect(width / 2 - 40, height / 2 + 60, 80, 30, 8);
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(14);
      text("關閉", width / 2, height / 2 + 75);
    }
    if (this.activePanel === 'language') {
      fill(255, 255, 255, 220);
      noStroke();
      rect(width / 2 - 160, height / 2 - 80, 320, 160, 12);

      fill(0);
      textAlign(CENTER, TOP);
      textSize(16);
      text(langText[this.currentLang].language, width / 2, height / 2 - 70);

      // 畫兩個語言選項按鈕
      fill(200);
      rect(width / 2 - 100, height / 2 - 20, 80, 30, 8);
      rect(width / 2 + 20, height / 2 - 20, 80, 30, 8);

      fill(0);
      textAlign(CENTER, CENTER);
      textSize(14);
      text(langText[this.currentLang].btn_zh, width / 2 - 60, height / 2 - 5);
      text(langText[this.currentLang].btn_en, width / 2 + 60, height / 2 - 5);

      // 畫關閉按鈕
      fill(200);
      rect(width / 2 - 40, height / 2 + 40, 80, 30, 8);
      fill(0);
      text("關閉", width / 2, height / 2 + 55);
    }
  }

  mousePressed(mx, my) {
    // ========== MENU 互動判斷 ==========
    // CONTROL PANEL 關閉
    if (this.activePanel === 'control') {
      if (
        mx >= width / 2 - 40 && mx <= width / 2 + 40 &&
        my >= height / 2 + 60 && my <= height / 2 + 90
      ) {
        this.activePanel = null;
      }
      return;
    }

    // LANGUAGE PANEL
    if (this.activePanel === 'language') {
      // 中文按鈕
      if (
        mx >= width / 2 - 100 && mx <= width / 2 - 20 &&
        my >= height / 2 - 20 && my <= height / 2 + 10
      ) {
        this.currentLang = 'zh';
        this.activePanel = null;
      }

      // 英文按鈕
      if (
        mx >= width / 2 + 20 && mx <= width / 2 + 100 &&
        my >= height / 2 - 20 && my <= height / 2 + 10
      ) {
        this.currentLang = 'en';
        this.activePanel = null;
      }

      // 關閉按鈕
      if (
        mx >= width / 2 - 40 && mx <= width / 2 + 40 &&
        my >= height / 2 + 40 && my <= height / 2 + 70
      ) {
        this.activePanel = null;
      }
      return;
    }

    // MAIN MENU
    if (this.showMenu) {
      if (mx >= width - 200 && mx <= width - 20) {
        if (my >= 60 && my <= 90) {
          this.activePanel = 'control';
          this.showMenu = false;
        } else if (my >= 100 && my <= 130) {
          this.activePanel = 'language';
          this.showMenu = false;
        }
      } else {
        this.showMenu = false;
      }
    } else {
      // 齒輪
      if (dist(mx, my, this.gearX + this.gearSize / 2, this.gearY + this.gearSize / 2) < this.gearSize / 2) {
        this.showMenu = true;
      }
    }
  }

  keyPressed(keyCode) {
    this.cat.keyPressed(keyCode);
  }

  keyReleased(keyCode) {
    this.cat.keyReleased(keyCode);
  }
}
