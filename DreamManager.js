// DreamManager.js

function triggerSleepUnlock(game) {
  if (sceneManager.currentIndex !== 0) return; // 只有場景 0 會觸發
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

    // 同時開始轉場動畫
    transition.start(() => {
      game.cat.lastWakeTime = millis();  // ⏱ 記錄醒來時間
      sceneManager.scenes[sceneManager.currentIndex].entryMap.right.to = 1;
      sceneManager.transition("right", game.cat, { silent: true });

      game.cat.x = 200;
      game.cat.isSleeping = false;
      game.cat.isSitting = true;
      game.cat.isSittingDown = false;
      game.cat.sitFrameIndex = game.cat.animations[`sit-${game.cat.direction}`].length - 1;

      game.sleepUnlockTriggered = true;
    });
  }
}
