/**
 * Block - 磚塊物件，同時對應碰撞平台（包含地磚）
 */
class Block {
  constructor(x, y, type, sheet, sx, sy, sw = 16, sh = 16, scale = 2) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.sheet = sheet;
    this.sx = sx;
    this.sy = sy;
    this.scale = scale;

    // ✅ 圖片來源尺寸
    this.sourceW = sw;
    this.sourceH = sh;

    // ✅ 顯示尺寸（已放大）
    this.w = sw * scale;
    this.h = sh * scale;

    // ✅ ground 也算有碰撞
    this.hasCollision = ["brick", "hard", "mystery", "empty", "ground"].includes(this.type);

    // ✅ 若有碰撞，自動建立對應 Platform
    this.platform = this.hasCollision ? new Platform(this.x, this.y, this.w, this.h) : null;
  }

  /**
   * 回傳對應的 Platform（若有）
   */
  getPlatform() {
    return this.platform;
  }

  display() {
    if (this.sheet) {
      image(
        this.sheet,
        this.x, this.y,                 // ✅ 用世界座標，因為 draw() 已經 translate
        this.w, this.h,
        this.sx, this.sy, this.sourceW, this.sourceH
      );
    }
  }



}
