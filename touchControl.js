// 紀錄目前有哪些按鈕被觸控中
let touchKeys = new Set();
let TOUCH_BINDINGS = [];
let buttonImages = {};
let inputTarget = null;

function setInputTarget(obj) { inputTarget = obj; }

// 初始化按鈕位置（在 setup() 裡呼叫）
function initTouchBindings() {
  TOUCH_BINDINGS = [
    { code: 1001, x: 60, y: height - 60 },             // ← LEFT
    { code: 1002, x: 160, y: height - 60 },            // → RIGHT
    { code: 1003, x: width - 60, y: height - 80 }, // >> SHIFT (跑步)
    { code: 88, x: width - 140, y: height - 60 }// X 坐下 / 起身
    // 你可以加入更多：如對話鍵、暫停鍵
  ];
}

function preloadTouchButtonImages() {
  buttonImages[1001] = loadImage('data/Icon/cursor_left.png');
  buttonImages[1002] = loadImage('data/Icon/cursor_right.png');
  buttonImages[1003] = loadImage('data/Icon/fast_forward.png');
  buttonImages[88] = loadImage('data/Icon/cross.png');
}

// 每一幀畫出按鈕
function drawTouchButtons() {
  for (let btn of TOUCH_BINDINGS) {
    // 半透明底色
    if (touchKeys.has(btn.code)) {
      fill(180, 180, 180, 180); // 按下時較不透明
    } else {
      fill(220, 220, 220, 80);  // 沒按下時更透明
    }
    ellipse(btn.x, btn.y, 50);

    // 畫按鈕圖片（置中縮放）
    let img = buttonImages[btn.code];
    if (img) {
      imageMode(CENTER);                    // 置中畫
      image(img, btn.x, btn.y, 28, 28);     // 建議比圓小
      imageMode(CORNER);                    // ← 畫完立刻還原！
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
          if (btn.code === 88 && typeof game !== 'undefined') {
            game.keyPressed(88);  
          } else if (inputTarget?.keyPressed) {
            inputTarget.keyPressed(btn.code);
          }

        }
      }
    }
  }

  // 判斷釋放的按鈕
  for (let code of touchKeys) {
    if (!currentTouchKeys.has(code)) {
      if (inputTarget) inputTarget.keyReleased(code);
    }
  }
  touchKeys = currentTouchKeys; // 更新狀態
}
