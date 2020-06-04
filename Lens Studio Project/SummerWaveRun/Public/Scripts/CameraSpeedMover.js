// -----JS CODE-----

//@input Component.ScriptComponent speedProvider
//@input vec3 maxSpeedOffset
//@input float maxSpeed
//@input float minSpeed

var camTrans = script.getSceneObject().getTransform();
var camInitialPos = camTrans.getWorldPosition();
var currSpeed = 0;

if (isNaN(script.maxSpeed)) script.maxSpeed = 0;
if (isNaN(script.minSpeed)) script.minSpeed = 0;


var updateEvent = script.createEvent("LateUpdateEvent");
updateEvent.bind(function(eventData) {
    
    try {
        currSpeed = script.speedProvider.api.GetCurrentSpeed();
    }
    catch(e) {return;}
    
    var pctOfMaxSpeed = (script.maxSpeed-script.minSpeed)/(currSpeed - script.minSpeed);
    pctOfMaxSpeed = Math.max(Math.min(1,pctOfMaxSpeed), 0); //clamp between 0 and 1
    var offsetVec = script.maxSpeedOffset.uniformScale(pctOfMaxSpeed);
    var targetVec = camInitialPos.add(offsetVec);
    var nextPos = vec3.lerp(camTrans.getWorldPosition(), targetVec, getDeltaTime());
    camTrans.setWorldPosition(nextPos);
/*    
    print ("script.maxSpeedOffset = " + script.maxSpeedOffset);
    print ("camInitialPos = " + camInitialPos);
    print ("pctOfMaxSpeed = " + pctOfMaxSpeed);
    print ("offsetVec = " + offsetVec);
    print ("targetVec = " + targetVec);
 */
    print ("nextPos = " + nextPos);
 
    
});