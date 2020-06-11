// -----JS CODE-----
//@input Component.ScriptComponent faceParenter


script.api.EnableSelfieMode = function(isEnabled) {

    if (script.faceParenter) {
        if (isEnabled) {
            script.faceParenter.api.DoParentToAdopter();      
        } else {
             script.faceParenter.api.DoParentToOriginal();    
        }    
    }

}