var animationMixer;
var animTimer = 4;

var turnOnEvent = script.createEvent("TurnOnEvent");
turnOnEvent.bind(function (eventData)
{
  animationMixer = script.getSceneObject().getFirstComponent("Component.AnimationMixer"); // this is undefined if the SceneObject starts as disabled
});

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(function(){

  // skip if this object is not enabled
  if(!script.getSceneObject().enabled)
    return;

  var dt = getDeltaTime();
  animTimer -= dt;
  if(animTimer <= 0)
  {
    animTimer = 5 + Math.random() * 5;
    PlayRightEarAnim();
  }
});

function PlayRightEarAnim()
{
  if(typeof animationMixer === 'undefined') // check as it might be undefined if the animationMixer's owner (ScneeObject) starts as disabled.
    animationMixer = script.getSceneObject().getFirstComponent("Component.AnimationMixer"); // set it if null
  if(Math.random() > 0.5)
    animationMixer.start("RightEarAnim", 0, (Math.random() > 0.1)?1:2);
  else
    animationMixer.start("LeftEarAnim", 0, (Math.random() > 0.1)?1:2);
  //animationMixer.getLayers().forEach(function(_v, _idx) { _v.start(0,2); }); //{print(""+_v.name+" - durat.:" + print( _v.isPlaying() ));});
}
