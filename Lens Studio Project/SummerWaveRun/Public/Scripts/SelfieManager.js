// -----JS CODE-----
//@input Component.ScriptComponent faceParenter



script.api.EnableSelfieMode = function(isEnabled) {

    if (isNull(script.faceParenter.script)) return;
    
    
    if (isEnabled) {
        script.faceParenter.api.DoParentToAdopter();
       // script.skyParenter.api.DoParentToAdopter();
    } else {
        script.faceParenter.api.DoParentToOriginal();   
       // script.skyParenter.api.DoParentToOriginal();
    }
    
    

}