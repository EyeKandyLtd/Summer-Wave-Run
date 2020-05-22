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

    for (x = 0; x < colliders.length; x++) {
        
        try {
            colliders[x].api.RefreshBoundingBox();
        } catch(err) {
            colliders.splice(x,1);
            x--
        }
    }
    //print ("checking collisons between " + colliders.length + " colliders");
    for (a = 0; a < colliders.length; a++) { 
        for ( b = a+1; b < colliders.length; b++) {
            var colA = colliders[a];
            var colB = colliders[b];
            if (!colA.api.GetIsTrigger() || !colB.api.GetIsTrigger()) { // skip if both are triggers
               // print ("Checking intersection..")
                if (intersect(colA, colB)) {
                    print ("Collision!")
                    if (!colA.api.GetIsTrigger()) {colA.api.OnIntersection(colB);}
                    if (!colB.api.GetIsTrigger()) {colB.api.OnIntersection(colA);}
                }
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