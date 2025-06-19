let sceneImages = {};
let railingImg;
let sceneManager;
let nightViewImg;
let mountainViewImg;
let nightOffset = 0;
let nightScrollSpeed = 1;


class Scene {
  constructor({ name, bgKey, entryMap, npcs = [],playDoorSfx = true, canEnterDream = false, showRailing = false}) {
    this.name = name;
    this.bgKey = bgKey;
    this.entryMap = entryMap;
    this.npcs = npcs;
    this.playDoorSfx = playDoorSfx;
    this.canEnterDream = canEnterDream;
    this.showRailing = showRailing;
  }
}

class SceneManager {
  constructor() {
    this.scenes = [];
    this.currentIndex = 0;
  }

  addScene(scene) {
    this.scenes.push(scene);
  }

  getCurrentScene() {
    return this.scenes[this.currentIndex];
  }

  draw() {
    const scene = this.getCurrentScene();
    
    if (scene.name === "000") {
      if (game.trainDirection) {
        updateCityView(game.trainDirection);
        drawCityViewMasked();
      }
    }
    
    if (scene.name === "001" || scene.name === "002") {
      if (game.trainDirection) {
        updateNightView(game.trainDirection);
        drawNightView();
      }
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

    // 欄杆
    if (railingImg && scene.showRailing) {
      const railingOriginalW = 293;
      const railingOriginalH = 64;
      const railingW = railingOriginalW * scale;
      const railingH = railingOriginalH * scale;
      const railingX = 15 * scale;
      const railingY = bgY + bgH - railingH * 1.77;
      image(railingImg, railingX, railingY, railingW, railingH);
    }
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
  // 載入背景圖片（保留原結構）
  sceneImages.default = loadImage('data/background/train.png');
  sceneImages.train = loadImage('data/background/train01.png');
  nightViewImg = loadImage('data/background/NightView.png');
  CityViewImg = loadImage('data/background/CityView.png');


  railingImg = loadImage('data/background/railing.png');

  // 初始化 sceneManager
  sceneManager = new SceneManager();

  // 加入場景
  sceneManager.addScene(new Scene({
    name: "000",
    bgKey: "train",
    playDoorSfx: true,
    canEnterDream: true,
    showRailing: false,
    entryMap: {
    left: { to: 0, spawnX: 865 ,canGo: false},
    right: { to: 0, spawnX: -25 ,canGo: false}
  },
    npcs:[
    new NPC({ name: "未知的男子", x: 650, y: 315, sprite: npcImages.homeless, dialogKey: "homeless" })
      ]
  }));

  sceneManager.addScene(new Scene({
    name: "001",
    bgKey: "train",
    playDoorSfx: true,
    entryMap: {
      left: { to: 2, spawnX: 865 ,canGo: true},
      right: { to: 2, spawnX: -25 ,canGo: true}
    },
    npcs:[
    new NPC({ name: "老爺爺", x: 660, y: 300, sprite: npcImages.grandpa, dialogKey: "grandpa" })
      ]
  }));

  sceneManager.addScene(new Scene({
    name: "002",
    bgKey: "train",
    playDoorSfx: true,
    canEnterDream: true,
    entryMap: {
      left: { to: 1, spawnX: 865 ,canGo: true},
      right: { to: 1, spawnX: -25 ,canGo: true}
    }
  }));

  sceneManager.addScene(new Scene({
    name: "003",
    bgKey: "train",
    entryMap: {
      left: { to: 2, spawnX: 865 ,canGo: true},
      right: { to: 4, spawnX: -25 ,canGo: true}
    }
  }));

  sceneManager.addScene(new Scene({
    name: "004",
    bgKey: "train",
    entryMap: {
      left: { to: 3, spawnX: 865 ,canGo: true},
      right: { to: 5, spawnX: -25 ,canGo: true}
    }
  }));

  sceneManager.addScene(new Scene({
    name: "005",
    bgKey: "train",
    entryMap: {
      left: { to: 4, spawnX: 865 ,canGo: true}
    }
  }));
}

function drawBackground() {
  if (sceneManager) {
    sceneManager.draw();
    
  if (!sceneManager) return;

  const scene = sceneManager.getCurrentScene();
  const bgKey = scene.bgKey;

    // ✅ 根據背景是否是列車場景決定是否震動
  if (bgKey === "default" || bgKey === "train") {
      game.shaker.start();
  } else {
      game.shaker.stop();
  }

    game.shaker.update(); // 套用震動偏移

    sceneManager.draw();  // 繪製背景和 NPC

    game.shaker.reset();  // pop 掉畫布偏移
  }
}

function updateNightView(direction = "east") {
  if (!nightViewImg) return;
  if (direction === "east") {
    nightOffset -= nightScrollSpeed;
  } else if (direction === "west") {
    nightOffset += nightScrollSpeed;
  }
  nightOffset %= nightViewImg.width;
}

function drawNightView() {
  if (!nightViewImg) return;

  const w = nightViewImg.width;
  const h = nightViewImg.height;

  image(nightViewImg, nightOffset, 0, w, height);
  image(nightViewImg, nightOffset + w, 0, w, height);
}

function updateCityView(direction = "east") {
  if (!CityViewImg) return;
  if (direction === "east") {
    nightOffset -= nightScrollSpeed; // ❗共用 same offset & speed
  } else if (direction === "west") {
    nightOffset += nightScrollSpeed;
  }
  nightOffset %= CityViewImg.width;
}

function drawCityViewMasked() {
  if (!CityViewImg) return;

  const imgW = CityViewImg.width;
  const imgH = CityViewImg.height;

  const windowX = 20;
  const windowY = 200;
  const windowW = 900;
  const windowH = 300;

  const cityYOffset = -600; // ✅ 圖片往上偏移對齊窗戶

  push();

  // ✅ 限制風景只畫在窗戶範圍
  clip(() => {
    rect(windowX, windowY, windowW, windowH);
  });

  // ✅ 正確比例：不拉伸，只畫原始圖片
  image(CityViewImg, nightOffset, windowY + cityYOffset);
  image(CityViewImg, nightOffset + imgW, windowY + cityYOffset);

  pop();
}

