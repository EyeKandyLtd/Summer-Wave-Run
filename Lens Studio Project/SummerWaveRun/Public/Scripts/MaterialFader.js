// -----JS CODE-----

//@input float maxAlpha = 1.0;
//@input cycleTimeSecs = 6;

// @input bool copyMaterial = true

var transform = script.getTransform();

var meshVisual = script.getSceneObject().getFirstComponent("Component.MeshVisual");

if (script.copyMaterial) {
    meshVisual.mainMaterial = meshVisual.mainMaterial.clone();
}

var mainPass = meshVisual.mainPass;

function setAlpha(pass, alpha) {
    var col = pass.baseColor;
    col.a = alpha;
    pass.baseColor = col;
}

script.createEvent("UpdateEvent").bind(function(){
    
    var alpha = maxAlpha * Math.sin( Math.PI * ((getTime() - jumpStartTime)/cycleTimeSecs) );
    
    setAlpha(mainPass, alpha);
    print ("mat settings alpha to " + alpha);
});