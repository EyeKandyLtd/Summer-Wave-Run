// -----JS CODE-----
//@input Asset.ObjectPrefab[] pfxLevelFinalBoss
//@input Asset.ObjectPrefab[] pfxLevelComplete
//@input Asset.ObjectPrefab[] pfxHitObject



script.api.DoPFX_LevelFinalBoss = function(worldPos) {
    
    for (i = 0; i < script.pfxLevelFinalBoss.length; i++) {
        DoPFX(script.pfxLevelFinalBoss[i], worldPos);
    }
}

script.api.DoPFX_LevelComplete = function(worldPos) {
    for (i = 0; i < script.pfxLevelComplete.length; i++) {
        DoPFX(script.pfxLevelComplete[i], worldPos);
    }
}

script.api.DoPFX_HitObject = function(worldPos) {
    for (i = 0; i < script.pfxHitObject.length; i++) {
        DoPFX(script.pfxHitObject[i], worldPos);
    }
}



script.api.DoPFX_SpawnPrefabatPoint = function(pfxList, worldPos) {
    for (i = 0; i < pfxList.length; i++) {
        DoPFX(pfxList[i], worldPos);
    }
}

function DoPFX(pfx, worldPos) {

    if (pfx != null) {
        var inst = pfx.instantiate(null);
        
        inst.getTransform().setWorldPosition(worldPos);
        
        
    }
    
     
}

