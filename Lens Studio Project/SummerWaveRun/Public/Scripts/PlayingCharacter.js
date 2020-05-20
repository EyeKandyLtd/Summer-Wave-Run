//@input Component.ScriptComponent worldController


//@input float strafeSpeed = 600.0 {"widget":"slider", "min":50.0, "max":3000.0}
//@input float turnStickiness = 0.03 {"widget":"slider", "min":0.0001, "max":0.99}
//@input float horizonalMovementRange = 100 {"widget":"slider", "min":0, "max":200}
//@input float waveBounceSeconds = 4 {"widget":"slider", "min":0.3, "max":32}


if(!script.worldController )
{ throw new Error("One or more fields aren't set."); return; }  // Check to prevent Studio lens failure to let you set null fields when in error

var screenTransf = script.getSceneObject().getTransform();
//var imageComp = 
var facingDirection = -1; // starts facing left

var initialPos;

var markedForPositionReset = false; // because it has to be done in Update

var halfExtentXMovementRange = script.horizonalMovementRange * 0.5

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

    
    
  if(tiltSide < -script.turnStickiness) {
        print("script.strafeSpeed = " + script.strafeSpeed)
    pos.x -= getDeltaTime() *  -(tiltSide * script.strafeSpeed);
    pos.x = Math.max(pos.x, -halfExtentXMovementRange);
    facingDirection = -1;
   // imageComp.flipX = false;
  }
  else if(tiltSide > script.turnStickiness) {
    pos.x += getDeltaTime() * (tiltSide * script.strafeSpeed);
    pos.x = Math.min(pos.x, halfExtentXMovementRange);
    facingDirection = 1;
    //imageComp.flipX = true;
  }
  pos.y = initialPos.y + 3 *  Math.sin(getTime()*script.waveBounceSeconds); // wavy oscillation
    
  
    
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
