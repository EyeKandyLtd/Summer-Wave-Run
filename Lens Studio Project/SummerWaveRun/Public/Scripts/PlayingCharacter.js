//@input Component.ScriptComponent gameplayManager
//@input Component.ScriptComponent gestureManager
//@input Component.ScriptComponent colliderAABB
//@input Component.ScriptComponent jumpController3D


//@input float strafeSpeed = 600.0 {"widget":"slider", "min":50.0, "max":3000.0}
//@input float turnStickiness = 0.03 {"widget":"slider", "min":0.0001, "max":0.99}
//@input float horizonalMovementRange = 100 {"widget":"slider", "min":0, "max":200}
//@input float tiltWeight = 3
//@input float tiltMaxDegrees = 0.15 {"widget":"slider", "min":0.02, "max":4}
//@input float waveBounceSeconds = 4 {"widget":"slider", "min":0.3, "max":32}


if(!script.gestureManager )
{ throw new Error("One or more fields aren't set."); return; }  // Check to prevent Studio lens failure to let you set null fields when in error

var playerTransf = script.getSceneObject().getTransform();
//var imageComp = 
var facingDirection = -1; // starts facing left
var initialPos;
var initialRot;
var markedForPositionReset = false; // because it has to be done in Update
var halfExtentXMovementRange = script.horizonalMovementRange * 0.5

var isInit = false;

function EnsureInit() {
    
    if (!isInit) {
        initialPos = playerTransf.getLocalPosition();
        initialRot = playerTransf.getLocalRotation();
        
        script.colliderAABB.api.SetIntersectionCallback(HandleCollision);
        
        isInit = true;
    }
    
}



/// UPDATE
var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(function(eventData) {
      
    EnsureInit();
    UpdatePosition();
    CheckCollisions();
 
    
});


function UpdatePosition() {
    
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
    
  var tiltUp = script.gestureManager.api.GetHeadTiltUp();
  var tiltSide = script.gestureManager.api.GetHeadTiltSide();

    
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
    
}

function CheckCollisions() {

    if (script.jumpController3D.api.isOnGround) { // optimisation: don't check if in the air..
        global.CheckForCollisions();
    }
    
}

function HandleCollision(other) {
    var otherName = other.getSceneObject().name;
    
    if (otherName == "LifeVest") {
        script.gameplayManager.api.Lives_Increment();
    } else {
         script.gameplayManager.api.Lives_Decrement();
    }
    
    //print("Player Handling Collision: " + otherName);  
    
    other.api.PlayHitSound();
    other.api.DoHitPFX();
    other.getSceneObject().destroy();
      
    
}



