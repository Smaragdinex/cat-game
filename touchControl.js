// 紀錄目前有哪些按鈕被觸控中
let touchKeys = new Set();
let TOUCH_BINDINGS = [];


function drawTouchButtons() {
  // 畫方向鍵與功能鍵
  for (let btn of TOUCH_BINDINGS) {
    fill(touchKeys.has(btn.code) ? 150 : 220);
    ellipse(btn.x, btn.y, 60);
    
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    let label = getButtonLabel(btn.code);
    text(label, btn.x, btn.y);
  }
}

function getButtonLabel(code) {
  if (code === LEFT_ARROW) return "←";
  if (code === RIGHT_ARROW) return "→";
  if (code === SHIFT) return "🏃";
  if (code === 88) return "X";
  return "?";
}

function checkTouchControls() {
  let activeNow = new Set();
  for (let t of touches) {
    for (let btn of TOUCH_BINDINGS) {
      if (dist(t.x, t.y, btn.x, btn.y) < 30) {
        activeNow.add(btn.code);
        if (!touchKeys.has(btn.code)) {
          player.keyPressed(btn.code); // 模擬 keyPressed
        }
      }
    }
  }

  // 檢查有沒有放開的按鈕（模擬 keyReleased）
  for (let code of touchKeys) {
    if (!activeNow.has(code)) {
      player.keyReleased(code);
    }
  }

  touchKeys = activeNow;
}
