window.npcImages = {};
window.npcDialogs = {};

class NPC{
  constructor({ name, x, y, sprite, dialogKey }) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.dialogKey = dialogKey;
    game.girlReactedToMeow = false;

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
    const name = this.name;
    const langKey = langText?.[game.currentLang]?.[`npc_${this.dialogKey}`] || name;

    if (this.dialogKey === "girl") {
      this.speakToGirl(langKey);
      return;
    }

    if (this.dialogKey === "grandpa") {
      this.speakToGrandpa(langKey);
      return;
    }

    // 通用 NPC 對話
    const lines = npcDialogs[this.dialogKey]?.[game.currentLang] || ["..."];
    game.dialogue.show(lines, langKey);
  }
  
  speakToGirl(displayName) {
    const dialogSet = game.girlReactedToMeow
      ? npcDialogs.girl.afterMeow
      : npcDialogs.girl.default;

    const lines = dialogSet?.[game.currentLang] || ["..."];

    game.dialogue.show(lines, displayName, 0, (key, choice) => {
      if (key === "play_with_girl") {
        if (choice === "想玩" || choice === "Sure") {
          game.mode = "minigame";
          startMiniGame();
        } else {
          const reply = {
            zh: ["『好吧，那你有空再找我玩～』"],
            en: ["\"Okay, maybe next time.\""]
          };
          game.dialogue.show(reply[game.currentLang], displayName);
        }
      }
    });
  }
  
  speakToGrandpa(displayName) {
    if (game.trainChoice) {
      const finalLine = {
        zh: ["謝謝你，小貓咪，這路程很遙遠建議你休息一下"],
        en: ["Thank you, kitty. This journey is long... you should get some rest."]
      };
      game.dialogue.show(finalLine[game.currentLang], displayName);
      return;
    }

    const lines = npcDialogs[this.dialogKey]?.[game.currentLang] || ["..."];

    game.dialogue.show(lines, displayName, 0, (key, choice) => {
      if (key === "train_direction") {
        game.trainChoice = choice;
        game.trainDirection = (choice.includes("東") || choice === "Going East") ? "east" : "west";
        game.trainStarted = true;
        game.dialogWithGrandpaDone = true;

        const followUp = {
          zh: [
            "謝謝你，小貓咪，這路程很遙遠建議你休息一下"
          ],
          en: [
            "Thank you, kitty. This journey is long... you should get some rest."
          ]
        };
        game.dialogue.show(followUp[game.currentLang], displayName);
      }
    });
  }

}


function setupNPCDialogs() {
    npcDialogs.girl = {
      default: {
        zh: [
          "(她似乎沒注意到你。)"
        ],
        en: [
          "(She doesn't seem to notice you.)"
        ]
      },
      afterMeow: {
        zh: [
          "抱歉小貓咪沒注意到你,你也想玩遊戲嗎？",
          {
            choices: ["想玩", "不了"],
            key: "play_with_girl"
          },
          "『這隻貓怎麼會叫我？』",
          "她笑了笑。"
        ],
        en: [
          "She looks up for a moment.",
          {
            choices: ["Sure", "Maybe later"],
            key: "play_with_girl"
          },
          "\"Did that cat just meow at me?\"",
          "She smiles slightly."
        ]
      }
    };

    npcDialogs.grandpa = {
      zh: [
        "你好,小貓咪",
        "你知道這列車準備往東邊前進，還是往西邊？",
        {
          choices: ["往西前進", "往東前進"],
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
  npcImages.girl = loadImage("data/NPC/002.png",img => {
    img.resize(0, 42);
   });
  npcImages.grandpa = loadImage("data/NPC/papa.png", img => {
    img.resize(40, 46);  // 👈 同樣縮小老爺爺
  });
  npcImages.rabbit = loadImage("data/NPC/rabbit.png", img => {
    img.resize(30, 40);  // rabbit
  });
  npcImages.bearie = loadImage("data/NPC/bearie.png", img => {
    img.resize(25, 40);  // bear
  });
  npcImages.doggie = loadImage("data/NPC/doggie.png", img => {
    img.resize(26, 30);  // doggie
  });
  npcImages.fox = loadImage("data/NPC/fox.png", img => {
    img.resize(30, 30);  // fox
  });
}
