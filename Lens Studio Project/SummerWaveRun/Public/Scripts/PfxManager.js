// -----JS CODE-----
//@input Asset.ObjectPrefab pfxLevelComplete
//@input Asset.ObjectPrefab pfxHitObject



script.api.DoPFX_LevelComplete = function(worldPos) {
    DoPFX(script.pfxLevelComplete, worldPos);
}

script.api.DoPFX_HitObject = function(worldPos) {
    DoPFX(script.pfxHitObject, worldPos);
}

function DoPFX(pfx, worldPos) {

    if (pfx != null) {
        var inst = pfx.instantiate(null);
        
        inst.getTransform().setWorldPosition(worldPos);
        
        
    }
    
     
}

