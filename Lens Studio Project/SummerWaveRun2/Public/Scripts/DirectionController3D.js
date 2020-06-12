// -----JS CODE-----

//@input bool runOnTurnedOn = true
//@input vec3 initialVector
//@input bool runOnTurnedOn = true
//@input float distanceBeforeDeath = 500

var isOperating = false;
var thisTransform = script.getSceneObject().getTransform();
var currVec = script.initialVector;
var initialPos = script.getSceneObject().getTransform().getLocalPosition();

var isInit = false;



function EnsureInitialized() {
    
    if (!isInit) {
        isInit = true;
        if (script.runOnTurnedOn) {
            script.api.StartMoving();
        }
    
    }
}

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(function(eventData){
  
    EnsureInitialized();
   
    DoUpdateMovement();
    
    CheckIfThisShouldDie();


});


script.api.StartMoving = function () {
    
    timeStartedMoving = getTime();
    isOperating = true;
    
};

script.api.UpdateDirection = function(newVec) {
   currVec = newVec;
}


function DoUpdateMovement() {
    
     if (isOperating) {
        var vec = currVec;
        if (global.directionController3DVector != vec3.zero) {
            vec = global.directionController3DVector;
        }
       
        var deltaVec = vec.uniformScale(getDeltaTime());
        var newPos = thisTransform.getLocalPosition().add(deltaVec);
        thisTransform.setLocalPosition(newPos);
        
    }
    
}

function CheckIfThisShouldDie() {
    
    var distFromStart = (thisTransform.getLocalPosition().distance(initialPos));
    var isMarkedForDeath = (distFromStart > script.distanceBeforeDeath) ;
    //print ("distFromStart = " + distFromStart);
    /* -- if using time rather than distance for death
    isMarkedForDeath = (timeStartedMoving < getTime() - script.secondsAlive) ;
    */
   
    if (isMarkedForDeath) {
        script.getSceneObject().destroy();
    }

    
}

if (script.api.onLoad) {
    script.api.onLoad();
}

