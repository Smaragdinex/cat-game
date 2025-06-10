// 紀錄目前有哪些按鈕被觸控中
let touchKeys = new Set();
let TOUCH_BINDINGS = [];

// 初始化按鈕位置（在 setup() 裡呼叫）
function initTouchBindings() {
  TOUCH_BINDINGS = [
    { code: 37, x: 60, y: height - 100 },             // ← LEFT
    { code: 39, x: 160, y: height - 100 },            // → RIGHT
    { code: 16, x: width - 140, y: height - 160 },    // 🏃 SHIFT (跑步)
    { code: 88, x: width - 60, y: height - 220 }      // X 坐下 / 起身
    // 你可以加入更多：如對話鍵、暫停鍵
  ];
}

// 每一幀畫出按鈕
function drawTouchButtons() {
  for (let btn of TOUCH_BINDINGS) {
    fill(touchKeys.has(btn.code) ? 150 : 220); // 按下時變色
    ellipse(btn.x, btn.y, 60);

    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    let label = getButtonLabel(btn.code);
    text(label, btn.x, btn.y);
  }
}

// 顯示按鈕標籤（對應 keyCode）
function getButtonLabel(code) {
  if (code === 37) return "←";
  if (code === 39) return "→";
  if (code === 16) return "🏃";
  if (code === 88) return "X";
  return "?";
}

// 檢查觸控並模擬鍵盤輸入
function checkTouchControls() {
  let currentTouchKeys = new Set();

  for (let t of touches) {
    for (let btn of TOUCH_BINDINGS) {
      if (dist(t.x, t.y, btn.x, btn.y) < 30) {
        currentTouchKeys.add(btn.code);

        if (!touchKeys.has(btn.code)) {
          cat.keyPressed(btn.code);
        }
      }
    }
  }

  // 判斷釋放的按鈕
  for (let code of touchKeys) {
    if (!currentTouchKeys.has(code)) {
      cat.keyReleased(code);
    }
  }

  touchKeys = currentTouchKeys; // 更新狀態
}
