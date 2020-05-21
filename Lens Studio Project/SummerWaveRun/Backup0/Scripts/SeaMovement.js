// -----JS CODE-----
//@input Component.ScreenTransform seaFront
//@input Component.ScreenTransform seaBack
if(!script.seaFront || !script.seaBack)
{ throw new Error("One or more fields aren't set."); return; }

var updateEvent = script.createEvent("UpdateEvent");

updateEvent.bind(function(eventData) {
  var t = getTime();
  var seaFrontPos = script.seaFront.position;
  var seaBackPos = script.seaBack.position;
  seaFrontPos.x = Math.sin(t);
  seaBackPos.x = Math.sin(t+1.0);
  script.seaFront.position = seaFrontPos;
  script.seaBack.position = seaBackPos;
});
