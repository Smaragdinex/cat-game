class DialogueManager {
  constructor(lang = 'zh') {
    this.active = false;
    this.lines = [];
    this.speaker = "";
    this.timer = 0;
    this.duration = 0;
    this.displayText = "";
    this.charIndex = 0;
    this.currentLine = 0;
    this.charInterval = 50;
    this.isLocked = false;
    this.lang = lang;
    this.interactBtnImg = null;
  }

  preload() {
    this.interactBtnImg = loadImage('data/Icon/x.png');
  }

  show(lines, speaker = "", duration = 0) {
    this.speaker = speaker;
    this.active = true;
    this.timer = millis();
    this.duration = duration;
    this.charIndex = 0;
    this.currentLine = 0;
    this.displayText = "";
    this.lines = Array.isArray(lines) ? lines : [lines];
  }

  hide() {
    this.active = false;
    this.lines = [];
    this.displayText = "";
    this.currentLine = 0;
    this.isLocked = false;
  }

  update() {
    if (!this.active) return;
    const fullText = this.lines[this.currentLine] || "";
    const now = millis();
    const charsToShow = Math.floor((now - this.timer) / this.charInterval);
    if (charsToShow > this.charIndex) {
      this.charIndex = min(charsToShow, fullText.length);
      this.displayText = fullText.substring(0, this.charIndex);
    }
    if (this.duration > 0 && now - this.timer > this.duration) {
      this.hide();
    }
  }

  nextLine() {
    const fullText = this.lines[this.currentLine] || "";
    if (this.charIndex < fullText.length) {
      this.charIndex = fullText.length;
      this.displayText = fullText;
      return;
    }
    this.currentLine++;
    if (this.currentLine >= this.lines.length) {
      this.hide();
    } else {
      this.charIndex = 0;
      this.displayText = "";
      this.timer = millis();
    }
  }

  draw() {
    if (!this.active) return;
    const { boxX, boxY, boxW, boxH } = this.calculateBox();
    this.drawBox(boxX, boxY, boxW, boxH);
    this.drawText(boxX, boxY, boxW, boxH);
  }

  drawEdgeHint(cat) {
    if (!this.interactBtnImg) return;
    const floatOffset = sin(millis() / 400) * 6;
    const hitbox = cat.getHitbox();
    const leftEdge = hitbox.x;
    const rightEdge = hitbox.x + hitbox.w;
    const showLeft = leftEdge <= 30;
    const showRight = rightEdge >= width - 30;
    let hintX;
    const padding = 10;
    if (showLeft) hintX = hitbox.x + hitbox.w + padding;
    else if (showRight) hintX = hitbox.x - padding;
    else hintX = hitbox.x + hitbox.w / 2;
    const hintY = hitbox.y - 100 + floatOffset;
    imageMode(CENTER);
    image(this.interactBtnImg, hintX, hintY, 40, 40);
    imageMode(CORNER);
  }

  calculateBox() {
    textSize(18);
    const padding = 40;
    const textW = textWidth(this.displayText);
    const boxW = constrain(textW + padding, 200, width - 60);
    const boxH = 80;
    const boxX = width / 2 - boxW / 2;
    const boxY = height - boxH - 30;
    return { boxX, boxY, boxW, boxH };
  }

  drawBox(x, y, w, h) {
    fill(255, 245, 210, 230);
    stroke(120);
    strokeWeight(2);
    rect(x, y, w, h, 16);
  }

  drawText(x, y, w, h) {
    noStroke();
    fill(30);
    textAlign(LEFT, TOP);
    textSize(18);
    if (this.speaker) {
      text(this.speaker + ":", x + 20, y + 16);
      text(this.displayText, x + 20, y + 44, w - 30, h - 30);
    } else {
      text(this.displayText, x + 20, y + 32, w - 30, h - 30);
    }
  }
}

// 👉 使用方式：
// const dialogue = new DialogueManager('zh');
// dialogue.preload();
// dialogue.show(["你好"], "系統");
// dialogue.update();
// dialogue.draw();
// dialogue.nextLine();
