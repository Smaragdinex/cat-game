let sceneImages = {};
let railingImg;
let sceneManager;
let nightViewImg;
let mountainViewImg;
let nightOffset = 0;
let nightScrollSpeed = 1;

class Scene {
  constructor({ name, bgKey, entryMap, npcs = [],playDoorSfx = true, canEnterDream = false, windViewImg = null, windOffsetY = 0, windScrollSpeed = 1}) {
    this.name = name;
    this.bgKey = bgKey;
    this.entryMap = entryMap;
    this.npcs = npcs;
    this.playDoorSfx = playDoorSfx;
    this.canEnterDream = canEnterDream;
    this.windViewImg = windViewImg;
    this.windOffsetY = windOffsetY;
    this.windScrollSpeed = windScrollSpeed;
    this._offsetX = 0; // 每場景自己的偏移值
  }
}

class SceneManager {
  constructor() {
    this.scenes = [];
    this.currentIndex = 0;
  }
  
  setScene(index) {
    if (index >= 0 && index < this.scenes.length) {
      this.currentIndex = index;

      // ✅ 重設平台（如果有 platformManager）
      if (typeof platformManager !== "undefined") {
        const sceneName = this.getCurrentScene().name;
        platformManager.setupPlatformsForScene(sceneName);
      }
    }
  }

  addScene(scene) {
    this.scenes.push(scene);
  }

  getCurrentScene() {
    return this.scenes[this.currentIndex];
  }

  draw() {
    const scene = this.getCurrentScene();
    
    if (scene.windViewImg) {
      // 若列車已啟動，根據方向更新滑動
      if (game.trainStarted && game.trainDirection) {
        updateSceneScrollOffset(scene, game.trainDirection);
      }

      drawLoopingBackgroundMasked(
        scene.windViewImg,
        scene._offsetX || 0,
        20,   // windowX
        200,  // windowY
        900,  // windowW
        300,  // windowH
        scene.windOffsetY || 0
      );
    }

    const img = sceneImages[scene.bgKey];
    if (!img) return;

    const bgOriginalW = 320;
    const bgOriginalH = 180;
    const scale = width / bgOriginalW;
    const bgW = width;
    const bgH = bgOriginalH * scale;
    const bgY = height - bgH;

    if (typeof game !== "undefined" && game.shaker?.active) game.shaker.update();

    image(img, 0, bgY, bgW, bgH);

    if (typeof game !== "undefined" && game.shaker?.active) game.shaker.reset();
    
    scene.npcs?.forEach(npc => {
      npc.update();
      npc.display();
    });

  }

  transition(direction, cat, option = {}) {
    if (!cat) {
      return;
    }
    const current = this.getCurrentScene();
    const entry = current.entryMap[direction];
    if (!entry) return;
  
    this.currentIndex = entry.to;

    const next = this.getCurrentScene();
    if (entry.spawnX !== undefined) cat.x = entry.spawnX;
    if (entry.spawnY !== undefined) cat.y = entry.spawnY;
    
    if (!option.silent && next.playDoorSfx) {
      playDoorSfx();
    }
    
    if (typeof platformManager !== "undefined") {
      const sceneName = this.getCurrentScene().name;
      platformManager.setupPlatformsForScene(sceneName);
    }
    
  }
}

function preloadBackgroundImages() {
  sceneImages.default = loadImage('data/background/train.png');
  sceneImages.train = loadImage('data/background/train01.png');
  NightViewImg = loadImage('data/background/NightView.png');
  CityViewImg = loadImage('data/background/CityView1.png');

  sceneManager = new SceneManager();

  sceneManager.addScene(new Scene({
    name: "000",
    bgKey: "train",
    playDoorSfx: true,
    canEnterDream: true,
    windViewImg: CityViewImg,
    windOffsetY: -500,
    windScrollSpeed: 2.0, // ✅ 城市快一點
    entryMap: {
      left: { to: 0, spawnX: 865, canGo: false },
      right: { to: 0, spawnX: -25, canGo: false }
    },
    npcs: [
      new NPC({ name: "老爺爺", x: 660, y: 304, sprite: npcImages.grandpa, dialogKey: "grandpa" })
    ]
  }));

  sceneManager.addScene(new Scene({
    name: "001",
    bgKey: "train",
    playDoorSfx: true,
    windViewImg: NightViewImg,
    windOffsetY: -400,
    windScrollSpeed: 2.0,
    entryMap: {
      left: { to: 2, spawnX: 865, canGo: true },
      right: { to: 9, spawnX: -25, canGo: true }
    },
    npcs: [
      new NPC({ name: "未知的女子", x: 720, y: 285, sprite: npcImages.girl, dialogKey: "girl" })
    ]
  }));


  sceneManager.addScene(new Scene({
    name: "002",
    bgKey: "train",
    playDoorSfx: true,
    windViewImg: NightViewImg,
    windOffsetY: -500,
    entryMap: {
      left: { to: 3, spawnX: 865, canGo: true },
      right: { to: 1, spawnX: -25, canGo: true }
    },
     npcs: [
      new NPC({ name: "兔子", x: 420, y: 305, sprite: npcImages.rabbit, dialogKey: "rabbit" })
    ]
    
  }));
  
  sceneManager.addScene(new Scene({
    name: "003",
    bgKey: "train",
    playDoorSfx: true,
    windViewImg: NightViewImg,
    windOffsetY: -500,
    entryMap: {
      left: { to: 4, spawnX: 865, canGo: true },
      right: { to: 2, spawnX: -25, canGo: true }
    },
    npcs: [
      new NPC({ name: "軟糖熊", x: 420, y: 295, sprite: npcImages.bearie, dialogKey: "bear" })
    ]
  }));
  
  sceneManager.addScene(new Scene({
    name: "004",
    bgKey: "train",
    playDoorSfx: true,
    windViewImg: NightViewImg,
    windOffsetY: -500,
    entryMap: {
      left: { to: 5, spawnX: 865, canGo: true },
      right: { to: 3, spawnX: -25, canGo: true }
    },
    npcs: [
      new NPC({ name: "氣球狗", x: 620, y: 305, sprite: npcImages.doggie, dialogKey: "dog" })
    ]
  }));
  
  sceneManager.addScene(new Scene({
    name: "005",
    bgKey: "train",
    playDoorSfx: true,
    windViewImg: NightViewImg,
    windOffsetY: -500,
    entryMap: {
      left: { to: 6, spawnX: 865, canGo: true },
      right: { to: 4, spawnX: -25, canGo: true }
    },
     npcs: [
      new NPC({ name: "狐狸娃娃", x: 420, y: 300, sprite: npcImages.fox, dialogKey: "fox" })
    ]
  }));
  
  sceneManager.addScene(new Scene({
    name: "006",
    bgKey: "train",
    playDoorSfx: true,
    windViewImg: NightViewImg,
    windOffsetY: -500,
    entryMap: {
      left: { to: 7, spawnX: 865, canGo: true },
      right: { to: 5, spawnX: -25, canGo: true }
    }
  }));
  
  sceneManager.addScene(new Scene({
    name: "007",
    bgKey: "train",
    playDoorSfx: true,
    windViewImg: NightViewImg,
    windOffsetY: -500,
    entryMap: {
      left: { to: 8, spawnX: 865, canGo: true },
      right: { to: 6, spawnX: -25, canGo: true }
    }
  }));
  
  sceneManager.addScene(new Scene({
    name: "008",
    bgKey: "train",
    playDoorSfx: true,
    windViewImg: NightViewImg,
    windOffsetY: -500,
    entryMap: {
      left: { to: 9, spawnX: 865, canGo: true },
      right: { to: 7, spawnX: -25, canGo: true }
    }
  }));
  
  sceneManager.addScene(new Scene({
    name: "009",
    bgKey: "train",
    playDoorSfx: true,
    windViewImg: NightViewImg,
    windOffsetY: -500,
    entryMap: {
      left: { to: 1, spawnX: 865, canGo: true },
      right: { to: 8, spawnX: -25, canGo: true }
    }
  }));
}


function drawBackground() {

    if (!sceneManager) return;

  const scene = sceneManager.getCurrentScene();
  const bgKey = scene.bgKey;

    // ✅ 根據背景是否是列車場景決定是否震動
  if (bgKey === "train" && game.trainStarted) {
    game.shaker.start(); // ✅ 選擇後才開始震動
  } else {
    game.shaker.stop();  // ❄️ 初始時靜止
  }

    game.shaker.update(); 
    sceneManager.draw();  
    game.shaker.reset();  
  
}

function updateSceneScrollOffset(scene, direction = "east") {
  if (!scene.windViewImg) return;
  const speed = scene.windScrollSpeed || 1;
  scene._offsetX = scene._offsetX || 0;
  if (direction === "east") {
    scene._offsetX -= speed;
  } else {
    scene._offsetX += speed;
  }
  scene._offsetX %= scene.windViewImg.width;
}

function drawLoopingBackgroundMasked(img, offsetX, windowX, windowY, windowW, windowH, offsetY = 0) {
  if (!img) return;
  const imgW = img.width;

  push();
  clip(() => {
    rect(windowX, windowY, windowW, windowH);
  });

  image(img, offsetX - imgW, windowY + offsetY);
  image(img, offsetX, windowY + offsetY);
  image(img, offsetX + imgW, windowY + offsetY);

  pop();
}



