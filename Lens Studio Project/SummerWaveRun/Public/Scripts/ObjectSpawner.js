// -----JS CODE-----


//@input Asset.ObjectPrefab[] prefabPool
//@input SceneObject[] spawnTargetObjects
//@input float secondsBetweenSpawns = 1.0
//@input bool runOnTurnedOn = false


var objectInstances = [];
var isRunning = false;
var timeLastSpawned = 0;
var spawnCallback;

script.api.SetPrefabPool = function (prefabPool) { 
    script.prefabPool = prefabPool;
};

script.api.SetSpawnTargetObjects = function (spawnTargetObjects) { 
    script.spawnTargetObjects = spawnTargetObjects;
};

script.api.SetSecondsBetweenSpawns = function (secondsBetweenSpawns) {
    script.secondsBetweenSpawns = secondsBetweenSpawns;
};

script.api.GetSecondsBetweenSpawns = function (secondsBetweenSpawns) {
    return script.secondsBetweenSpawns ;
};


script.api.SetSpawnCallback = function(callback) {
    spawnCallback = callback;
}


script.api.StartSpawning = function () {
    
    timeLastSpawned = 0;
    isRunning = true;
    
};

script.api.StopSpawning = function () {
    
    isRunning = false;
    
};

var initEvent = script.createEvent("TurnOnEvent");
initEvent.bind(function(eventData) { 
    if (script.runOnTurnedOn) {
        script.api.StartSpawning();
    }
});

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(function(eventData){
  
   if (isRunning) {
        if (timeLastSpawned < getTime() - script.secondsBetweenSpawns) {         
            script.api.DoSpawnOneShot();            
            timeLastSpawned = getTime();
        }        
        
    }
        
});


script.api.DoSpawnOneShot = function () {

    var prefabPoolLen = script.prefabPool.length;

      if (prefabPoolLen > 0) {
    
            var randomIndex = Math.floor(Math.random() * prefabPoolLen);
            var prefab =  script.prefabPool[randomIndex];
            
            if (prefab != null) {
                var spawnTargetObjectsLen = script.spawnTargetObjects.length;
                randomIndex = Math.floor(Math.random() * spawnTargetObjectsLen);
                var targetObject =  script.spawnTargetObjects[randomIndex];
                
                if (targetObject != null) {
                
                    spawnPos = targetObject.getTransform().getWorldPosition();
                    var inst = prefab.instantiate(targetObject);
                    inst.getTransform().setWorldPosition(spawnPos);
                    if (spawnCallback != null) {spawnCallback(inst);}
                    // objectInstances.push(inst);
                 
                }
                
            } else {
                print("ObjectSpawner:: A slot on the prefab pool was null. Please check and restart Lens.");            
                
            }
        
      } else {
        print("ObjectSpawner:: Prefab pool was empty. Please check and restart Lens.");            
                
      }
    
};



/*
function GetRandomPointInCircle(center, maxRadius) {
    var nv = new vec3(
        Math.random() * maxRadius - maxRadius * 0.5,
        0,
        Math.random() * maxRadius - maxRadius * 0.5);

    return center.add(nv);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

*/

