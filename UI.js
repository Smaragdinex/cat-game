class GameUI {
  constructor(game, font) {
    this.game = game;
    this.loading = true;
    this.loadingStart = millis();
    this.minLoadingTime = 1000;
    this.font = font
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
    
    textFont(this.font);
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
    textFont(this.font);
    
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
  
  handleClick(mx, my) {
    const game = this.game;

    if (game.activePanel === 'control') {
      if (mx >= width / 2 - 40 && mx <= width / 2 + 40 &&
          my >= height / 2 + 60 && my <= height / 2 + 90) {
        game.activePanel = null;
      }
      return;
    }

    if (game.activePanel === 'language') {
      if (mx >= width / 2 - 100 && mx <= width / 2 - 20 && my >= height / 2 - 20 && my <= height / 2 + 10) {
        game.currentLang = 'zh';
        game.activePanel = null;
      }
      if (mx >= width / 2 + 20 && mx <= width / 2 + 100 && my >= height / 2 - 20 && my <= height / 2 + 10) {
        game.currentLang = 'en';
        game.activePanel = null;
      }
      if (mx >= width / 2 - 40 && mx <= width / 2 + 40 && my >= height / 2 + 40 && my <= height / 2 + 70) {
        game.activePanel = null;
      }
      return;
    }

    if (game.activePanel === 'volume') {
      let volBarX = width / 2 - 100;
      let volBarY = height / 2 - 10;
      let volBarW = 200;
      let volBarH = 20;
      if (mx >= volBarX && mx <= volBarX + volBarW &&
          my >= volBarY && my <= volBarY + volBarH) {
        let v = (mx - volBarX) / volBarW;
        setVolume(constrain(v, 0, 1));
      }
      if (mx >= width / 2 - 40 && mx <= width / 2 + 40 &&
          my >= height / 2 + 40 && my <= height / 2 + 70) {
        game.activePanel = null;
      }
      return;
    }

    if (game.showMenu) {
      if (mx >= width - 200 && mx <= width - 20) {
        if (my >= 60 && my <= 90) {
          game.activePanel = 'control';
          game.showMenu = false;
        } else if (my >= 100 && my <= 130) {
          game.activePanel = 'language';
          game.showMenu = false;
        } else if (my >= 140 && my <= 170) {
          game.activePanel = 'volume';
          game.showMenu = false;
        }
      } else {
        game.showMenu = false;
      }
      return;
    }

    if (dist(mx, my, game.gearX + game.gearSize / 2, game.gearY + game.gearSize / 2) < game.gearSize / 2) {
      game.showMenu = true;
    }
  }

}
