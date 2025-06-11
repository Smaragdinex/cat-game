let bgmMusic;   // 背景音樂
let sfxClick;   // 按鈕音效（或更多）

function preloadMusic() {
  bgmMusic = loadSound('data/Sound/backgroundSound.mp3');
  sfxClick = loadSound('data/Sound/openSound.mp3');
  // 可再依需求加入更多音效
}

function playBgm(loop = true) {
  if (bgmMusic && !bgmMusic.isPlaying()) {
    bgmMusic.setLoop(loop);
    bgmMusic.play();
  }
}

function stopBgm() {
  if (bgmMusic && bgmMusic.isPlaying()) {
    bgmMusic.stop();
  }
}

function playClickSfx() {
  if (sfxClick) sfxClick.play();
}

function setVolume(vol) {
  if (bgmMusic) bgmMusic.setVolume(vol);
  if (sfxClick) sfxClick.setVolume(vol);
  // 可批次控制多音效音量
  window.__GAME_VOL = vol; // 給 UI 顯示用
}
function getVolume() {
  return typeof window.__GAME_VOL === "number" ? window.__GAME_VOL : 1;
}

