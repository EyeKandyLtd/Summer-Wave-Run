// -----JS CODE-----

//@input Component.ScriptComponent speedProvider
//@input vec3 maxSpeedOffset
//@input float maxSpeed
//@input float minSpeed

var camTrans = script.getSceneObject().getTransform();
var camInitialPos = camTrans.getWorldPosition();
var currSpeed = 0;




var updateEvent = script.createEvent("LateUpdateEvent");
updateEvent.bind(function(eventData) {
    
    try {
        //currSpeed = script.speedProvider.api.GetCurrentSpeed();
        currSpeed = script.speedProvider.api.GetCurrentDistance();
    }
    catch(e) {currSpeed = 0;}
    
    if (isNaN(script.maxSpeed)) return;
    if (isNaN(script.minSpeed)) return;
    
    var pctOfMaxSpeed = (currSpeed - script.minSpeed)/(script.maxSpeed-script.minSpeed);
    pctOfMaxSpeed = Math.max(Math.min(1,pctOfMaxSpeed), -1); //clamp between -1 and 1
    var offsetVec = script.maxSpeedOffset.uniformScale(pctOfMaxSpeed);
    var targetVec = camInitialPos.add(offsetVec);
    //var nextPos = targetVec;
    var nextPos = vec3.lerp(camTrans.getWorldPosition(), targetVec, getDeltaTime());
    camTrans.setWorldPosition(nextPos);
/*    
    print ("script.maxSpeedOffset = " + script.maxSpeedOffset);
    print ("camInitialPos = " + camInitialPos);
    
    print ("offsetVec = " + offsetVec);
    print ("targetVec = " + targetVec);
 */
   
   // print ("currSpeed: " + currSpeed);
   //print ("pctOfMaxSpeed = " + pctOfMaxSpeed);
   // print ("nextPos = " + nextPos);
 
    
});