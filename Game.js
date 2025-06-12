class Game {
  constructor() {
    this.cat = new Cat();
    this.gearSize = 40;
    this.gearY = 20;
    this.gearX = 0;
    this.showMenu = false;
    this.activePanel = null;
    this.currentLang = 'zh';
    this.bgmStarted = false;
  }
  
  preload() {
    this.cat.preload();
    preloadNPCImages();
    preloadBackgroundImages();
    preloadMenuImages();
    preloadTouchButtonImages();
    preloadMusic();
    preloadDialogueImages();
  }

  setup() {
    console.log("Game build version: 20250611-1606");
    createCanvas(960, 540);
    frameRate(10);
    setInputTarget(this.cat);
    this.cat.setupAnimations();
    initTouchBindings();
    this.updateDynamicPositions();
    setupNPCDialogs();
  }

  updateDynamicPositions() {
    // 動態重算 UI/角色/按鈕座標
    let bgOriginalW = 320, bgOriginalH = 180;
    let bgScale = width / bgOriginalW;
    let bgH = bgOriginalH * bgScale;
    let bgY = height - bgH;
    this.cat.updateYByBackground(bgY, bgScale);

    this.gearX = width - this.gearSize - 20;
    
    this.cat.x = width / 5;  //初始位置
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
    
    if (game.cat.isNearLeftEdge() || game.cat.isNearRightEdge()) {
    drawEdgeInteractHint(game.cat);
    }
    if (!(game.cat.isNearLeftEdge() || game.cat.isNearRightEdge()) && dialogActive) {
    hideDialog();
    }
    drawDialog();
  }
  
   drawMenu() {
    if (!this.showMenu) return;

    fill(255, 255, 255, 220);
    noStroke();
    rect(width - 200, 50, 180, 140, 10);

    fill(0);
    textSize(16);
    textAlign(LEFT, TOP);
    text(langText[this.currentLang].btn_control, width - 180, 70);
    text(langText[this.currentLang].btn_lang, width - 180, 110);
    text(langText[this.currentLang].btn_volume, width - 180, 150);
  }

  drawPanel() {
    if (this.activePanel === 'control') {
      fill(255, 255, 255, 220);
      noStroke();
      rect(width / 2 - 160, height / 2 - 100, 320, 200, 12);
      fill(0);
      textAlign(CENTER, TOP);
      textSize(16);
      text(langText[this.currentLang].control, width / 2, height / 2 - 80);

      fill(200);
      rect(width / 2 - 40, height / 2 + 60, 80, 30, 8);
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(14);
      text(langText[this.currentLang].btn_close, width / 2, height / 2 + 75);
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
      text(langText[this.currentLang].btn_close, width / 2, height / 2 + 55);
    }
    if (this.activePanel === 'volume') {
      fill(255, 255, 255, 220);
      noStroke();
      rect(width / 2 - 160, height / 2 - 80, 320, 160, 12);

      fill(0);
      textAlign(CENTER, TOP);
      textSize(16);
      text(langText[this.currentLang].btn_volume, width / 2, height / 2 - 65);

      // 音量條背景
      let volBarX = width / 2 - 100;
      let volBarY = height / 2 - 10;
      let volBarW = 200;
      let volBarH = 20;
      fill(180);
      rect(volBarX, volBarY, volBarW, volBarH, 8);

      // 音量條填充
      fill(0, 150, 255);
      rect(volBarX, volBarY, volBarW * getVolume(), volBarH, 8);

      // 數值
      fill(0);
      textSize(14);
      textAlign(LEFT, CENTER);
      text(Math.round(getVolume() * 100) + "%", volBarX + volBarW + 10, volBarY + volBarH / 2);

      // 關閉按鈕
      fill(200);
      rect(width / 2 - 40, height / 2 + 40, 80, 30, 8);
      fill(0);
      textAlign(CENTER, CENTER);
      text(langText[this.currentLang].btn_close, width / 2, height / 2 + 55);
    }
  }

  mousePressed(mx, my) {
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
    // 音量拖曳
    if (this.activePanel === 'volume') {
      // 音量條滑鼠拖拉
      let volBarX = width / 2 - 100;
      let volBarY = height / 2 - 10;
      let volBarW = 200;
      let volBarH = 20;
      if (
        mx >= volBarX && mx <= volBarX + volBarW &&
        my >= volBarY && my <= volBarY + volBarH
      ) {
        let v = (mx - volBarX) / volBarW;
        setVolume(constrain(v, 0, 1));
      }
      // 關閉按鈕
      if (
        mx >= width / 2 - 40 && mx <= width / 2 + 40 &&
        my >= height / 2 + 40 && my <= height / 2 + 70
      ) {
        this.activePanel = null;
      }
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
        }else if (my >= 140 && my <= 170) {   // 音量選單
          this.activePanel = 'volume';
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
  
  handleInteraction(x, y) {
    if (!this.bgmStarted) {
      playBgm(bgmMusic);
      this.bgmStarted = true;
    }
    this.mousePressed(x, y); // 原本你已有 mousePressed(mx, my)
  }

  keyPressed(keyCode) {
    if (keyCode === 88) { // X
      const scene = sceneManager.getCurrentScene();
      const nearNpc = scene.npcs?.find(n => n.isNear(this.cat));
      if (nearNpc) {
        nearNpc.speak();
        return;
      }
    const handled = this.trySceneTransition();
    if (handled) return; 
  }
    this.cat.keyPressed(keyCode);
  }

  keyReleased(keyCode) {
    this.cat.keyReleased(keyCode);
  }
  
  
  trySceneTransition() {
    const scene = sceneManager.getCurrentScene();

    let direction = null;
    if (this.cat.isNearRightEdge()) direction = "right";
    else if (this.cat.isNearLeftEdge()) direction = "left";
    
    if (!direction) return false; // 沒靠邊，不做事

    const entry = scene.entryMap[direction];
    
    if (!entry || entry.canGo === false) {
    showDialog(
      langText[this.currentLang]?.dialog_locked || "這裡過不去喵！",
      langText[this.currentLang]?.system || "系統"
    );
    return true;
  }
   
    sceneManager.transition(direction, this.cat);

    hideDialog();
    return true;
  }
}

