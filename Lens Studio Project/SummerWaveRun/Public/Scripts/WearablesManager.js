// -----JS CODE-----
//@input SceneObject[] LevelGlasses
//@input SceneObject[] LevelHats

var yOffsetForDisabledWearables = 999;

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
    
    var len = sceneObjs.length;

    if (len > 0) {
        var randomIndex = Math.floor(Math.random() * len);
       ActiveObject(sceneObjs, randomIndex);
    } else {
        print("ObjectSpawner:: Prefab pool was empty. Please check and restart Lens.");                    
    }
        
}

function ActiveObject(sceneObjs, indx) {
    
    var len = sceneObjs.length;
        
    for (i = 0; i < len; i++) {
            
    if (sceneObjs[i] != null) {
    //print(" I shall ActiveObject " + sceneObjs[i].name + " which is " + i + " of " + len + "? : " + (indx == i));
       
        // set the selected warable to active..    
        //sceneObjs[i].enabled = (indx == i);
        var isTheChosenOne = (indx == i);
        
        // ensure sure the active wearable is on the face and 
        // that non-active ones are way out in space to prevent 
        // draw order occulstion which apparently disabled objects 
        // still do on enabled ones! 
        var wt =  sceneObjs[i].getTransform();
        var lp = wt.getLocalPosition();
        if (lp.y > yOffsetForDisabledWearables) {
            if (isTheChosenOne) lp.y -= yOffsetForDisabledWearables; //bring it back down
        } else {
            if (!isTheChosenOne) lp.y += yOffsetForDisabledWearables;
        }
        wt.setLocalPosition(lp);
        print(" Sceneobject " + sceneObjs[i].name + " is positioned at " + lp);
        
    } else {
        print("ObjectSpawner:: A slot on the prefab pool was null. Please check and restart Lens.");            
    }
}
    
}

 script.api.onLoad = function() {
    script.api.ActiveLevelWearables(0);
        
 };


