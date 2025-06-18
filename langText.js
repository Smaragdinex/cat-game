// 📁 menu.js
let gearIcon;

// 語言對照文字
const langText = {
  zh: {
    npc_homeless: "未知的男子",
    npc_grandpa: "神秘老人",
    control: "控制說明：\n← →：移動\n↑ ↓：選擇對話選項\nShift：跑步\nX：坐下 / 起身 / 確認\nC：貓叫",
    language: "語言選擇：\n中文 / English",
    btn_control: "控制說明",
    btn_lang: "語言",
    btn_volume: "音量",
    btn_close: "關閉",
    dialog_locked: "這裡不能過去喵！鎖住了！！",
    dialog_dream: "你似乎做了一場夢…喵",
    dialog_sleephint: "你也許該……坐下來，休息一下？",
    dialog_train_question: "你知道這列車正往哪邊走嗎？",
    dialog_train_left: "你選擇了左側的列車，回到過去。",
    dialog_train_right: "你選擇了右側的列車，通往未來。",
    dialog_train_after: "老人只是靜靜地看著你。",
    system: "系統",
    btn_zh: "中文",
    btn_en: "英文"
  },
  en: {
    npc_homeless: "Anonymous",
    npc_grandpa: "Mysterious Old Man",
    control: "Controls:\n← → : Move\n↑ ↓ : Choose option\nShift: Run\nX: Sit / Stand / Confirm\nC: Meow",
    language: "Language:\nChinese / English",
    btn_control: "Controls",
    btn_lang: "Language",
    btn_volume: "Volume",
    btn_close: "Close",
    dialog_locked: "You can't go through meow! It's locked!",
    dialog_dream: "You seem to have had a dream...Meow.",
    dialog_sleephint: "Maybe... you should sit down and rest.",
    dialog_train_question: "Do you know which direction this train is heading?",
    dialog_train_left: "You chose the left train — to the past.",
    dialog_train_right: "You chose the right train — to the future.",
    dialog_train_after: "The old man silently looks at you.",
    system: "System",
    btn_zh: "Chinese",
    btn_en: "English"
  }
};

function preloadMenuImages() {
  gearIcon = loadImage('data/Icon/settings_3.png');
}



