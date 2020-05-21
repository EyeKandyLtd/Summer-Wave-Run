//@input SceneObject tilter
//@input SceneObject playerCh
if(!script.tilter || !script.playerCh) // Check to prevent Studio lens failure to let you set null fields when in error
{ throw new Error("One or more fields aren't set."); return; }

var tilterTransform = script.tilter.getTransform();
var playerTransform = script.playerCh.getTransform();


/// UPDATE
// var updateEvent = script.createEvent("UpdateEvent");
// updateEvent.bind(function(eventData) {
//   //
// });

/// TAP
// var tapEvent = script.createEvent("TapEvent");
// tapEvent.bind(function(eventData) {
//     print("Tap Position: (" + eventData.getTapPosition().x + ", " + eventData.getTapPosition().y + ")");
// });

// FACE FOUND
var faceFoundEvent = script.createEvent("FaceFoundEvent");
faceFoundEvent.faceIndex = 0;
faceFoundEvent.bind(function(eventData) {
  print("Face 0 found.");
});

// FACE LOST
var faceLostEvent = script.createEvent("FaceLostEvent");
faceLostEvent.faceIndex = 0;
faceLostEvent.bind(function(){
  print("Face 0 lost.");
});



function GetHeadTiltUp() {
  return tilterTransform.up.dot(vec3.up());
}

function GetHeadTiltSide() {
  return tilterTransform.up.dot(vec3.right());
}

// --- API ---
script.api.GetHeadTiltUp = function() { return GetHeadTiltUp(); }
script.api.GetHeadTiltSide = function() { return GetHeadTiltSide(); }
