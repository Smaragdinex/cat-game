let transition = new TransitionManager();

class Game {
  constructor(font) {
    this.cat = new Cat();
    this.gearSize = 40;
    this.gearY = 20;
    this.gearX = 0;
    this.showMenu = false;
    this.activePanel = null;
    this.bgmStarted = false;
    this.currentInteractingNpc = null;
    this.sleepUnlockTriggered = false;
    this.sleepMessageShown = false;
    this.sleepMessageTime = 0; 
    this.currentLang = 'zh';
    this.shaker = new TrainShaker();
    this.ui = new GameUI(this, font);

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
    console.log("Game build version: 20250615-1816");
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
    let bgOriginalW = 320, bgOriginalH = 186;
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
    this.cat.update();
    this.cat.display();
    
    this.gearX = width - this.gearSize - 20; // 保險每幀重算
    image(gearIcon, this.gearX, this.gearY, this.gearSize, this.gearSize);

    this.ui.drawTopButtons();
    this.ui.drawPanels();
    this.ui.drawTouchControls();

    checkTouchControls();
    drawTouchButtons();
    
    transition.update();
    transition.draw();
    
    triggerSleepUnlock(this);
    
    if (!this.cat.isSleeping && this.sleepUnlockTriggered) {
      this.sleepUnlockTriggered = false;
      this.sleepMessageShown = false;
    }
    
    this.handleInteractHints();
    this.handleDialogClear();
    
    drawDialog();
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
    
    if (dialogActive && keyCode === 88) {
      nextDialogLine();  // 快速跳下一句
      return;
    }
    if (keyCode === 88) { // X
      const scene = sceneManager.getCurrentScene();
      const nearNpc = scene.npcs?.find(n => n.isNear(this.cat));
      
      if (nearNpc) { 
        nearNpc.speak();
        this.currentInteractingNpc = nearNpc;
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
      langText[this.currentLang]?.system || "系統" );
      dialogIsLocked = true;
      
    return true;
  }
   
    sceneManager.transition(direction, this.cat);

    hideDialog();
    dialogIsLocked = false;
    return true;
  }
  
  
   
  handleInteractHints() {
      const npcs = sceneManager.getCurrentScene().npcs || [];
      let nearNpc = null;

      for (let npc of npcs) {
        if (npc.isNear(this.cat)) {
          nearNpc = npc;
          break;
        }
      }

      this._nearNpc = nearNpc; // 可在其他邏輯用

      // ✅ 改為獨立定義：提示顯示寬鬆一點（例如 30px 以內）
      const showHintLeft = this.cat.getHitboxLeft() <= 30;
      const showHintRight = this.cat.getHitboxRight() >= width - 30;

      if (nearNpc || showHintLeft || showHintRight) {
        drawEdgeInteractHint(this.cat);
      }
    }


  handleDialogClear() {
    // 清除鎖定型（邊界）對話
    if (
      !this._nearNpc &&
      !this.cat.isNearLeftEdge() &&
      !this.cat.isNearRightEdge() &&
      dialogActive && dialogIsLocked
    ) {
      hideDialog();
      dialogIsLocked = false;
    }
    // 清除 NPC 對話
    if (
      this.currentInteractingNpc &&
      !this.currentInteractingNpc.isNear(this.cat)
    ) {
      hideDialog();
      this.currentInteractingNpc = null;
    }
  }

}




