// -----JS CODE-----
//[REQUIRES COMPONENT JOINED]
//input Component.ScriptComponent faceParenter 



script.api.EnableSelfieMode = function(isEnabled) {

   // if (isNull(script.faceParenter.api)) return;
    
    try {
        if (isEnabled) {
            script.api.DoParentToAdopter();
           // script.skyParenter.api.DoParentToAdopter();
        } else {
            script.api.DoParentToOriginal();   
           // script.skyParenter.api.DoParentToOriginal();
        }
    } catch (e) {
        print (e.message);
    }
    
    

}