window.npcImages = {};
window.npcDialogs = {};


class NPC {
  constructor({ name, x, y, sprite, dialogKey }) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.dialogKey = dialogKey;
  }

  isNear(cat) {
    return dist(this.x, this.y, cat.x, cat.y) < 80;
  }

  update() {
    // 若有動畫可加邏輯
  }

  display() {
    if (!this.sprite) {
    console.warn("❌ NPC sprite 未載入：", this.name);
    return;
  }
    const scale = width / 320; // 假設背景原寬是 320px
    imageMode(CENTER);
    image(this.sprite, this.x, this.y, this.sprite.width * scale, this.sprite.height * scale);
    imageMode(CORNER);
  }

  speak() {
    const text = npcDialogs[this.dialogKey]?.[game.currentLang] || "......";
    showDialog(text, this.name);
  }
}

function preloadNPCImages() {
  npcImages.homeless = loadImage("data/NPC/homeless.png");
}

function setupNPCDialogs() {
  npcDialogs.homeless = {
    zh: "別靠近我…我什麼都沒有…",
    en: "Stay away… I have nothing for you..."
  };
}
