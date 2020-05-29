// -----JS CODE-----
//@input float xLength = 30
//@input float yLength = 30
//@input float zLength = 30
//@input bool isTrigger = false
//@input Asset.AudioTrackAsset[] hitSounds


script.api.minX = 0;
script.api.maxX = 0;
script.api.minY = 0;
script.api.maxY = 0;
script.api.minZ = 0;
script.api.maxZ = 0;
script.api.worldPos = vec3.zero;


var intersectionCallback;


script.api.RefreshBoundingBox = function() {
    
    script.api.worldPos = script.getSceneObject().getTransform().getWorldPosition();
    var halfXLength = script.xLength * 0.5;
    var halfYLength = script.yLength * 0.5;
    var halfZLength = script.zLength * 0.5;
    
    script.api.minX = script.api.worldPos.x-halfXLength;
    script.api.maxX = script.api.worldPos.x+halfXLength;
    script.api.minY = script.api.worldPos.y-halfYLength;
    script.api.maxY = script.api.worldPos.y+halfYLength;
    script.api.minZ = script.api.worldPos.z-halfZLength;
    script.api.maxZ = script.api.worldPos.z+halfZLength;
    
}

script.api.OnIntersection = function (otherCollider) {
   // print ("Intersection registered with: " + otherCollider.script.getSceneObject().name);
    if (intersectionCallback != null) {
        intersectionCallback(otherCollider);
    }
}

script.api.SetIntersectionCallback = function(callback) {
    intersectionCallback = callback;
    
}

script.api.GetIsTrigger = function() {
    return script.isTrigger;    
}

script.api.PlayHitSound = function() {

    if (script.hitSounds != null) {
        var randomIndex = Math.floor(Math.random() * script.hitSounds.length);
        var clip =  script.hitSounds[randomIndex];     
        global.playAudioAsset(clip, 1, 0.5);    
    }
}

script.api.DoHitPFX = function() {
    
    global.gamePlayManager.pfxManager.api.DoPFX_HitObject(script.api.worldPos);
}

global.RegisterCollider(script); 