//@input Component.Text scoreText
//@input Component.Text bestScoreText
//@input SceneObject[] glassesObjects
//@input Component.Image glassesPreviewImage
//@input Asset.Texture[] glassesPreviewTextures
//@input SceneObject glassesSelectorParent
//@input SceneObject glassesSelectorButtonNext
//@input SceneObject glassesSelectorButtonPrev
//@input Component.Text unlockedText
//@input Component.Text newBestText

// TOUCH BLOCKING // https://lensstudio.snapchat.com/guides/scripting/touch-input/
global.touchSystem.touchBlocking = true;
//global.touchSystem.enableTouchBlockingException("TouchTypeSwipe", true);

var currentGlasses = 0;

var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind(function (eventData)
{
  if(script.glassesObjects.length < 5)
    print("PROBLEM..!");

  JumpToBestAvailableGlasses();
  //script.glassesPreviewImage.mainPass.baseTex = script.glassesPreviewTextures[currentGlasses];
  SetUnlockText();
  // for(var i=0; i<50; i++)
  // {
  //   print(i + ": " + Math.floor((5 - Math.floor(i/35)*5 + i) / 10));
  // }
});

global.UpdateScoreUI = function()
{
    script.scoreText.text = GetScore().toString();
    script.bestScoreText.text = GetBestScore().toString();
}

function GetBestAvailableGlassesIndex()
{
  var bestS = GetBestScore();
  var glassesIndex = Math.min(Math.floor((5 - Math.floor(bestS/35)*5 + bestS) / 10), script.glassesObjects.length -1);
  return glassesIndex;
}

// _index must correspond to the index in Lens Studio inspector in the glasses variable.
function ActivateGlassesIfAvailable(_index) {
  var bestAvailable = GetBestAvailableGlassesIndex();
  if(_index <= bestAvailable)
  {
    for(var i=0; i<script.glassesObjects.length; i++)
    {
        script.glassesObjects[i].enabled = (i == _index);
    }
    return true;
  }
  return false;
}

// API
script.api.NextGlasses = function() {
  currentGlasses += 1;
  currentGlasses = Math.min(currentGlasses, script.glassesObjects.length-1);
  SetSelectedGlasses(currentGlasses);
  SetUnlockText();
  ActivateGlassesIfAvailable(currentGlasses);
}

script.api.PreviousGlasses = function() {
  if(currentGlasses > 0)
  {
    currentGlasses -= 1;
    currentGlasses = Math.max(currentGlasses, 0);
    SetSelectedGlasses(currentGlasses);
    SetUnlockText();
    ActivateGlassesIfAvailable(currentGlasses);
  }
}

function JumpToBestAvailableGlasses()
{
  currentGlasses = GetBestAvailableGlassesIndex();
  ActivateGlassesIfAvailable(currentGlasses);
  SetSelectedGlasses(currentGlasses);
}

// Sets the selected glasses in the glasses Selector
function SetSelectedGlasses(_index)
{
  script.glassesPreviewImage.mainPass.baseTex = script.glassesPreviewTextures[_index];
  if(_index == 0) {
    script.glassesSelectorButtonPrev.enabled = false;
  }
  else if(_index == script.glassesObjects.length-1) { // last glasses
    script.glassesSelectorButtonNext.enabled = false;
  }
  else {
    script.glassesSelectorButtonPrev.enabled = true;
    script.glassesSelectorButtonNext.enabled = true;
  }

}

function SetUnlockText()
{
  if(currentGlasses == 0 || currentGlasses <= GetBestAvailableGlassesIndex())
    script.unlockedText.text = "";
  else
    script.unlockedText.text = "UNLOCKED\nAT " + (currentGlasses * 10 - 5 + Math.floor(currentGlasses/4) * 5);
}

global.ShowGlassesSelector = function()
{
  script.glassesSelectorParent.enabled = true;
  if(GetBestAvailableGlassesIndex() > currentGlasses && GetScore() > GetBestScore())
  {
    JumpToBestAvailableGlasses();
  }
}
global.HideGlassesSelector = function()
{
  script.glassesSelectorParent.enabled = false;
}

global.ShowNewBestText = function() {
  script.newBestText.getSceneObject().enabled = true;
}
global.HideNewBestText = function() {
  script.newBestText.getSceneObject().enabled = false;
}
