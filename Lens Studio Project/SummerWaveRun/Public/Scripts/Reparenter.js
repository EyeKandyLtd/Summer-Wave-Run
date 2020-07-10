// -----JS CODE-----
//@input SceneObject adoptee
//@input SceneObject adpoter
//@input vec3 localPosition
//@input vec3 localRotation

//if(!script.adoptee || !script.offsetFromParent) { throw new Error("One or more fields aren't set."); return; }

var originalParent = script.adoptee.getParent();
var originalLocalPosition = script.adoptee.getTransform().getLocalPosition();
var originalLocalRotation = script.adoptee.getTransform().getLocalRotation();

if (isNull(script.adpoter)) script.adpoter = script.getSceneObject();

script.api.DoParentToAdopter = function() {
     if (script.adoptee.getParent() == script.adpoter) return;
    
    script.adoptee.setParent(script.adpoter);
    script.adoptee.getTransform().setLocalPosition(script.localPosition);
    script.adoptee.getTransform().setLocalRotation(quat.fromEulerVec(script.localRotation));
    script.adoptee.enabled = true;
    
}

script.api.DoParentToOriginal = function() {
    if (script.adoptee.getParent() == originalParent) return;
    
    script.adoptee.setParent(originalParent);
    script.adoptee.getTransform().setLocalPosition(originalLocalPosition);
    script.adoptee.getTransform().setLocalRotation(originalLocalRotation);
    script.adoptee.enabled = true;
}