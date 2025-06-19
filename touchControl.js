// 紀錄目前有哪些按鈕被觸控中
let touchKeys = new Set();
let TOUCH_BINDINGS = [];
let buttonImages = {};
let inputTarget = null;

function setInputTarget(obj) { inputTarget = obj; }

// 初始化按鈕位置（在 setup() 裡呼叫）
function initTouchBindings() {
  TOUCH_BINDINGS = [
    { code: 1001, x: 60, y: height - 65 },             // ← LEFT
    { code: 1002, x: 160, y: height - 65 },            // → RIGHT
    { code: 1004, x: 110, y: height - 100 },     // ↑ Up 
    { code: 1005, x: 110, y: height - 30 },      // ↓ Down
    { code: 1003, x: width - 60, y: height - 80 }, // >> SHIFT run
    { code: 88, x: width - 120, y: height - 30 },// X sit down sit up
    { code: 67, x: width - 180, y: height - 80 } // 新增 C 鍵（Meow）

    // 你可以加入更多：如對話鍵、暫停鍵
  ];
}

function preloadTouchButtonImages() {
  buttonImages[1001] = loadImage('data/Icon/left.png'); //left
  buttonImages[1002] = loadImage('data/Icon/right.png'); //right
  buttonImages[1004] = loadImage('data/Icon/up.png');     // up
  buttonImages[1005] = loadImage('data/Icon/down.png');   // down
  buttonImages[1003] = loadImage('data/Icon/paw.png'); // run
  buttonImages[88] = loadImage('data/Icon/x-mark.png');
  buttonImages[67] = loadImage('data/Icon/cat.png'); 
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

        // 🧠 按鈕剛被按下
        if (!touchKeys.has(btn.code)) {
          // 🧠 將虛擬上下鍵轉換為 p5 系統的 keyCode
          let actualKey = btn.code;
          if (btn.code === 1004) actualKey = UP_ARROW;
          if (btn.code === 1005) actualKey = DOWN_ARROW;

          // 🧠 如果是對話選項相關按鍵（X / ↑ / ↓）
          if ([88, UP_ARROW, DOWN_ARROW].includes(actualKey)) {
            if (game.dialogue?.handleChoiceKey?.(actualKey)) return;
          }

          // 🧠 一般處理鍵盤輸入
          handleKeyPressed(game, actualKey);
        }
      }
    }
  }

  // 🧠 處理釋放
  for (let code of touchKeys) {
    if (!currentTouchKeys.has(code)) {
      let actualKey = code;
      if (code === 1004) actualKey = UP_ARROW;
      if (code === 1005) actualKey = DOWN_ARROW;

      handleKeyReleased(game, actualKey);
    }
  }

  // 更新狀態
  touchKeys = currentTouchKeys;
}
