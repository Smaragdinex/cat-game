// ✅ 重構後的 Game.js，使用 DialogueManager
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
    this.platformManager = new PlatformManager();
    this.dialogue = new DialogueManager(this.currentLang); // ✅ 加入對話系統
  }

  preload() {
    this.cat.preload();
    preloadNPCImages();
    preloadBackgroundImages();
    preloadMenuImages();
    preloadTouchButtonImages();
    preloadMusic();
    this.dialogue.preload(); // ✅ 載入對話圖片
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
    const sceneName = sceneManager.getCurrentScene().name;
    this.platformManager.setupPlatformsForScene(sceneName);
  }

  updateDynamicPositions() {
    let bgOriginalW = 320, bgOriginalH = 186;
    let bgScale = width / bgOriginalW;
    let bgH = bgOriginalH * bgScale;
    let bgY = height - bgH;
    this.cat.updateYByBackground(bgY, bgScale);

    this.gearX = width - this.gearSize - 20;
    this.cat.x = width / 5;
  }

  draw() {
    background(30);
    drawBackground();
    this.cat.update();
    this.cat.display();

    this.gearX = width - this.gearSize - 20;
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

    this.platformManager.display();
    this.platformManager.checkCollision(this.cat);
    maybeTriggerSleepHint(this);

    this.dialogue.update();
    this.dialogue.draw();
  }

  mousePressed(mx, my) {
    if (this.activePanel === 'control') {
      if (
        mx >= width / 2 - 40 && mx <= width / 2 + 40 &&
        my >= height / 2 + 60 && my <= height / 2 + 90
      ) {
        this.activePanel = null;
      }
      return;
    }

    if (this.activePanel === 'language') {
      if (mx >= width / 2 - 100 && mx <= width / 2 - 20 && my >= height / 2 - 20 && my <= height / 2 + 10) {
        this.currentLang = 'zh';
        this.activePanel = null;
      }
      if (mx >= width / 2 + 20 && mx <= width / 2 + 100 && my >= height / 2 - 20 && my <= height / 2 + 10) {
        this.currentLang = 'en';
        this.activePanel = null;
      }
      if (mx >= width / 2 - 40 && mx <= width / 2 + 40 && my >= height / 2 + 40 && my <= height / 2 + 70) {
        this.activePanel = null;
      }
      return;
    }

    if (this.activePanel === 'volume') {
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
      if (mx >= width / 2 - 40 && mx <= width / 2 + 40 && my >= height / 2 + 40 && my <= height / 2 + 70) {
        this.activePanel = null;
      }
    }

    if (this.showMenu) {
      if (mx >= width - 200 && mx <= width - 20) {
        if (my >= 60 && my <= 90) {
          this.activePanel = 'control';
          this.showMenu = false;
        } else if (my >= 100 && my <= 130) {
          this.activePanel = 'language';
          this.showMenu = false;
        } else if (my >= 140 && my <= 170) {
          this.activePanel = 'volume';
          this.showMenu = false;
        }
      } else {
        this.showMenu = false;
      }
    } else {
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
    this.mousePressed(x, y);
  }

  keyPressed(keyCode) {
    if (keyCode === 88) {
      if (this.dialogue.active) {
        this.dialogue.nextLine();
        return;
      }

      const scene = sceneManager.getCurrentScene();
      const nearNpc = scene.npcs?.find(n => n.isNear(this.cat));
      if (nearNpc) {
        nearNpc.speak();
        this.currentInteractingNpc = nearNpc;
        if (nearNpc.dialogKey === "homeless") {
          this.dialogWithSleeperDone = true;
        }
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
    if (!direction) return false;

    const entry = scene.entryMap[direction];
    if (!entry || entry.canGo === false) {
      this.dialogue.show(
        langText[this.currentLang]?.dialog_locked || "這裡過不去喵！",
        langText[this.currentLang]?.system || "系統"
      );
      this.dialogue.isLocked = true;
      return true;
    }

    sceneManager.transition(direction, this.cat);
    this.dialogue.hide();
    this.dialogue.isLocked = false;
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
    this._nearNpc = nearNpc;
    const showHintLeft = this.cat.getHitboxLeft() <= 30;
    const showHintRight = this.cat.getHitboxRight() >= width - 30;
    if (nearNpc || showHintLeft || showHintRight) {
      this.dialogue.drawEdgeHint(this.cat);
    }
  }

  handleDialogClear() {
    if (
      !this._nearNpc &&
      !this.cat.isNearLeftEdge() &&
      !this.cat.isNearRightEdge() &&
      this.dialogue.active && this.dialogue.isLocked
    ) {
      this.dialogue.hide();
      this.dialogue.isLocked = false;
    }
    if (
      this.currentInteractingNpc &&
      !this.currentInteractingNpc.isNear(this.cat)
    ) {
      this.dialogue.hide();
      this.currentInteractingNpc = null;
    }
  }
}
