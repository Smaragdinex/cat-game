let dialogActive = false;
let dialogText = "";
let dialogSpeaker = "";
let dialogTimer = 0;
let dialogDuration = 0; 
let interactBtnImg;

let dialogDisplayText = "";  // 正在顯示的內容
let dialogCharIndex = 0;     // 顯示到第幾個字
let dialogCharInterval = 40; // 每幾 ms 顯示一個字

function  preloadDialogueImages()
{
  interactBtnImg = loadImage('data/Icon/x.png');
}

function showDialog(text, speaker = "", duration = 0) {
  dialogText = text;
  dialogSpeaker = speaker;
  dialogActive = true;
  dialogTimer = millis();
  dialogDuration = duration;
  
  dialogDisplayText = "";
  dialogCharIndex = 0;
}

function hideDialog() {
  dialogActive = false;
  dialogText = "";
  dialogSpeaker = "";
  dialogDuration = 0;
}

function drawEdgeInteractHint(cat) {
  let floatOffset = sin(millis() / 400) * 6; 
  imageMode(CENTER);
  image(interactBtnImg, cat.x + cat.width / 2, cat.y - 30 + floatOffset, 40, 40);
  imageMode(CORNER);
}

function drawDialog() {
  if (!dialogActive) return;

  // 打字機效果：每 X ms 顯示一個字
  let now = millis();
  let charsToShow = Math.floor((now - dialogTimer) / dialogCharInterval);
  if (charsToShow > dialogCharIndex) {
    dialogCharIndex = min(charsToShow, dialogText.length);
    dialogDisplayText = dialogText.substring(0, dialogCharIndex);
  }

  // 計算文字尺寸，自動調整對話框寬度
  textSize(18);
  let padding = 40;
  let textW = textWidth(dialogDisplayText);
  let boxW = constrain(textW + padding, 200, width - 60); // 最小200，最大畫面寬-60
  let boxH = 80;
  let boxX = width / 2 - boxW / 2;
  let boxY = height - boxH - 30;

  // 繪製框
  fill(255, 245, 210, 230);
  stroke(120); strokeWeight(2);
  rect(boxX, boxY, boxW, boxH, 16);

  // 文字內容
  noStroke();
  fill(30);
  textAlign(LEFT, TOP);
  textSize(18);

  if (dialogSpeaker) {
    text(dialogSpeaker + ":", boxX + 20, boxY + 16);
    text(dialogDisplayText, boxX + 20, boxY + 44, boxW - 30, boxH - 30);
  } else {
    text(dialogDisplayText, boxX + 20, boxY + 32, boxW - 30, boxH - 30);
  }

  // 自動結束
  if (dialogDuration > 0 && now - dialogTimer > dialogDuration) {
    hideDialog();
  }
}



