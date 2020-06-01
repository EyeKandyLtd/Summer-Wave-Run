// -----JS CODE-----

var colliders = [];

//script.api.AddAABB = function (colliderAABB) {
    
//    colliders.push(colliderAABB)
//}

    function intersect(a, b) {
      return (a.api.minX <= b.api.maxX && a.api.maxX >= b.api.minX) &&
             (a.api.minY <= b.api.maxY && a.api.maxY >= b.api.minY) &&
             (a.api.minZ <= b.api.maxZ && a.api.maxZ >= b.api.minZ);
    }
    
    
    function CheckCollisions() {
        
        var remaining = [];
    
        //refresh colliders
        for (x = 0; x < colliders.length; x++) {
            //if (colliders[x].getSceneObject() == undefined) {
            //    continue;
           // }
            
            try {
                colliders[x].api.RefreshBoundingBox();
            } catch(err) {
                continue;
            }
        
            remaining.push(colliders[x]);
            
        }
        colliders = remaining;
    
        if (colliders.length < 2) return;
    
        //print ("checking collisons between " + colliders.length + " colliders");
        for (a = 0; a < colliders.length; a++) { 
            for ( b = a+1; b < colliders.length; b++) {
                var colA = colliders[a];
                var colB = colliders[b];
            
                try { colA.getSceneObject(); } catch(err) { continue; }       
                try { colB.getSceneObject(); } catch(err) { continue; }
            
                if (colA.api.GetIsTrigger() && colB.api.GetIsTrigger()) continue;
                if (colA.api.GetHasOneShotExecuted() || colB.api.GetHasOneShotExecuted()) {
                   // print ("Skipping as one shot already done..");
                    continue;
                }
            
               // print ("Checking intersection..")
                if (intersect(colA, colB)) {
                    
                    try { colA.getSceneObject(); } catch(err) { continue; }
                    if (!colA.api.GetIsTrigger()) {colA.api.OnIntersection(colB);}
                
                    try { colB.getSceneObject(); } catch(err) { continue; }
                    if (!colB.api.GetIsTrigger()) {colB.api.OnIntersection(colA);}
                    
                }
                
                
            }    
        }
    
    }

    global.RegisterCollider = function (colliderAABB) {
        
        colliders.push(colliderAABB);
    }
    
    global.CheckForCollisions = function () {
        CheckCollisions();
    }