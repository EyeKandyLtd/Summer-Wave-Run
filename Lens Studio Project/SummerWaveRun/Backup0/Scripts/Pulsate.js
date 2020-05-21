var initialScale;
var screenTransf;

var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind(function(eventData){
    screenTransf = script.getSceneObject().getFirstComponent("ScreenTransform");
    initialScale = screenTransf.scale;
});

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(function(eventData){
  if(typeof screenTransf === 'undefined')
  {
    screenTransf = script.getSceneObject().getFirstComponent("ScreenTransform");
    initialScale = screenTransf.scale;
  }
  screenTransf.scale = initialScale.add(vec3.one().uniformScale(0.05*Math.sin(getTime()*7.77)));
});
