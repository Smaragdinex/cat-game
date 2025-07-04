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
    this.choiceIconImg = null;

    // ✨ 新增選項相關狀態
    this.choiceVisible = false;
    this.choices = [];
    this.choiceKey = "";
    this.selectedIndex = 0;
    this.onChoice = null;
  }

  preload() {
    this.interactBtnImg = loadImage('data/Icon/x.png');
    this.choiceIconImg = loadImage('data/Icon/right.png');

  }

  show(lines, speaker = "", duration = 0, onChoice = null) {
    this.speaker = speaker;
    this.active = true;
    this.timer = millis();
    this.duration = duration;
    this.charIndex = 0;
    this.currentLine = 0;
    this.displayText = "";
    this.lines = Array.isArray(lines) ? lines : [lines];
    this.onChoice = onChoice;
    this.choiceVisible = false;
  }

  hide() {
    this.active = false;
    this.lines = [];
    this.displayText = "";
    this.currentLine = 0;
    this.choiceVisible = false;
    this.isLocked = false;
  }

  update() {
    if (!this.active || this.choiceVisible) return;
    const fullText = this.lines[this.currentLine];
    if (typeof fullText !== "string") return;
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
    if (!this.active) return;

    const current = this.lines[this.currentLine];

    // 🔁 1. 還在跑字 → 先完整顯示
    if (typeof current === "string" && this.charIndex < current.length) {
      this.charIndex = current.length;
      this.displayText = current;
      return;
    }

    // 🔁 2. 進入下一行
    this.currentLine++;

    // 🛑 3. 如果已經結束，關閉對話
    if (this.currentLine >= this.lines.length) {
      this.hide();
      return;
    }

    const next = this.lines[this.currentLine];

    // ✅ 4. 如果下一行是選項 → 立即切入選項，不多顯示一行空框
    if (typeof next === "object" && next.choices) {
      this.choiceVisible = true;
      this.choices = next.choices;
      this.choiceKey = next.key || "";
      this.selectedIndex = 0;
      return;
    }

    // 🔁 5. 正常進入下一句對話
    this.charIndex = 0;
    this.displayText = "";
    this.timer = millis();
  }

  moveChoiceUp() {
    if (!this.choiceVisible) return;
    this.selectedIndex = (this.selectedIndex - 1 + this.choices.length) % this.choices.length;
  }
  
  moveChoiceDown() {
    if (!this.choiceVisible) return;
    this.selectedIndex = (this.selectedIndex + 1) % this.choices.length;
  }

  handleChoiceKey(keyCode) {
    if (!this.choiceVisible) return false;

    if (keyCode === UP_ARROW) {
      this.selectedIndex = (this.selectedIndex - 1 + this.choices.length) % this.choices.length;
    } else if (keyCode === DOWN_ARROW) {
      this.selectedIndex = (this.selectedIndex + 1) % this.choices.length;
    } else if (keyCode === 88) { // X 確認選擇
      const selected = this.choices[this.selectedIndex];
      if (this.onChoice && this.choiceKey) {
        this.onChoice(this.choiceKey, selected);
      }
      this.choiceVisible = false;
      this.nextLine(); // 繼續下一句
    }
    return true; // 阻擋 Game.js 處理 X
  }

  draw() {
    if (!this.active) return;

    const { boxX, boxY, boxW, boxH } = this.calculateBox();
    
    if (this.choiceVisible) {
      this.drawBox(boxX, boxY, boxW, boxH); 
      this.drawChoices(boxX, boxY, boxW, boxH);
    } else {
      const currentLine = this.lines[this.currentLine];
    if (typeof currentLine === "string") {
        this.drawBox(boxX, boxY, boxW, boxH);
        this.drawText(boxX, boxY, boxW, boxH);
      }
    }
  }

  drawChoices(x, y, w, h) {
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(18);
    const spacing = 30;              // 每個選項的垂直距離
    const startY = y + 28;           // 從對話框內偏移開始
    const startX = x + 20;           // 左邊內距

    for (let i = 0; i < this.choices.length; i++) {
      const cy = startY + i * spacing;
      
     if (i === this.selectedIndex && this.choiceIconImg) {
        imageMode(CENTER);
        image(this.choiceIconImg, startX - 10, cy, 16, 16); // ✅ 顯示圖示
        imageMode(CORNER);
      }

      fill(30);
      text(this.choices[i], startX + 10, cy); // 稍微往右讓位給圖示
      
    }
    

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
    const currentLine = this.lines[this.currentLine];
    if (typeof currentLine !== "string") return;
    
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
