// 紀錄目前有哪些按鈕被觸控中
let touchKeys = new Set();
let TOUCH_BINDINGS = [];
let buttonImages = {};
let inputTarget = null;

const TOUCH_BINDINGS_MAIN_CODES = [
  { code: 1003 }, // Shift
  { code: 88 },   // X
  { code: 67 }    // C
];

const TOUCH_BINDINGS_MINIGAME_CODES = [
  { code: 1003 }, // Shift
  { code: 32 }    // Space
];

function setInputTarget(obj) {
  inputTarget = obj;
}

// 初始化按鈕位置（在 setup() 裡呼叫）
function initTouchBindings(mode = "main") {
  if (mode === "minigame") {
    // 🟢 minigame模式：每個按鈕位置手動指定
    TOUCH_BINDINGS = [
      { code: 1003, x: width - 60, y: height - 80 },   // Shift
      { code: 32,   x: width - 120, y: height - 40 }   // Space
    ];
  } else {
    // 🟢 main模式：每個按鈕位置手動指定
    TOUCH_BINDINGS = [
      { code: 1003, x: width - 60,  y: height - 80 },  // Shift
      { code: 88,   x: width - 120, y: height - 40 },  // X
      { code: 67,   x: width - 180, y: height - 80 }   // C
    ];
  }
}

function preloadTouchButtonImages() {
  buttonImages[1003] = loadImage('data/Icon/paw.png');     // Shift
  buttonImages[88]   = loadImage('data/Icon/x-mark.png');  // X
  buttonImages[67]   = loadImage('data/Icon/cat.png');     // C
  buttonImages[32]   = loadImage('data/Icon/jump.png');
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

        // 剛按下
        if (!touchKeys.has(btn.code)) {

          if (game.mode === "minigame") {
            if (typeof miniGameManager?.keyPressed === "function") {
              miniGameManager.keyPressed(btn.code);
            }
            continue;
          }

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
      if (game.mode === "minigame") {
        if (typeof miniGameManager?.keyReleased === "function") {
          miniGameManager.keyReleased(code);
        }
        continue;
      }

      handleKeyReleased(game, code);
    }
  }

  touchKeys = currentTouchKeys;
}
