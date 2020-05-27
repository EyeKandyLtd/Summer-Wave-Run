// -----JS CODE-----

//@input SceneObject[] lives
//@input Component.Text scoreUI

script.api.SetLives = function(lifeCount) {
   
    if (!script.lives != null && script.lives.length >= lifeCount) {
        
        for (i = 0; i < script.lives.length; i++) {
            script.lives[i].enabled = (i < lifeCount);
        }
    }
    
}

script.api.SetScore = function(score) {
   
   script.scoreUI.text = "Distance: " + score ;
    
}
