//@input float SimpleJumpHeight
//@input float SimpleJumpTime

//@input float ForceJumpHeight
//@input float ForceJumpTime

//@input Asset.AudioTrackAsset[] simpleJumpSounds

//@input SceneObject[] disableWhenInAir

var initialScale;
var jumpTrans;

var isJumpRequested = false;
var requestedJumpHeight;
var requestedJumpTime;
var isForceJumping = false;


var jumpStartTime;

script.api.isOnGround = true;
var playerTransf = script.getSceneObject().getTransform();
var initialPos = playerTransf.getLocalPosition();
var initialRot = playerTransf.getLocalRotation();

function Init() {
    jumpTrans = script.getSceneObject().getTransform();
    initialScale = jumpTrans.getLocalScale();
    
}

var mouthOpenedEvent = script.createEvent("MouthOpenedEvent");
mouthOpenedEvent.faceIndex = 0;
mouthOpenedEvent.bind(function (eventData)
{
   
    script.api.DoSimpleJump();
});

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(function(eventData){
  
    if(typeof jumpTrans === 'undefined')   { Init();   }
   
    if (isJumpRequested) {
        isJumpRequested = false
        if (script.api.isOnGround ) {
            script.api.isOnGround = false;
            jumpStartTime = getTime();
            global.playRandomAudioAsset(script.simpleJumpSounds, 1, 1);
            SetContentEnabled(script.disableWhenInAir, false);
        } else {
           // print("Ignoring jump request as object is not on the ground.");
        }
    }
    
    if (!script.api.isOnGround || isForceJumping ) {
        ContinueJump();        
            
    }
        
});

function ContinueJump() {
    
    var pos = jumpTrans.getLocalPosition();
    var y = requestedJumpHeight * Math.sin( Math.PI * ((getTime() - jumpStartTime)/requestedJumpTime) );                                    
   // print ("jumping with y = " + y);  
    
    //have we just landed?
     if (y< 0) {
        y = initialPos.y;
        script.api.isOnGround = true; 
        isForceJumping = false;
        SetContentEnabled(script.disableWhenInAir, true);
     }
    
    pos.y = y;
    
   jumpTrans.setLocalPosition(pos);
   jumpTrans.scale = initialScale.add(vec3.one().uniformScale(3*y));
        
}

function SetContentEnabled(content, isEnabled) {
    if (content == null) return;
    
    for(var i = 0; i < content.length; i++)    {
        
        if(content[i]) content[i].enabled = isEnabled;
    }
}


script.api.SimpleJump = function(height, timeSecs) { 
    requestedJumpHeight = height;
    requestedJumpTime = timeSecs;
    isJumpRequested = true; 
    
}

script.api.DoSimpleJump = function() {
 script.api.SimpleJump(script.SimpleJumpHeight, script.SimpleJumpTime);
}

script.api.ForceJump = function(height, timeSecs) { 
    requestedJumpHeight = height;
    requestedJumpTime = timeSecs;
    isForceJumping = true;
    isJumpRequested = true; 
}

script.api.DoForceJump = function() {
 script.api.ForceJump(script.ForceJumpHeight, script.ForceJumpTime);
}
