
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
    this.dialogue = new DialogueManager(this.currentLang);
    this.controlMode = "cat"; // 預設模式為貓咪控制
    this.joystick = new VirtualJoystick(0, 0);
    this.lastDirection = "none";

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
    game.trainDirection = "east";
    this.controlMode = "cat"; // 預設為控制貓咪
    joystickPositionManager(this.joystick);



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
        
    this.joystick.update(touches);
    this.joystick.draw();
   // this.joystick.drawDebug();
    this.handleJoystickInput();
    
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
    this.ui.handleClick(mx, my);
  }

  handleInteraction(x, y) {
    if (!this.bgmStarted) {
      playBgm(bgmMusic);
      this.bgmStarted = true;
    }
    this.mousePressed(x, y);
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
  
  handleJoystickInput() {
    if (!this.joystick.active) return;

    const dir = this.joystick.getDirection();
    const prevDirection = this.lastDirection || "none";
    let currentDirection = "none";

    if (this.controlMode === "cat") {
      // 判斷方向
      if (dir.x > 0.5) currentDirection = "right";
      else if (dir.x < -0.5) currentDirection = "left";

      // 切換方向時釋放原來的
      if (currentDirection !== prevDirection) {
        if (prevDirection === "left") this.cat.keyReleased(1001);
        if (prevDirection === "right") this.cat.keyReleased(1002);
      }

      // 按下新方向
      if (currentDirection === "right") this.cat.keyPressed(1002);
      if (currentDirection === "left") this.cat.keyPressed(1001);
      if (currentDirection === "none") {
        this.cat.keyReleased(1001);
        this.cat.keyReleased(1002);
      }

      // ✅ 根據搖桿強度判斷是否跑步
      const strength = sqrt(dir.x * dir.x + dir.y * dir.y);
      if (strength > 0.7) {
        this.cat.keyPressed(1003); // Shift
      } else {
        this.cat.keyReleased(1003);
      }

      this.lastDirection = currentDirection;
    }

    if (this.controlMode === "flashlight" && typeof flashlight !== "undefined") {
      flashlight.x += dir.x * 4;
      flashlight.y += dir.y * 4;
    }
  }



  
  
}
