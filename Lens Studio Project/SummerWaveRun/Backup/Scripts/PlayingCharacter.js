//@input Component.ScriptComponent worldController


//@input float strafeSpeed = 600.0 {"widget":"slider", "min":50.0, "max":3000.0}
//@input float turnStickiness = 0.03 {"widget":"slider", "min":0.0001, "max":0.99}
//@input float horizonalMovementRange = 100 {"widget":"slider", "min":0, "max":200}
//@input float tiltWeight = 3
//@input float tiltMaxDegrees = 0.15 {"widget":"slider", "min":0.02, "max":4}
//@input float waveBounceSeconds = 4 {"widget":"slider", "min":0.3, "max":32}


if(!script.worldController )
{ throw new Error("One or more fields aren't set."); return; }  // Check to prevent Studio lens failure to let you set null fields when in error

var playerTransf = script.getSceneObject().getTransform();
//var imageComp = 
var facingDirection = -1; // starts facing left

var initialPos;
var initialRot;

var markedForPositionReset = false; // because it has to be done in Update

var halfExtentXMovementRange = script.horizonalMovementRange * 0.5

var event = script.createEvent("TurnOnEvent");
event.bind(function (eventData)
{
    initialPos = playerTransf.getLocalPosition();
    initialRot = playerTransf.getLocalRotation();
    
});



/// UPDATE
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(function(eventData) {
      

  var pos = playerTransf.getLocalPosition();
  var rot = playerTransf.getLocalRotation().toEulerAngles();

  // reset position to center
  if(markedForPositionReset)
  {
    markedForPositionReset = false;
    pos = initialPos;
    playerTransf.position = pos;
    return;
  }

  var tiltUp = script.worldController.api.GetHeadTiltUp();
  var tiltSide = script.worldController.api.GetHeadTiltSide();

    
  //set position
  if(tiltSide < -script.turnStickiness) {
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

  var playerSpeedThisFrame = playerTransf.getLocalPosition().x - pos.x;
    
  playerTransf.setLocalPosition(pos);
      
    
  //set the lean
  var targetZrot = initialRot.z + playerSpeedThisFrame * script.tiltWeight;
  targetZrot = Math.max(targetZrot, initialRot.z - script.tiltMaxDegrees) //ensure degree is above minimum tilt rotation
  targetZrot = Math.min(targetZrot, initialRot.z + script.tiltMaxDegrees) //ensure degree is below maximum tilt rotation
  
  var targetRot = new vec3(rot.x, rot.y, targetZrot );
    rot=targetRot;
  //rot = vec3.lerp(rot, targetRot, getDeltaTime() * 5.0);
  playerTransf.setLocalRotation(quat.fromEulerVec(rot));    
    
    
    
    
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
