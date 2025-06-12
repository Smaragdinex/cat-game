let bgmMusic = null;
let sfxClick = null;
let __GAME_VOL = 1;

function preloadMusic() {
  bgmMusic = loadSound('data/Sound/backgroundSound.mp3');
  sfxClick = loadSound('data/Sound/openSound.mp3');
}

function playBgm(input, loop = true) {
  let newSound = input;

  // ✅ 支援傳入 string key，例如 "train"
  if (typeof input === 'string' && sceneMusic && sceneMusic[input]) {
    newSound = sceneMusic[input];
  }

  if (!newSound) return;

  if (bgmMusic && bgmMusic.isPlaying()) {
    bgmMusic.stop();
  }

  bgmMusic = newSound;
  bgmMusic.setLoop(loop);
  bgmMusic.setVolume(__GAME_VOL);
  bgmMusic.play();
}

function stopBgm() {
  if (bgmMusic && bgmMusic.isPlaying()) {
    bgmMusic.stop();
    bgmMusic = null;
  }
}

function playClickSfx() {
  if (sfxClick) {
    sfxClick.setVolume(__GAME_VOL);
    sfxClick.play();
  }
}

function setVolume(vol) {
  __GAME_VOL = constrain(vol, 0, 1);
  if (bgmMusic) bgmMusic.setVolume(__GAME_VOL);
  if (sfxClick) sfxClick.setVolume(__GAME_VOL);
}

function getVolume() {
  return __GAME_VOL;
}
