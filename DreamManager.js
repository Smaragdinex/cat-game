// DreamManager.js

function triggerSleepUnlock(game) {
  
  const scene = sceneManager.getCurrentScene();
  if (!scene.canEnterDream) return;
  
  if (game.sleepUnlockTriggered || !game.cat.isSleeping) return;

  const sleepDuration = millis() - game.cat.sleepStartTime;

  if (sleepDuration > 12000 && !game.sleepMessageShown) {
    // 顯示訊息
    showDialog(
      langText[game.currentLang].dialog_dream, // e.g. "你似乎做了一個夢..."
      langText[game.currentLang].system,       // e.g. "系統"
      3000
    );
    game.sleepMessageShown = true;
    game.sleepMessageTime = millis();
    
    const currentIndex = sceneManager.currentIndex;
    const dreamRoute = {
      0: 1,
      3: 6,
      8: 9 // 可擴充
    };

    const targetScene = dreamRoute[currentIndex];
    if (targetScene === undefined) return; // 若無設定，避免跳錯
    // 同時開始轉場動畫
    transition.start(() => {
      game.cat.lastWakeTime = millis();  // ⏱ 記錄醒來時間
      scene.entryMap.right.to = targetScene;
      sceneManager.transition("right", game.cat, { silent: true });

      game.cat.x = 200;
      game.cat.isSleeping = false;
      game.cat.isSitting = true;
      game.cat.isSittingDown = false;
      game.cat.sitFrameIndex = game.cat.animations[`sit-${game.cat.direction}`].length - 1;

    });
  }
}

function wakeFromDream(game) {
  const currentIndex = sceneManager.currentIndex;

  const dreamWakeMap = {
    3: 2,
    2: 1,
    1: 0
  };

  const targetScene = dreamWakeMap[currentIndex];
  if (targetScene === undefined) return; // 如果不能醒，就不做事

  transition.start(() => {
    sceneManager.scenes[currentIndex].entryMap.left.to = targetScene;
    sceneManager.transition("left", game.cat, { silent: true });

    game.cat.x = 150; // 回到指定位置
    game.cat.isSitting = true;
    game.cat.isSleeping = false;
    game.cat.isSittingDown = false;
    game.cat.sitFrameIndex = game.cat.animations[`sit-${game.cat.direction}`].length - 1;

    game.sleepUnlockTriggered = false;
    game.sleepMessageShown = false;
  });
}

