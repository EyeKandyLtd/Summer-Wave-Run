// -----JS CODE-----

//@input float maxAlpha = 1.0
//@input float cycleTimeSecs = 6.0

// @input bool copyMaterial = true

var transform = script.getTransform();

var meshVisual = script.getSceneObject().getFirstComponent("Component.MeshVisual");
var jumpStartTime = getTime();

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
    
    var alpha = script.maxAlpha * Math.sin( Math.PI * ((getTime() - jumpStartTime)/script.cycleTimeSecs) );
    
    setAlpha(mainPass, alpha);
   
});