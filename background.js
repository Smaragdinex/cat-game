let sceneImages = {};
let railingImg;
let sceneManager;

class Scene {
  constructor({ name, bgKey, entryMap, npcs = []}) {
    this.name = name;
    this.bgKey = bgKey;
    this.entryMap = entryMap;
    this.npcs = npcs;
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
    const img = sceneImages[scene.bgKey];
    if (!img) return;

    const bgOriginalW = 320;
    const bgOriginalH = 180;
    const scale = width / bgOriginalW;
    const bgW = width;
    const bgH = bgOriginalH * scale;
    const bgY = height - bgH;

    image(img, 0, bgY, bgW, bgH);
    
    scene.npcs?.forEach(npc => {
      npc.update();
      npc.display();
    });

    // 欄杆
    if (railingImg) {
      const railingOriginalW = 293;
      const railingOriginalH = 64;
      const railingW = railingOriginalW * scale;
      const railingH = railingOriginalH * scale;
      const railingX = 15 * scale;
      const railingY = bgY + bgH - railingH * 1.77;
      image(railingImg, railingX, railingY, railingW, railingH);
    }
  }

  transition(direction, cat) {
    const current = this.getCurrentScene();
    const entry = current.entryMap[direction];
    if (!entry) return;

    this.currentIndex = entry.to;

    const next = this.getCurrentScene();
    if (entry.spawnX !== undefined) cat.x = entry.spawnX;
    if (entry.spawnY !== undefined) cat.y = entry.spawnY;
  }
}

function preloadBackgroundImages() {
  // 載入背景圖片（保留原結構）
  sceneImages.default = loadImage('data/background/train00.png');
  sceneImages.train = loadImage('data/background/train01.png');
  sceneImages.train1 = loadImage('data/background/train02.png');
  sceneImages.web1 = loadImage('data/background/web1.png');
  sceneImages.web2 = loadImage('data/background/web2.png');
  sceneImages.web3 = loadImage('data/background/web3.png');

  railingImg = loadImage('data/background/railing.png');
  console.log("💬 npcImages.homeless =", npcImages?.homeless);

  // 初始化 sceneManager
  sceneManager = new SceneManager();

  // 加入場景
  sceneManager.addScene(new Scene({
    name: "001",
    bgKey: "default",
    entryMap: {
    right: { to: 1, spawnX: 10, canGo: true }
  },
    npcs:[
    new NPC({ name: "homeless", x: 650, y: 350, sprite: npcImages.homeless, dialogKey: "homeless" })
      ]
  }));

  sceneManager.addScene(new Scene({
    name: "002",
    bgKey: "default",
    entryMap: {
      left: { to: 0, spawnX: 860 ,canGo: true},
      right: { to: 2, spawnX: 10 ,canGo: true}
    }
  }));

  sceneManager.addScene(new Scene({
    name: "003",
    bgKey: "default",
    entryMap: {
      left: { to: 1, spawnX: 860 ,canGo: true},
      right: { to: 3, spawnX: 10 ,canGo: true}
    }
  }));

  sceneManager.addScene(new Scene({
    name: "004",
    bgKey: "default",
    entryMap: {
      left: { to: 2, spawnX: 860 ,canGo: true},
      right: { to: 4, spawnX: 10 ,canGo: true}
    }
  }));

  sceneManager.addScene(new Scene({
    name: "005",
    bgKey: "default",
    entryMap: {
      left: { to: 3, spawnX: 860 ,canGo: true},
      right: { to: 5, spawnX: 10 ,canGo: true}
    }
  }));

  sceneManager.addScene(new Scene({
    name: "006",
    bgKey: "default",
    entryMap: {
      left: { to: 4, spawnX: 860 ,canGo: true}
    }
  }));
}

function drawBackground() {
  if (sceneManager) {
    sceneManager.draw();
  }
}
