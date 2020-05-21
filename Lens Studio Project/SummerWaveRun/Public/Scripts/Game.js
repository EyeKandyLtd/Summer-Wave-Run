// Script responsible for all the methods to create the User's Game Flow

//@input SceneObject PlayButton
//@input SceneObject ReplayButton
//@input SceneObject ball

var firstPlay = true;

global.gameName = "Summer Fun";

global.GAMESTATE = {PLAYING:1, PAUSED:2, GAMEOVER:3};
global.gameState = GAMESTATE.PAUSED;

global.PauseGame = function() {
    global.gameState = global.GAMESTATE.PAUSED;
}
global.UnPauseGame = function() {
  global.gameState = global.GAMESTATE.PLAYING;
}

global.StartGame = function() {
  script.PlayButton.enabled = false; // not working
  script.ReplayButton.enabled = false;
  var ballscript = script.ball.getFirstComponent("ScriptComponent");
  ballscript.api.Reset();
  ResetScore();
  UnPauseGame();
  HideGlassesSelector();
  HideNewBestText();
  ShowPlayingCharacter(!firstPlay);
  firstPlay = false;
}
global.GameOver = function() {
  script.ReplayButton.enabled = true;
  PauseGame();
  SaveBestScore();
  ShowGlassesSelector();
  HidePlayingCharacter();

}
