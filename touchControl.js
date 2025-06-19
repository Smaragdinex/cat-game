// 紀錄目前有哪些按鈕被觸控中
let touchKeys = new Set();
let TOUCH_BINDINGS = [];
let buttonImages = {};
let inputTarget = null;

function setInputTarget(obj) {
  inputTarget = obj;
}

// 初始化按鈕位置（在 setup() 裡呼叫）
function initTouchBindings() {
  TOUCH_BINDINGS = [
    { code: 1003, x: width - 60, y: height - 80 },   // Shift → 跑步
    { code: 88,   x: width - 120, y: height - 40 },  // X     → 坐下 / 互動
    { code: 67,   x: width - 180, y: height - 80 }   // C     → 喵叫
  ];
}

function preloadTouchButtonImages() {
  buttonImages[1003] = loadImage('data/Icon/paw.png');     // Shift
  buttonImages[88]   = loadImage('data/Icon/x-mark.png');  // X
  buttonImages[67]   = loadImage('data/Icon/cat.png');     // C
}

function drawTouchButtons() {
  for (let btn of TOUCH_BINDINGS) {
    // 底色圓
    if (touchKeys.has(btn.code)) {
      fill(180, 180, 180, 180);
    } else {
      fill(220, 220, 220, 80);
    }
    ellipse(btn.x, btn.y, 50);

    // 圖示
    let img = buttonImages[btn.code];
    if (img) {
      imageMode(CENTER);
      image(img, btn.x, btn.y, 28, 28);
      imageMode(CORNER);
    }
  }
}

// 檢查觸控並模擬鍵盤輸入
function checkTouchControls() {
  let currentTouchKeys = new Set();

  const points = (touches.length > 0)
    ? touches
    : (mouseIsPressed ? [{ x: mouseX, y: mouseY }] : []);

  for (let p of points) {
    if (typeof p.x !== 'number' || typeof p.y !== 'number') continue;

    for (let btn of TOUCH_BINDINGS) {
      if (dist(p.x, p.y, btn.x, btn.y) < 30) {
        currentTouchKeys.add(btn.code);

        if (!touchKeys.has(btn.code)) {
          // 若為對話相關鍵（例如 X），優先處理
          if (btn.code === 88) {
            if (game.dialogue?.handleChoiceKey?.(88)) return;
          }

          handleKeyPressed(game, btn.code);
        }
      }
    }
  }

  // 處理釋放
  for (let code of touchKeys) {
    if (!currentTouchKeys.has(code)) {
      handleKeyReleased(game, code);
    }
  }

  touchKeys = currentTouchKeys;
}
