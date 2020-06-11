// -----JS CODE-----
//@input SceneObject adoptee
//@input vec3 offsetFromParent
//@input vec3 worldRotation

//if(!script.adoptee || !script.offsetFromParent) { throw new Error("One or more fields aren't set."); return; }

var originalParent = script.adoptee.getParent();
var originalLocalPosition = script.adoptee.getTransform().getLocalPosition();
var originalWorldRotation = script.adoptee.getTransform().getWorldRotation();

script.api.DoParentToAdopter = function() {
    
    script.adoptee.setParent(script.getSceneObject());
    script.adoptee.getTransform().setLocalPosition(script.offsetFromParent);
    script.adoptee.getTransform().setWorldRotation(originalWorldRotation);
}

script.api.DoParentToOriginal = function() {
    script.adoptee.setParent(originalParent);
    script.adoptee.getTransform().setLocalPosition(originalLocalPosition);
    script.adoptee.getTransform().setWorldRotation(originalWorldRotation);
}