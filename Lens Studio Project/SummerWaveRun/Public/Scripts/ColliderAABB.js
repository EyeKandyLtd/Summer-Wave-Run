// -----JS CODE-----
//@input float xLength = 30
//@input float yLength = 30
//@input float zLength = 30
//@input bool isTrigger = false

script.api.minX = 0;
script.api.maxX = 0;
script.api.minY = 0;
script.api.maxY = 0;
script.api.minZ = 0;
script.api.maxZ = 0;

var intersectionCallback;

script.api.RefreshBoundingBox = function() {
    
    var pos = script.getSceneObject().getTransform().getWorldPosition();
    var halfXLength = script.xLength * 0.5;
    var halfYLength = script.yLength * 0.5;
    var halfZLength = script.zLength * 0.5;
    
    script.api.minX = pos.x-halfXLength;
    script.api.maxX = pos.x+halfXLength;
    script.api.minY = pos.y-halfYLength;
    script.api.maxY = pos.y+halfYLength;
    script.api.minZ = pos.z-halfZLength;
    script.api.maxZ = pos.z+halfZLength;
       
    
}

script.api.OnIntersection = function (otherCollider) {
    print ("Intersection registered with: " + otherCollider.script.getSceneObject().name);
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

global.RegisterCollider(script); 