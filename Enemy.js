// Enemy.js — 小遊戲敵人:香菇(goomba)與烏龜(koopa)
// 精靈圖 data/minigame/enemies.png:每格 32×32(1x 像素),場景磚塊是 32px(2x),所以畫成 64×64
// 格子:0,1 香菇走路、2 香菇被踩扁、3,4 烏龜走路(圖朝左)、5 龜殼
let enemySheet;

class Enemy {
  constructor(type, x) {
    this.type = type;                     // 'goomba' | 'koopa'
    this.x = x;
    this.w = 32;
    this.h = type === 'koopa' ? 50 : 34;  // 依精靈實際高度(×2)
    this.y = 400 - this.h;                // 站在地面(地面磚 y=400)
    this.vx = -1.0;                       // 一開始往左走
    this.vy = 0;
    this.state = 'walk';                  // walk | squashed | shell | flying(被殼撞飛)
    this.shellVx = 0;                     // 龜殼被踢的速度(0 = 靜止)
    this.kickCooldown = 0;                // 剛踢出去的幾幀內不會反過來傷到貓
    this.frame = 0;
    this.timer = 0;
    this.dead = false;                    // true = 從場上移除
  }

  get hitbox() { return { x: this.x + 4, y: this.y + 2, w: this.w - 8, h: this.h - 2 }; }

  // 改變狀態時保持腳底位置不變
  setHeight(h) { const bottom = this.y + this.h; this.h = h; this.y = bottom - h; }

  stomp() {
    if (this.type === 'goomba') { this.state = 'squashed'; this.setHeight(18); this.timer = 0; }
    else { this.state = 'shell'; this.setHeight(30); this.shellVx = 0; }
  }

  kick(dir) { this.shellVx = 6 * dir; this.kickCooldown = 12; }

  hitByShell() { this.state = 'flying'; this.vy = -8; this.vx = 0; }

  update(solids) {
    if (this.dead) return;
    this.frame++;
    if (this.kickCooldown > 0) this.kickCooldown--;

    if (this.state === 'squashed') { if (++this.timer > 30) this.dead = true; return; }
    if (this.state === 'flying') { this.vy += 0.6; this.y += this.vy; if (this.y > 800) this.dead = true; return; }

    // 水平移動;撞到方塊側面就反向
    const vx = this.state === 'shell' ? this.shellVx : this.vx;
    this.x += vx;
    if (this.x < 0) { this.x = 0; this.reverse(); }
    for (const b of solids) {
      if (b.broken) continue;
      const overlap = this.x < b.x + b.w && this.x + this.w > b.x && this.y + this.h > b.y + 6 && this.y < b.y + b.h;
      if (overlap) {
        this.x = vx > 0 ? b.x - this.w : b.x + b.w;
        this.reverse();
        break;
      }
    }

    // 重力 + 落在方塊上
    this.vy += 1; this.y += this.vy;
    let onGround = false;
    for (const b of solids) {
      if (b.broken) continue;
      const feet = this.y + this.h;
      if (this.x + this.w - 6 > b.x && this.x + 6 < b.x + b.w && feet >= b.y && feet - this.vy <= b.y + 1) {
        this.y = b.y - this.h; this.vy = 0; onGround = true;
      }
    }
    if (this.y > 800) this.dead = true;   // 掉進洞

    // 走路狀態走到平台邊緣就回頭(龜殼不回頭,直接飛出去)
    if (onGround && this.state === 'walk') {
      const aheadX = this.vx > 0 ? this.x + this.w + 2 : this.x - 2;
      const feet = this.y + this.h + 2;
      const hasGround = solids.some(b => !b.broken && aheadX >= b.x && aheadX <= b.x + b.w && feet >= b.y && feet <= b.y + b.h);
      if (!hasGround) this.vx = -this.vx;
    }
  }

  reverse() { if (this.state === 'shell') this.shellVx = -this.shellVx; else this.vx = -this.vx; }

  display() {
    if (this.dead || !enemySheet) return;
    let cell;
    if (this.type === 'goomba') cell = this.state === 'squashed' ? 2 : Math.floor(this.frame / 10) % 2;
    else if (this.state === 'walk') cell = 3 + Math.floor(this.frame / 10) % 2;
    else cell = 5;
    const cx = this.x + this.w / 2, cy = this.y + this.h / 2;
    push();
    if (this.state === 'flying') { translate(cx, cy); scale(1, -1); translate(-cx, -cy); }          // 被撞飛:上下顛倒
    else if (this.state === 'walk' && this.vx > 0) { translate(cx, 0); scale(-1, 1); translate(-cx, 0); }   // 圖朝左,往右走時翻轉
    image(enemySheet, this.x - 16, this.y + this.h - 64, 64, 64, cell * 32, 0, 32, 32);
    pop();
  }
}

// 食人花:住在水管裡,週期性探出來再縮回去;貓站在水管附近時不會出來(瑪利歐規則)。不能踩,碰到就受傷,龜殼可以打掉
// 精靈格 7、8(嘴巴開/合),原圖 20×26 → 畫成 2x
class Piranha {
  constructor(pipeX, pipeTopY) {
    this.type = 'piranha';
    this.w = 40; this.h = 52;
    this.x = pipeX + 32 - this.w / 2;       // 水管寬 64,置中
    this.topY = pipeTopY - this.h;          // 完全探出來時的 y
    this.hideY = pipeTopY + 4;              // 完全躲進去時的 y(被水管蓋住)
    this.y = this.hideY;
    this.state = 'hidden';                  // hidden | rising | out | sinking | flying
    this.timer = 90 + Math.floor(Math.random() * 60);   // 各水管錯開
    this.frame = 0; this.vy = 0; this.dead = false;
    this.shellVx = 0; this.kickCooldown = 0;
    this.catNear = false;
  }

  get hitbox() { return { x: this.x + 6, y: this.y + 6, w: this.w - 12, h: this.h - 6 }; }
  get isOut() { return this.state !== 'hidden' && this.y < this.hideY - 12; }

  hitByShell() { this.state = 'flying'; this.vy = -8; }

  update(solids, cat) {
    if (this.dead) return;
    this.frame++;
    if (this.state === 'flying') { this.vy += 0.6; this.y += this.vy; if (this.y > 800) this.dead = true; return; }

    // 貓在水管正上方附近(左右 80px 內)就不探頭
    const catCx = cat ? cat.hitbox.x + cat.hitbox.w / 2 : -9999;
    this.catNear = Math.abs(catCx - (this.x + this.w / 2)) < 80;

    const RISE = 1.2;
    switch (this.state) {
      case 'hidden':
        if (--this.timer <= 0 && !this.catNear) this.state = 'rising';
        break;
      case 'rising':
        this.y -= RISE;
        if (this.y <= this.topY) { this.y = this.topY; this.state = 'out'; this.timer = 90; }
        break;
      case 'out':
        if (--this.timer <= 0) this.state = 'sinking';
        break;
      case 'sinking':
        this.y += RISE;
        if (this.y >= this.hideY) { this.y = this.hideY; this.state = 'hidden'; this.timer = 120; }
        break;
    }
  }

  display() {
    if (this.dead || !enemySheet) return;
    const cell = 7 + Math.floor(this.frame / 12) % 2;   // 嘴巴開合
    const cx = this.x + this.w / 2, cy = this.y + this.h / 2;
    push();
    if (this.state === 'flying') { translate(cx, cy); scale(1, -1); translate(-cx, -cy); }
    image(enemySheet, this.x - 12, this.y + this.h - 64, 64, 64, cell * 32, 0, 32, 32);
    pop();
  }
}
