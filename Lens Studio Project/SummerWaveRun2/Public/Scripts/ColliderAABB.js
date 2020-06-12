// -----JS CODE-----
//@input float xLength = 30
//@input float yLength = 30
//@input float zLength = 30
//@input bool isTrigger = false
//@input bool isOneShot = true
//@input bool isDestroyOnHit = true
//@input Asset.AudioTrackAsset[] hitSounds
//@input float xOffset = 0
//@input float yOffset = 0
//@input float zOffset = 0

  if (isNaN(script.xOffset)) script.xOffset = 0;
  if (isNaN(script.yOffset)) script.yOffset = 0;
  if (isNaN(script.zOffset)) script.zOffset = 0;

script.api.minX = 0;
script.api.maxX = 0;
script.api.minY = 0;
script.api.maxY = 0;
script.api.minZ = 0;
script.api.maxZ = 0;
script.api.worldPos = vec3.zero;


var intersectionCallback;
var collisionCount = 0;


script.api.RefreshBoundingBox = function() {
  
    
    script.api.worldPos = script.getSceneObject().getTransform().getWorldPosition();
    var halfXLength = script.xLength * 0.5;
    var halfYLength = script.yLength * 0.5;
    var halfZLength = script.zLength * 0.5;

    
    script.api.minX = script.xOffset + script.api.worldPos.x-halfXLength;
    script.api.maxX = script.xOffset + script.api.worldPos.x+halfXLength;
    script.api.minY = script.yOffset + script.api.worldPos.y-halfYLength;
    script.api.maxY = script.yOffset + script.api.worldPos.y+halfYLength;
    script.api.minZ = script.zOffset + script.api.worldPos.z-halfZLength;
    script.api.maxZ = script.zOffset + script.api.worldPos.z+halfZLength;
    
    
 
    
}

script.api.OnIntersection = function (otherCollider) {
    //print ("Intersection registered between: " + script.getSceneObject().name + " (" + script.getSceneObject().getTransform().getWorldPosition() + ") and " + otherCollider.script.getSceneObject().name + " (" + otherCollider.script.getSceneObject().getTransform().getWorldPosition() + ").");
    
    if (script.api.GetHasOneShotExecuted() ) return;
    
    if (intersectionCallback != null) {
        intersectionCallback(otherCollider);
    }
    
    try {
        if (!otherCollider.getSceneObject().api.GetIsTrigger()) {
            collisionCount++;
        }  
    } catch(err) {}
      
        
    
}

script.api.SetIntersectionCallback = function(callback) {
    intersectionCallback = callback;
    
}

script.api.GetIsTrigger = function() {
    return script.isTrigger;    
}

script.api.GetIsDestroyOnHit = function() {
    
    return script.isDestroyOnHit;
}

script.api.GetHasOneShotExecuted = function() {
    return (script.isOneShot && collisionCount > 0) ;
}

script.api.PlayHitSound = function() {

    if (script.hitSounds != null) {
        var randomIndex = Math.floor(Math.random() * script.hitSounds.length);
        var clip =  script.hitSounds[randomIndex];     
        global.playAudioAsset(clip, 1, 1);    
    }
}

script.api.DoHitPFX = function() {
    
    global.gamePlayManager.pfxManager.api.DoPFX_HitObject(script.api.worldPos);
}

global.RegisterCollider(script); 