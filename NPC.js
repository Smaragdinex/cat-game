window.npcImages = {};
window.npcDialogs = {};


class NPC{
  constructor({ name, x, y, sprite, dialogKey }) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.dialogKey = dialogKey;
  }
  
  isNear(cat) {
  return dist(this.x, this.y, cat.x, cat.y) < 70;
  }

  update() {
    // 若有動畫可加邏輯
  }

  display() {
    if (!this.sprite) {
    return;
  }
    const scale = width / 320; // 假設背景原寬是 320px
    imageMode(CENTER);
    image(this.sprite, this.x, this.y, this.sprite.width * scale, this.sprite.height * scale);
    imageMode(CORNER);
  }

  speak() {
    const text = npcDialogs[this.dialogKey]?.[game.currentLang] || "......";
    const displayName = langText?.[game.currentLang]?.[`npc_${this.dialogKey}`] || this.name;
    showDialog(text, displayName);
  }
}

function setupNPCDialogs() {
  npcDialogs.homeless = {
    zh: [
    "zzzzzz......ZZZZZZ" 
  ],
  en: [
    "zzzzzz......ZZZZZZ" 
  ]
};
  npcDialogs.grandpa = {
  zh: [
  "你終於醒了……",
  "夢境與現實，或許並沒有那麼不同。",
  "喵……別忘了，你的選擇將決定下一段旅程。"
  ],
  en: [
  "You're finally awake…",
  "Perhaps dreams and reality aren't so different.",
  "Meow… Remember, your choices shape the journey ahead."
  ]
};
}

function preloadNPCImages() {
  npcImages.homeless = loadImage("data/NPC/homeless.png");
  npcImages.grandpa = loadImage("data/NPC/grandpa.png");
  
}
