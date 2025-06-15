class GameUI {
  constructor(game) {
    this.game = game;
    this.loading = true;
    this.loadingStart = millis();
    this.minLoadingTime = 1000;
  }

  drawTopButtons() {
    image(
      gearIcon,
      this.game.gearX,
      this.game.gearY,
      this.game.gearSize,
      this.game.gearSize
    );
  }

  drawPanels() {
    this.drawMenu();
    this.drawPanel();
  }

  drawMenu() {
    if (!this.game.showMenu) return;

    fill(255, 255, 255, 220);
    noStroke();
    rect(width - 200, 50, 180, 140, 10);

    fill(0);
    textSize(16);
    textAlign(LEFT, TOP);
    text(langText[this.game.currentLang].btn_control, width - 180, 70);
    text(langText[this.game.currentLang].btn_lang, width - 180, 110);
    text(langText[this.game.currentLang].btn_volume, width - 180, 150);
  }

  drawPanel() {
    const active = this.game.activePanel;
    const lang = langText[this.game.currentLang];

    if (active === 'control') {
      fill(255, 255, 255, 220);
      noStroke();
      rect(width / 2 - 160, height / 2 - 100, 320, 200, 12);
      fill(0);
      textAlign(CENTER, TOP);
      textSize(16);
      text(lang.control, width / 2, height / 2 - 80);

      fill(200);
      rect(width / 2 - 40, height / 2 + 60, 80, 30, 8);
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(14);
      text(lang.btn_close, width / 2, height / 2 + 75);
    }

    if (active === 'language') {
      fill(255, 255, 255, 220);
      noStroke();
      rect(width / 2 - 160, height / 2 - 80, 320, 160, 12);
      fill(0);
      textAlign(CENTER, TOP);
      textSize(16);
      text(lang.language, width / 2, height / 2 - 70);

      fill(200);
      rect(width / 2 - 100, height / 2 - 20, 80, 30, 8);
      rect(width / 2 + 20, height / 2 - 20, 80, 30, 8);
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(14);
      text(lang.btn_zh, width / 2 - 60, height / 2 - 5);
      text(lang.btn_en, width / 2 + 60, height / 2 - 5);

      fill(200);
      rect(width / 2 - 40, height / 2 + 40, 80, 30, 8);
      fill(0);
      text(lang.btn_close, width / 2, height / 2 + 55);
    }

    if (active === 'volume') {
      fill(255, 255, 255, 220);
      noStroke();
      rect(width / 2 - 160, height / 2 - 80, 320, 160, 12);
      fill(0);
      textAlign(CENTER, TOP);
      textSize(16);
      text(lang.btn_volume, width / 2, height / 2 - 65);

      let volBarX = width / 2 - 100;
      let volBarY = height / 2 - 10;
      let volBarW = 200;
      let volBarH = 20;
      fill(180);
      rect(volBarX, volBarY, volBarW, volBarH, 8);

      fill(0, 150, 255);
      rect(volBarX, volBarY, volBarW * getVolume(), volBarH, 8);

      fill(0);
      textSize(14);
      textAlign(LEFT, CENTER);
      text(Math.round(getVolume() * 100) + "%", volBarX + volBarW + 10, volBarY + volBarH / 2);

      fill(200);
      rect(width / 2 - 40, height / 2 + 40, 80, 30, 8);
      fill(0);
      textAlign(CENTER, CENTER);
      text(lang.btn_close, width / 2, height / 2 + 55);
    }
  }

  drawTouchControls() {
    drawTouchButtons(); // 你原本的虛擬控制函式
  }
  
   drawLoading() {
    if (!this.loading) return;

    const elapsed = millis() - this.loadingStart;
    if (elapsed > this.minLoadingTime) {
      this.loading = false;
      return;
    }

    push();
    fill(0, 180);
    rect(0, 0, width, height);

    // 繪製轉圈圈動畫
    const angle = (millis() / 300) % TWO_PI;
    translate(width / 2, height / 2);
    stroke(255);
    strokeWeight(4);
    noFill();
    arc(0, 0, 60, 60, angle, angle + PI + QUARTER_PI);

    // 文字
    noStroke();
    fill(255);
    textAlign(CENTER, TOP);
    textSize(16);
    text("Loading...", 0, 40);
    pop();
  }
  
  
}
