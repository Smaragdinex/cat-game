// InputManager.js

function handleKeyPressed(game, keyCode) {
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
      if (nearNpc.dialogKey === "homeless") {
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
