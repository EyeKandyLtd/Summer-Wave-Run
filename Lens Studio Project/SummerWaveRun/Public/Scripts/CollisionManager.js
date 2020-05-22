// -----JS CODE-----

var colliders = [];

//script.api.AddAABB = function (colliderAABB) {
    
//    colliders.push(colliderAABB)
//}

function intersect(a, b) {
  return (a.minX <= b.maxX && a.maxX >= b.minX) &&
         (a.minY <= b.maxY && a.maxY >= b.minY) &&
         (a.minZ <= b.maxZ && a.maxZ >= b.minZ);
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
    
    for (a = 0; a < colliders.length; a++) { 
        for ( b = a+1; b < colliders.length; b++) {
            var colA = colliders[a];
            var colB = colliders[b];
            if (!colA.api.GetIsTrigger() || !colB.api.GetIsTrigger()) { // skip if both are triggers
                if (intersect(colA, colB)) {
                    colA.api.OnIntersection(colB);
                    colB.api.OnIntersection(colA);
                }
            }
            
        }    
    }
    
}

global.RegisterCollider = function (colliderAABB) {
    print ("AddAABB : " + colliderAABB);
    colliders.push(colliderAABB);
}

global.CheckForCollisions = function () {
    CheckCollisions();
}