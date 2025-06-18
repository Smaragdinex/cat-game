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
    const scale = width / 320;// 假設背景原寬是 320px
    imageMode(CENTER);
    image(this.sprite, this.x, this.y, this.sprite.width * scale, this.sprite.height * scale);
    imageMode(CORNER);
  }

  speak() {
    const text = npcDialogs[this.dialogKey]?.[game.currentLang] || "......";
    const displayName = langText?.[game.currentLang]?.[`npc_${this.dialogKey}`] || this.name;

    if (this.dialogKey === "grandpa") {
      // ✅ 玩家已選過，不再重複選項流程
      if (game.trainChoice) {
        const finalLine = {
          zh: ["謝謝你告訴我，小貓咪。"],
          en: ["Thank you for telling me, kitty."]
        };
        game.dialogue.show(finalLine[game.currentLang], displayName);
        return;
      }

      // ✨ 第一次對話流程（還沒選過）
      game.dialogue.show(text, displayName, 0, (key, choice) => {
        if (key === "train_direction") {
          game.trainChoice = choice; // ✅ 記下選擇，避免重複

          const followUp = {
            zh: [
              "謝謝你告訴我，小貓咪。"
            ],
            en: [
              "Thank you for telling me, kitty."
            ]
          };
          game.dialogue.show(followUp[game.currentLang], displayName);
        }
      });
    } else {
      game.dialogue.show(text, displayName);
    }
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
  "你好,小貓咪",
    "你知道這列車正在往東邊前進，還是往西邊？",
  {
      choices: ["往西走", "往東走"],
      key: "train_direction"
    }
  ],
  en: [
  "Hello, Kitty.",
  "Do you know if this train is heading east or west?",
    {
      choices: ["Going West", "Going East"],
      key: "train_direction"
    }
  ]
};
}

function preloadNPCImages() {
  npcImages.homeless = loadImage("data/NPC/homeless1.png",img => {
    img.resize(46, 0);
   });
  
  npcImages.grandpa = loadImage("data/NPC/papa.png", img => {
    img.resize(40, 46);  // 👈 同樣縮小老爺爺
  });
}
