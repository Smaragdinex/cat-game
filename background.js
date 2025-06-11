// 物件形式（推薦）——如果每關還有不同前景、地板、物件可一併管理
let backgrounds = [];
let currentBgIndex = 0;

function preloadBackgroundImages() {
  // 多背景載入
  backgrounds.push({
    bg: loadImage('data/background/background.png'),
    name: "default"
  });
  backgrounds.push({
    bg: loadImage('data/background/train.png'),
    name: "train"
  });
  backgrounds.push({
    bg: loadImage('data/background/train1.png'),
    name: "train1"
  });
  backgrounds.push({
    bg: loadImage('data/background/web1.png'),
    name: "web1"
  });
  backgrounds.push({
    bg: loadImage('data/background/web2.png'),
    name: "web2"
  });
  backgrounds.push({
    bg: loadImage('data/background/web3.png'),
    name: "web3"
  });
  // ...如果每關還有其他物件也可放進這個物件
}

function drawBackground() {
  if (backgrounds[currentBgIndex] && backgrounds[currentBgIndex].bg) {
    image(backgrounds[currentBgIndex].bg, 0, 0, width, height);
  }
  // 你也可以根據每關資料結構畫不同欄杆、前景等
}

function nextScene() {
  currentBgIndex = (currentBgIndex + 1) % backgrounds.length;
}

function prevScene() {
  currentBgIndex = (currentBgIndex - 1 + backgrounds.length) % backgrounds.length;
}
