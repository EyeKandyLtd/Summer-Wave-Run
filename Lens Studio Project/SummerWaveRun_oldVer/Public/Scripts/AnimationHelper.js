// -----JS CODE-----

//@input float startRotDegPerSec = 0

var updateEvent = script.createEvent("UpdateEvent");
var eventRotate = script.createEvent("UpdateEvent");
var eventMove = script.createEvent("UpdateEvent");

var isRunning = false;

script.api.rotateActive = false;
var rotateDegreesPerSecond = 90; 

script.api.moveActive = false;
var moveUnitsPerSecond = 5;
var moveTargetOffsetPosition;
var moveWayPoint;
var moveStartPos;
var moveVelocity;
var moveTargetDistance;
var moveReachedTargetCallback;

script.api.IsIdle = function () { return (!script.api.moveActive && !script.api.rotateActive); }



script.api.Rotate_Start = function (speedPerSec) {
     
    rotateDegreesPerSecond = speedPerSec;
    script.api.rotateActive = true;
    script.removeEvent(eventRotate);
    eventRotate = script.createEvent("UpdateEvent");

    eventRotate.bind(OnDeltaRotate);

   // print("StartRotate at " + speedPerSec + " degrees per second..");

}

script.api.Rotate_Stop = function () {

    script.api.rotateActive = false;
    script.removeEvent(eventRotate);
   // print("Stopped Rotate. ");
}

script.api.Move_Start = function (unitsPerSec, targetOffsetPosition, callbackOnArrived) {

    moveTargetOffsetPosition = targetOffsetPosition;
    moveReachedTargetCallback = callbackOnArrived;
    moveUnitsPerSecond = unitsPerSec;
    moveStartPos = script.getSceneObject().getTransform().getLocalPosition();
    moveWayPoint = moveStartPos.add(targetOffsetPosition);
    moveTargetDistance = moveStartPos.distance(moveWayPoint);
    moveVelocity = moveWayPoint.sub(moveStartPos).normalize();

    script.api.moveActive = true;

    script.removeEvent(eventMove);
    eventMove = script.createEvent("UpdateEvent");
    eventMove.bind(DoDeltaMoveToWayPoint);

   //print("Move start at " + moveUnitsPerSecond + " unitys per second to waypoint " + moveWayPoint);

}


script.api.Move_Stop = function () {

    script.api.moveActive = false;
    script.removeEvent(eventMove);
  //  print("Stopped Move. ");
}



function DoDeltaMoveToWayPoint() {

    var trans = script.getSceneObject().getTransform();
    var s = getDeltaTime() * moveUnitsPerSecond;
    var incVec = moveVelocity.scale(new vec3(s,s,s));
    var pos = trans.getLocalPosition();
    var nextPos = pos.add(incVec);

    if (moveTargetDistance < moveStartPos.distance(nextPos)) {
        nextPos = moveStartPos.add(moveTargetOffsetPosition);
       // print(script.getSceneObject().name + " as reached its way point ");
        script.api.Move_Stop();
        moveReachedTargetCallback();

    }


    trans.setLocalPosition(nextPos);
}

function OnDeltaRotate() {

    //print("frame OnDeltaRotate");

        // Rotate a SceneObject around the world Y axis
    var obj = script.getSceneObject();

    // Degrees to rotate by
    var degrees = rotateDegreesPerSecond * getDeltaTime();


    global.RotateSceneObject(obj, degrees);
}



function OnUpdate()
{
    if (isRunning) {
       // print("OnUpdate(): frame update");
    }

}


global.RotateSceneObject = function (sceneObject, degrees) {


    // Convert degrees to radians
    var radians = degrees * (Math.PI / 180);

    // Axis to rotate around
    var axis = vec3.up();

    // Rotation we will apply to the object's current rotation
    var rotationToApply = quat.angleAxis(radians, axis);

    // Get the object's current world rotation
    var oldRotation = sceneObject.getTransform().getLocalRotation();

    // Get the new rotation by rotating the old rotation by rotationToApply
    var newRotation = rotationToApply.multiply(oldRotation);

    // Set the object's world rotation to the new rotation
    sceneObject.getTransform().setLocalRotation(newRotation);

}

function _Init() {
    if (script.startRotDegPerSec != 0) {
        script.api.Rotate_Start(script.startRotDegPerSec);
    }
}
_Init();
