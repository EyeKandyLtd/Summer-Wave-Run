// -----JS CODE-----

//@input Component.ScriptComponent valueProvider
//@input vec3 maxCamOffset
//@input float minSpeed
//@input float maxSpeed


var camTrans = script.getSceneObject().getTransform();
var camInitialPos = camTrans.getWorldPosition();
var currSpeed = 0;




var updateEvent = script.createEvent("LateUpdateEvent");
updateEvent.bind(function(eventData) {
    
    try {
        //currSpeed = script.valueProvider.api.GetCurrentSpeed();
        currSpeed = script.valueProvider.api.GetCurrentDistance();
    }
    catch(e) {currSpeed = 0;}
    
    if (isNaN(script.maxSpeed)) return;
    if (isNaN(script.minSpeed)) return;
    
    var pctOfMaxSpeed = (currSpeed - script.minSpeed)/(script.maxSpeed-script.minSpeed);
    pctOfMaxSpeed = Math.max(Math.min(1,pctOfMaxSpeed), -1); //clamp between -1 and 1
    var offsetVec = script.maxCamOffset.uniformScale(pctOfMaxSpeed);
    var targetVec = camInitialPos.add(offsetVec);
    //var nextPos = targetVec;
    var nextPos = vec3.lerp(camTrans.getWorldPosition(), targetVec, getDeltaTime());
    camTrans.setWorldPosition(nextPos);
/*    
    print ("script.maxCamOffset = " + script.maxCamOffset);
    print ("camInitialPos = " + camInitialPos);
    
    print ("offsetVec = " + offsetVec);
    print ("targetVec = " + targetVec);
 */
   
    //print ("currSpeed: " + currSpeed);
   //print ("pctOfMaxSpeed = " + pctOfMaxSpeed);
   // print ("nextPos = " + nextPos);
 
    
});