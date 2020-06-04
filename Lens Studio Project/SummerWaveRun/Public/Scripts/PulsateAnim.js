//@input float amps = 4
//@input float sinFloor = -1
//@input float sinCeiling = 1
//@input float amplitudeFactor = 0.5    


var ampSize = script.maxScalar=script.minScalar;

 var transform = script.getTransform();
 var initialScale = transform.getLocalScale();

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(function(eventData){
  
    var scalar = Math.sin(getTime()*script.amps) ;
    scalar = Math.min(Math.max(scalar, script.sinFloor), script.sinCeiling);
    scalar *= script.amplitudeFactor;
    var newScale = vec3.one().uniformScale(scalar);
   //print("scalar: " + scalar);
  transform.setLocalScale(initialScale.add(newScale));
    
});
