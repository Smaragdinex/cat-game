// ✅ 裝飾物（純顯示用）
   decorationsData = [
    { type: "hill", x: 10, y: 308 },
    { type: "bush", x: 352, y: 368 },
    { type: "bush", x: 384, y: 368 },
    { type: "bush", x: 416, y: 368 },
    { type: "hill", x: 448, y: 338 },
    { type: "cloud", x: 600, y: 50 },
    { type: "bush", x: 736, y: 368 },

    { type: "cloud", x: 1000, y: 100 },
    { type: "cloud", x: 1050, y: 100 },
    { type: "cloud", x: 1100, y: 100 },

    { type: "cloud", x: 1350, y: 50 },
    { type: "cloud", x: 1400, y: 50 },

    { type: "bush", x: 1504, y: 368 },
    { type: "bush", x: 1536, y: 368 },

    { type: "hill", x: 1696, y: 308 },

    { type: "bush", x: 2048, y: 368 },
    { type: "bush", x: 2080, y: 368 },
    { type: "bush", x: 2112, y: 368 },

    { type: "cloud", x: 1952, y: 100 },

    { type: "hill", x: 2144, y: 338 },
    { type: "cloud", x: 2272, y: 50 },
    { type: "bush", x: 2400, y: 368 },

    { type: "cloud", x: 2560, y: 100 },
    { type: "cloud", x: 2592, y: 100 },
    { type: "cloud", x: 2624, y: 100 },

    { type: "cloud", x: 2848, y: 50 },
    { type: "cloud", x: 2880, y: 50 },

    { type: "bush", x: 2976, y: 368 },
    { type: "bush", x: 3008, y: 368 },

    { type: "hill", x: 3168, y: 308 },

    { type: "cloud", x: 3424, y: 100 },

    { type: "bush", x: 3552, y: 368 },
    { type: "bush", x: 3584, y: 368 },
    { type: "bush", x: 3616, y: 368 },
    { type: "hill", x: 3648, y: 338 },
    { type: "cloud", x: 3776, y: 50 },

    { type: "bush", x: 3904, y: 368 },

    { type: "cloud", x: 4064, y: 100 },
    { type: "cloud", x: 4096, y: 100 },
    { type: "cloud", x: 4128, y: 100 },

    { type: "cloud", x: 4352, y: 50 },
    { type: "cloud", x: 4384, y: 50 },

    { type: "bush", x: 4502, y: 368 },
    { type: "bush", x: 4534, y: 368 },

    { type: "hill", x: 4682, y: 308 },

    { type: "cloud", x: 4992, y: 100 },

    { type: "hill", x: 5184, y: 338 },

    { type: "cloud", x: 5344, y: 50 },
    { type: "bush", x: 5472, y: 368 },

    { type: "cloud", x: 5600, y: 100 },
    { type: "cloud", x: 5632, y: 100 },
    { type: "cloud", x: 5664, y: 100 },

    { type: "cloud", x: 5920, y: 50 },
    { type: "cloud", x: 5952, y: 50 },

    { type: "hill", x: 6240, y: 308 },

    { type: "cloud", x: 6528, y: 100 },
    { type: "hill", x: 6752, y: 338 },
  ];


class Decoration {
  constructor(type,x, y, spritesheet, sx, sy, sw, sh, dw = sw, dh = sh) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.sheet = spritesheet;
    this.sx = sx;
    this.sy = sy;
    this.sw = sw;
    this.sh = sh;
    this.dw = dw;
    this.dh = dh;
    if (this.type === "cloud") {
      this.vx = -0.3; // 每幀向左移動（你可以調整速度）
    }

  }
  
  update() {
    if (this.type === "cloud") {
      this.x += this.vx;

      // 如果完全離開畫面左側，就回到最右邊
      if (this.x + this.dw < miniGameManager.cameraOffsetX - 100) {
        this.x = miniGameManager.cameraOffsetX + width + random(100, 500);
      }
    }
  }


  display(offsetX = 0) {
    image(
      this.sheet,
      this.x - offsetX, this.y, this.dw, this.dh,
      this.sx, this.sy, this.sw, this.sh
    );
  }
}
