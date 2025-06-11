// 物件形式（推薦）——如果每關還有不同前景、地板、物件可一併管理
let backgrounds = [];
let currentBgIndex = 0;
let railingImg;

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
  railingImg = loadImage('data/background/railing.png');
}

function drawBackground() {
  let bgObj = backgrounds[currentBgIndex];
  if (bgObj && bgObj.bg) {
    let bgOriginalW = 320;
    let bgOriginalH = 180;
    let scale = width / bgOriginalW;
    let bgW = width;
    let bgH = bgOriginalH * scale;
    let bgY = height - bgH;
    image(bgObj.bg, 0, bgY, bgW, bgH);

    if (railingImg) {
      let railingOriginalW = 293;
      let railingOriginalH = 64;
      let railingW = railingOriginalW * scale;
      let railingH = railingOriginalH * scale;
      let railingX = 15 * scale;
      let railingY = bgY + bgH - railingH * 1.77;
      image(railingImg, railingX, railingY, railingW, railingH);
    }
  }
}


function nextScene() {
  currentBgIndex = (currentBgIndex + 1) % backgrounds.length;
}

function prevScene() {
  currentBgIndex = (currentBgIndex - 1 + backgrounds.length) % backgrounds.length;
}
