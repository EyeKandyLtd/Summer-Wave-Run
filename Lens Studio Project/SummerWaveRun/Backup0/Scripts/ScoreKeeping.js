// SCORE KEEPING
// https://lensstudio.snapchat.com/api/classes/PersistentStorageSystem/

//@input Component.AudioComponent yayAudio

var storage = global.persistentStorageSystem.store;

var currentScore = 0;
var bestScore = 0;
var score_key = "summer_fun_best_score";

//SetBestScore(0);

global.IncreaseScore = function() {
  currentScore += 1;
  // if(currentScore == bestScore + 1 && currentScore > 9)
  //   script.yayAudio.play(1);
  UpdateScoreUI();
}

global.ResetScore = function()
{
  currentScore = 0;
  UpdateScoreUI();
}

function LoadBestScore()
{
  bestScore = storage.getInt(score_key);
  print("Best score: " + bestScore);
}

var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind(function (eventData)
{
  LoadBestScore();
  UpdateScoreUI();
});

// // _index must correspond to the index in Lens Studio inspector in the glasses variable.
// function ActivateGlasses(_index) {
//   for(var i=0; i<script.glasses.length; i++)
//   {
//       script.glasses[i].enabled = (i == _index);
//   }
// }

global.SaveBestScore = function()
{
  if(currentScore > bestScore) {
    bestScore = currentScore;
    storage.putInt(score_key, bestScore);
    print("Saving best: " + bestScore);

    ShowNewBestText();
    script.yayAudio.play(1);

  }
  else {
    print("No best score.");
  }
}

// for debugging purposes
function SetBestScore(_value)
{
  storage.putInt(score_key, _value);
}

global.GetScore = function()
{
  return currentScore;
}

global.GetBestScore = function()
{
  return bestScore;
}
