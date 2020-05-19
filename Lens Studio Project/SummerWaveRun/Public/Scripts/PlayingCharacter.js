//@input Component.ScriptComponent worldController


//@input float speed = 1.0 {"widget":"slider", "min":1.0, "max":30.0}
if(!script.worldController )
{ throw new Error("One or more fields aren't set."); return; }  // Check to prevent Studio lens failure to let you set null fields when in error

var screenTransf = script.getSceneObject().getTransform();
//var imageComp = 
var facingDirection = -1; // starts facing left

var initialPos;

var markedForPositionReset = false; // because it has to be done in Update

var event = script.createEvent("TurnOnEvent");
event.bind(function (eventData)
{
  initialPos = screenTransf.getLocalPosition();
});



/// UPDATE
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(function(eventData) {
      

  var pos = screenTransf.getLocalPosition();

  // reset position to center
  if(markedForPositionReset)
  {
    markedForPositionReset = false;
    pos = initialPos;
    screenTransf.position = pos;
    return;
  }

  var tiltUp = script.worldController.api.GetHeadTiltUp();
  var tiltSide = script.worldController.api.GetHeadTiltSide();

    
  if(tiltSide < -0.05) {
    pos.x -= getDeltaTime() * script.speed * -(tiltSide * 500.0);
    pos.x = Math.max(pos.x, -100.0);
    facingDirection = -1;
   // imageComp.flipX = false;
  }
  else if(tiltSide > 0.05) {
    pos.x += getDeltaTime() * script.speed * (tiltSide * 500.0);
    pos.x = Math.min(pos.x, 100.0);
    facingDirection = 1;
    //imageComp.flipX = true;
  }
  pos.y = initialPos.y + 3 *  Math.sin(getTime()*4); // wavy oscillation
    
  
    
  screenTransf.setLocalPosition(pos);
});

// --- API ---
script.api.GetFacingDirection = function() {return facingDirection;}

// --- global API ---
global.HidePlayingCharacter = function() {
  imageComp.enabled = false;
}
global.ShowPlayingCharacter = function(_positionReset) {
  imageComp.enabled = true;
  markedForPositionReset = _positionReset; // mark for position reset in Update
}
