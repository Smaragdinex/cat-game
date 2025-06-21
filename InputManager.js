// InputManager.js

function handleKeyPressed(game, keyCode) {
  
  if (keyCode === 67) { // C 鍵
    game.cat.keyPressed(67); //  meow 

    const scene = sceneManager.getCurrentScene();
    const nearNpc = scene?.npcs?.find(n => n.isNear(game.cat) && n.dialogKey === "girl");

    if (nearNpc) {
      game.girlReactedToMeow = true; // ✅ 記得她聽到了
      nearNpc.speak(); // 觸發新對話
      
    }
  }

  if (game.activePanel) return;

  if (keyCode === 88 && game.dialogue.active) {
    game.dialogue.nextLine();
    return;
  }

  if (keyCode === 88) {
    const scene = sceneManager.getCurrentScene();
    const nearNpc = scene.npcs?.find(n => n.isNear(game.cat));
    if (nearNpc) {
      nearNpc.speak();
      game.currentInteractingNpc = nearNpc;
      if (nearNpc.dialogKey === "girl") {
        game.dialogWithSleeperDone = true;
      }
      return;
    }
  }

  if (keyCode === 88 && game.trySceneTransition()) {
    return;
  }

  game.cat.keyPressed(keyCode);
}

function handleKeyReleased(game, keyCode) {
  game.cat.keyReleased(keyCode);
}
