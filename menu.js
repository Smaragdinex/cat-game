// 📁 menu.js
let gearIcon;

// 語言對照文字
const langText = {
  zh: {
    control: "🕹 控制說明：\n← →：移動\nShift：跑步\nX：坐下 / 起身",
    language: "🌐 語言選擇：\n中文 / English",
    btn_control: "控制說明",
    btn_lang: "語言",
    btn_zh: "中文",
    btn_en: "英文"
  },
  en: {
    control: "🕹 Controls:\n← → : Move\nShift: Run\nX: Sit / Stand",
    language: "🌐 Language:\nChinese / English",
    btn_control: "Controls",
    btn_lang: "Language",
    btn_zh: "Chinese",
    btn_en: "English"
  }
};

function preloadMenuImages() {
  gearIcon = loadImage('data/Icon/settings_3.png');
}
