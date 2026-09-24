// Sfx.js — 用 WebAudio 合成的 8-bit 音效(不需要音檔):金幣、長大、踩怪、踢殼、受傷、撞磚
const Sfx = (() => {
  let ctx = null;
  const ac = () => {
    if (!ctx) {
      try { ctx = (typeof getAudioContext === 'function') ? getAudioContext() : new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { return null; }
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };
  const tone = (freq, dur, { type = 'square', vol = 0.12, slide = 0, delay = 0 } = {}) => {
    try {
      const c = ac(); if (!c) return;
      const t0 = c.currentTime + delay;
      const o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t0);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t0 + dur);
      g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      // ⚠️ 不能寫 o.connect(g).connect(...):p5.sound 把 AudioNode.connect 改寫成不回傳值,鏈式呼叫會炸掉
      //    (之前這個例外發生在 draw/update 裡,整個遊戲就卡住了)
      o.connect(g); g.connect(c.destination);
      o.start(t0); o.stop(t0 + dur + 0.02);
    } catch (e) { /* 音效失敗絕不影響遊戲 */ }
  };
  const api = {
    unlock() { ac(); },
    coin()  { tone(988, 0.08); tone(1319, 0.4, { delay: 0.08 }); },                                   // B5 → E6(瑪利歐金幣)
    grow()  { [262, 330, 392, 523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.1, { delay: i * 0.055, vol: 0.1 })); },
    shrink(){ [784, 659, 523, 392, 330].forEach((f, i) => tone(f, 0.1, { delay: i * 0.07, vol: 0.1 })); },
    stomp() { tone(320, 0.12, { slide: -240, vol: 0.14 }); tone(100, 0.12, { type: 'triangle', vol: 0.22 }); },
    kick()  { tone(560, 0.09, { slide: -330, vol: 0.12 }); },
    hurt()  { [523, 415, 330, 262].forEach((f, i) => tone(f, 0.14, { delay: i * 0.09, vol: 0.12 })); },
    bump()  { tone(170, 0.08, { type: 'triangle', slide: -70, vol: 0.16 }); },
  };
  // 瀏覽器要有使用者操作後才准出聲:第一次按鍵 / 點擊時解鎖
  for (const ev of ['keydown', 'pointerdown', 'touchstart']) window.addEventListener(ev, () => api.unlock(), { passive: true });
  return api;
})();
