var initialScale;
var jumpTrans;

var isJumpRequested = false;
var requestedJumpHeight;
var requestedJumpTime;


var jumpStartTime;

script.api.isOnGround = true;

function Init() {
    jumpTrans = script.getSceneObject().getTransform();
    initialScale = jumpTrans.getLocalScale();
    
}

var mouthOpenedEvent = script.createEvent("MouthOpenedEvent");
mouthOpenedEvent.faceIndex = 0;
mouthOpenedEvent.bind(function (eventData)
{
    print("Mouth was opened on face 0");
    script.api.Jump(70, 1.5);
});

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(function(eventData){
  
    if(typeof jumpTrans === 'undefined')   { Init();   }
   
    if (isJumpRequested) {
        isJumpRequested = false
        if (script.api.isOnGround) {
            script.api.isOnGround = false;
            jumpStartTime = getTime();
        } else {
            print("Ignoring jump request as object is not on the ground.");
        }
    }
    
    if (!script.api.isOnGround) {
        ContinueJump();        
            
    }
        
});

function ContinueJump() {
    
    var pos = jumpTrans.getLocalPosition();
    var y = requestedJumpHeight * Math.sin( Math.PI * ((getTime() - jumpStartTime)/requestedJumpTime) );                                    
   // print ("jumping with y = " + y);  
    
     if (y< 0) {
        y = 0;
        script.api.isOnGround = true; 
     }
    
    pos.y = y;
    
   jumpTrans.setLocalPosition(pos);
   jumpTrans.scale = initialScale.add(vec3.one().uniformScale(3*y));
    
    
}




script.api.Jump = function(height, timeSecs) { 
    requestedJumpHeight = height;
    requestedJumpTime = timeSecs;
    isJumpRequested = true; 
}