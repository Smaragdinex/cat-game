// 📁 menu.js
let showMenu = false;
let activePanel = null; // 'control', 'language'
let currentLang = 'zh';

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

function drawMenu() {
  if (!showMenu) return;

  fill(255, 255, 255, 220);
  noStroke();
  rect(width - 200, 50, 180, 100, 10);

  fill(0);
  textSize(16);
  textAlign(LEFT, TOP);
  text(langText[currentLang].btn_control, width - 180, 60);
  text(langText[currentLang].btn_lang, width - 180, 100);
}

function drawPanel() {
  if (activePanel === 'control') {
    fill(255, 255, 255, 220);
    noStroke();
    rect(width / 2 - 160, height / 2 - 100, 320, 180, 12);
    fill(0);
    textAlign(CENTER, TOP);
    textSize(16);
    text(langText[currentLang].control, width / 2, height / 2 - 80);
    
    fill(200);
    rect(width / 2 - 40, height / 2 + 60, 80, 30, 8);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(14);
    text("關閉", width / 2, height / 2 + 75);
  }
  if (activePanel === 'language') {
    fill(255, 255, 255, 220);
    noStroke();
    rect(width / 2 - 160, height / 2 - 80, 320, 160, 12);

    fill(0);
    textAlign(CENTER, TOP);
    textSize(16);
    text(langText[currentLang].language, width / 2, height / 2 - 70);

    // 畫兩個語言選項按鈕
    fill(200);
    rect(width / 2 - 100, height / 2 - 20, 80, 30, 8);
    rect(width / 2 + 20, height / 2 - 20, 80, 30, 8);

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(14);
    text(langText[currentLang].btn_zh, width / 2 - 60, height / 2 - 5);
    text(langText[currentLang].btn_en, width / 2 + 60, height / 2 - 5);

    // 畫關閉按鈕
    fill(200);
    rect(width / 2 - 40, height / 2 + 40, 80, 30, 8);
    fill(0);
    text("關閉", width / 2, height / 2 + 55);
  }
}

function mousePressedMenu(mx, my) {
  if (activePanel === 'control') {
    // ➕ 判斷是否點擊「關閉」按鈕
    if (
      mx >= width / 2 - 40 && mx <= width / 2 + 40 &&
      my >= height / 2 + 60 && my <= height / 2 + 90
    ) {
      activePanel = null;
    }
    return; // 避免點到背後 menu
  }
  
  if (activePanel === 'language') {
    // 中文按鈕
    if (
      mx >= width / 2 - 100 && mx <= width / 2 - 20 &&
      my >= height / 2 - 20 && my <= height / 2 + 10
    ) {
      currentLang = 'zh';
      activePanel = null;
    }

    // 英文按鈕
    if (
      mx >= width / 2 + 20 && mx <= width / 2 + 100 &&
      my >= height / 2 - 20 && my <= height / 2 + 10
    ) {
      currentLang = 'en';
      activePanel = null;
    }

    // 關閉按鈕
    if (
      mx >= width / 2 - 40 && mx <= width / 2 + 40 &&
      my >= height / 2 + 40 && my <= height / 2 + 70
    ) {
      activePanel = null;
    }

    return; // 阻擋後方 menu 事件
  }

  if (showMenu) {
    if (mx >= width - 200 && mx <= width - 20) {
      if (my >= 60 && my <= 90) {
        activePanel = 'control';
        showMenu = false;
      } else if (my >= 100 && my <= 130) {
        activePanel = 'language';
        showMenu = false;
      }
    } else {
      showMenu = false;
    }
  } else {
    if (dist(mx, my, gearX + gearSize / 2, gearY + gearSize / 2) < gearSize / 2) {
      showMenu = true;
    }
  }
}
