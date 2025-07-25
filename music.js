let bgmMusic;
let sfxDoorOpen;
let __GAME_VOL = 1;
let sceneMusic = {};

function preloadMusic() {
  
  bgmMusic = loadSound('data/Sound/backgroundSound.mp3'); 
  sfxDoorOpen = loadSound('data/Sound/openSound.mp3');
  
  sceneMusic["train"] = loadSound("data/Sound/backgroundSound.mp3");  
  sceneMusic["minigame"] = loadSound("data/minigame/minigameBgm.mp3"); 
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
  }
}

function playDoorSfx() {
  if (sfxDoorOpen) 
    {
      sfxDoorOpen.setVolume(__GAME_VOL);
      sfxDoorOpen.play();     
    }
}

function setVolume(vol) {
  __GAME_VOL = constrain(vol, 0, 1);
  if (bgmMusic) bgmMusic.setVolume(__GAME_VOL);
  if (sfxDoorOpen) sfxDoorOpen.setVolume(__GAME_VOL);
}

function getVolume() {
  return __GAME_VOL;
}
