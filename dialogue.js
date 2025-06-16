let interactBtnImg;

let dialogActive = false;
let dialogLines = []; 
let dialogSpeaker = "";
let dialogTimer = 0;
let dialogIsLocked = false;  
let dialogDisplayText = "";  
let dialogCharIndex = 0;
let dialogCurrentLine = 0;
let dialogCharInterval = 50;
let dialogDuration = 0; 

function  preloadDialogueImages()
{
  interactBtnImg = loadImage('data/Icon/x.png');
}

function showDialog(lines, speaker = "", duration = 0) {
  
  dialogSpeaker = speaker;
  dialogActive = true;
  dialogTimer = millis();
  dialogDuration = duration;
  dialogCharIndex = 0;
  
  if (Array.isArray(lines)) {
    dialogLines = lines;
  } else {
    dialogLines = [lines];
  }
  
  dialogDisplayText = "";
  dialogCurrentLine = 0;
}

function hideDialog() {
  dialogActive = false;
  dialogLines = [];
  dialogDisplayText = "";
  dialogCurrentLine = 0;
  dialogIsLocked = false;
}

  function drawEdgeInteractHint(cat) {
      let floatOffset = sin(millis() / 400) * 6;

      const hitbox = cat.getHitbox();
      const leftEdge = hitbox.x;
      const rightEdge = hitbox.x + hitbox.w;

      const showLeft = leftEdge <= 30;
      const showRight = rightEdge >= width - 30;

      let hintX;
      const padding = 10;  // 可依需求調整距離

      if (showLeft) {
        hintX = hitbox.x + hitbox.w + padding;  // 左邊界：從 hitbox 右側往右偏移
      } else if (showRight) {
        hintX = hitbox.x - padding;             // 右邊界：從 hitbox 左側往左偏移
      } else {
        hintX = hitbox.x + hitbox.w / 2;        // 中間：hitbox 正中央
      }

      const hintY = hitbox.y - 100 + floatOffset;

      imageMode(CENTER);
      image(interactBtnImg, hintX, hintY, 40, 40);
      imageMode(CORNER);
    }

function drawDialog() {
  if (!dialogActive) return;

  updateTypingEffect();
  const { boxX, boxY, boxW, boxH } = calculateDialogBoxSize();
  drawDialogBox(boxX, boxY, boxW, boxH);
  drawDialogText(boxX, boxY, boxW, boxH);
  checkAutoHide();

}

function updateTypingEffect() {
  
  const fullText = dialogLines[dialogCurrentLine] || "";
  let now = millis();
  let charsToShow = Math.floor((now - dialogTimer) / dialogCharInterval);
  if (charsToShow > dialogCharIndex) {
    dialogCharIndex = min(charsToShow, fullText.length);
    dialogDisplayText = fullText.substring(0, dialogCharIndex);
  }
}

function calculateDialogBoxSize() {
  textSize(18);
  const padding = 40;
  const textW = textWidth(dialogDisplayText);
  const boxW = constrain(textW + padding, 200, width - 60);
  const boxH = 80;
  const boxX = width / 2 - boxW / 2;
  const boxY = height - boxH - 30;
  return { boxX, boxY, boxW, boxH };
}

function drawDialogBox(x, y, w, h) {
  fill(255, 245, 210, 230);
  stroke(120); strokeWeight(2);
  rect(x, y, w, h, 16);
}

function drawDialogText(x, y, w, h) {
  noStroke();
  fill(30);
  textAlign(LEFT, TOP);
  textSize(18);

  if (dialogSpeaker) {
    text(dialogSpeaker + ":", x + 20, y + 16);
    text(dialogDisplayText, x + 20, y + 44, w - 30, h - 30);
  } else {
    text(dialogDisplayText, x + 20, y + 32, w - 30, h - 30);
  }
}

function checkAutoHide() {
  if (dialogDuration > 0 && millis() - dialogTimer > dialogDuration) {
    hideDialog();
  }
}

function nextDialogLine() {
  if (!dialogActive) return;

  const fullText = dialogLines[dialogCurrentLine] || "";

  if (dialogCharIndex < fullText.length) {
    dialogCharIndex = fullText.length;
    dialogDisplayText = fullText;
    return;
  }

  dialogCurrentLine++;
  if (dialogCurrentLine >= dialogLines.length) {
    hideDialog(); 
  } else {
    dialogCharIndex = 0;
    dialogDisplayText = "";
    dialogTimer = millis();
  }
}


