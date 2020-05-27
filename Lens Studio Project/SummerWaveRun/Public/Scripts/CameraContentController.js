
// @input SceneObject[] startContentOn
// @input SceneObject[] startContentOff

// @input SceneObject[] faceContent
// @input SceneObject[] worldContent


var lateUpdateEvent = script.createEvent("LateUpdateEvent").bind(function (eventData) { onLateUpdate(eventData); });
var cameraFrontEvent = script.createEvent("CameraFrontEvent").bind(function (eventData) { onFrontCamEvent(eventData); });
var cameraBackEvent = script.createEvent("CameraBackEvent").bind(function (eventData) { onBackCamEvent(eventData); });
var lensStart = script.createEvent("TurnOnEvent").bind(function (eventData) { onLensStart(eventData); });


var doLensStart = false;
var doBackCamEvent = false;
var doFrontCamEvent= false;


global.camContentSingleton = script;

function _Init() {
    var cType = global.scene.getCameraType();
    doBackCamEvent = (cType == "back");
    doFrontCamEvent = !doBackCamEvent;
   
    isInit = true;
    
}

function onFrontCamEvent(eventData) {
    doFrontCamEvent = true;
}

function onBackCamEvent(eventData) {
    doBackCamEvent = true;
}

function onLensStart(eventData) {
    doLensStart = true;
}

function SetContentEnabled(content, isEnabled) {
 for(var i = 0; i < content.length; i++)    {
        //print ("setting " + content[i].name + " to " + isEnabled);
        if(content[i])content[i].enabled = isEnabled;
    }
}



var firstFrame = true;
var isInit = false;
function onLateUpdate(eventData) {

    
    if (firstFrame) { firstFrame = false; return; }
    
    if (!isInit) {
        _Init(); 
    }

    if (doLensStart) {
        SetContentEnabled(script.startContentOff, false);
        SetContentEnabled(script.startContentOn, true); 
        doLensStart = false;
        //print("CameraContentController(): doLensStart");
        return;
    }

    if (doFrontCamEvent) {

        SetContentEnabled(script.faceContent, true);
        SetContentEnabled(script.worldContent, false);
        doFrontCamEvent = false;
        //print("CameraContentController(): doFrontCamEvent");
        return;
    }

    if (doBackCamEvent) {

        SetContentEnabled(script.faceContent, false);
        SetContentEnabled(script.worldContent, true); 
        doBackCamEvent = false;
      // print("CameraContentController(): doBackCamEvent");
        return;
    }

    //print("CameraContentController(): no events this frame..");

}

script.api.ResartCameraController = function () {
    doLensStart = true;
}

global.ResartCameraController = function () {
    global.camContentSingleton.api.ResartCameraController();
}



