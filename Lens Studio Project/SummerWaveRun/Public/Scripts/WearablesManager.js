// -----JS CODE-----
//@input SceneObject[] LevelGlasses
//@input SceneObject[] LevelHats



script.api.ActiveRandomHat = function () {
    RandomActivateOneObject(script.LevelHats);
};

script.api.ActiveRandomGlasses = function () {
    RandomActivateOneObject(script.LevelGlasses);
};

script.api.ActiveLevelWearables = function (levelIndex) {
   
    //return;
    ActiveObject(script.LevelGlasses, levelIndex);
    ActiveObject(script.LevelHats, levelIndex);
};

script.api.ActiveRandomWearables = function () {
    RandomActivateOneObject(script.LevelGlasses);
    RandomActivateOneObject(script.LevelHats);
};


function RandomActivateOneObject(sceneObjs) {
    
    var len = sceneObjs.length-1;

    if (len >=0) {
        var randomIndex = Math.floor(Math.random() * len);
       ActiveObject(sceneObjs, randomIndex);
    } else {
        print("ObjectSpawner:: Prefab pool was empty. Please check and restart Lens.");                    
    }
        
}

function ActiveObject(sceneObjs, indx) {
    
    var len = sceneObjs.length;
    if (indx >= len) indx = len-1; if (indx < 0) indx = 0;
    
     for (i = 0; i < len; i++) {
            
            if (sceneObjs[i] != null) {
            //print(" I shall ActiveObject " + sceneObjs[i].name + " which is " + i + " of " + len + "? : " + (indx == i));
                sceneObjs[i].enabled = (sceneObjs[i].name == sceneObjs[indx].name);
            } else {
                print("ObjectSpawner:: A slot on the prefab pool was null. Please check and restart Lens.");            
            }
        }
    
}

 script.api.onLoad = function() {
    script.api.ActiveLevelWearables(0);
        
 };


