// 📁 menu.js
let gearIcon;

// 語言對照文字
const langText = {
  zh: {
    npc_homeless: "未知的男子",
    npc_grandpa: "神秘老人",
    control: "🕹 控制說明：\n← →：移動\nShift：跑步\nX：坐下 / 起身\nC: 貓叫",
    language: "🌐 語言選擇：\n中文 / English",
    btn_control: "控制說明",
    btn_lang: "語言",
    btn_volume: "音量",
    btn_close: "關閉",
    dialog_locked: "這裡不能過去喵！鎖住了！！",
    dialog_dream: "你似乎做了一場夢…喵",
    dialog_sleephint: "你也許該……坐下來，休息一下？",
    system: "系統",
    btn_zh: "中文",
    btn_en: "英文"
  },
  en: {
    npc_homeless: "Anonymous",
    npc_grandpa: "Mysterious Old Man",
    control: "🕹 Controls:\n← → : Move\nShift: Run\nX: Sit / Stand\nC: Meow",
    language: "🌐 Language:\nChinese / English",
    btn_control: "Controls",
    btn_lang: "Language",
    btn_volume: "Volume",
    btn_close: "Close",
    dialog_locked: "You can't go through meow! It's locked!",
    dialog_dream: "You seem to have had a dream...Meow.",
    dialog_sleephint: "Maybe... you should sit down and rest.",
    system: "System",
    btn_zh: "Chinese",
    btn_en: "English"
  }
};

function preloadMenuImages() {
  gearIcon = loadImage('data/Icon/settings_3.png');
}



