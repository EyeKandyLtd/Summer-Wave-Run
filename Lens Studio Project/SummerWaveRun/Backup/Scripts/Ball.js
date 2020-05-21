//@input Component.ScreenRegionComponent scrRegion
//@input Component.ScreenTransform playerScrTransf
//@input float initialSpeed = 1.0 {"widget":"slider", "min":1.0, "max":50.0}
//@input Component.Camera orthoCamera
//@input Component.AudioComponent bounceAudio
//@input Component.AudioComponent splashAudio

if(!script.scrRegion || !script.playerScrTransf)
{ throw new Error("One or more fields aren't set."); return; }

var speed = script.initialSpeed;
var initialPosition;
var rotationSpeed = 0.1;
var torque = quat.fromEulerAngles(0.0,0.0,0.1);
var velocity = new vec2(0.4*(Math.random()*2.0-1.0), 1.0).normalize();
var screenTransf = script.getSceneObject().getFirstComponent("ScreenTransform");
var playingChar = script.playerScrTransf.getSceneObject().getFirstComponent("ScriptComponent");

var event = script.createEvent("TurnOnEvent");
event.bind(function (eventData)
{
  initialPosition = screenTransf.position;
});

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(function(){
  if(global.gameState != global.GAMESTATE.PLAYING)
    return;

  screenTransf.position = MoveAndBounce(screenTransf.position, velocity);
  screenTransf.rotation = Rotate(screenTransf.rotation);
});

function MoveAndBounce(_position, _velocity) {
  var dt = getDeltaTime();
  var bpos = _position;
  var sqDistFromPlayer = sqrDistance(_position, script.playerScrTransf.position);

  bpos.x += _velocity.x * dt * speed;
  bpos.y += _velocity.y * dt * speed;

  var scrPos = script.orthoCamera.worldSpaceToScreenSpace(bpos);

  if(scrPos.x > 0.9 && velocity.x > 0) {
    velocity.x = -velocity.x;
    torque = torque.invert();
  }
  else if(scrPos.x < 0.1 && velocity.x < 0)
  {
    velocity.x = -velocity.x;
    torque = torque.invert();
  }

  if(scrPos.y > 0.9 && velocity.y < 0) {
    velocity.y = -velocity.y;
    // torque = torque.invert(); // not needed
  }
  else if(scrPos.y < 0.1 && velocity.y > 0)
  {
    velocity.y = -velocity.y;
    torque = torque.invert();
  }

  if(scrPos.y > 0.9)
  {
    // GAME OVER CONDITION
    script.splashAudio.play(1);
    GameOver();
  }

  // Bounce on Player
  if(sqDistFromPlayer <= 3) {
    if(velocity.y < 0) {
      // randomize velocity balancing X and Y components so that the ball never goes into too horiontal trajectories
      velocity = new vec2(playingChar.api.GetFacingDirection()*(Math.random()*0.5), 1.0).normalize(); // TODO!! Better bouncing on the player
      speed += 0.125;
      script.bounceAudio.play(1);
      IncreaseScore();
      UpdateScoreUI();
    }
  }

  return bpos;
}

function Rotate(_rotation)
{
  return _rotation.multiply(torque);
}

function sqrDistance(_v1, _v2) {
  return (_v1.x - _v2.x)*(_v1.x - _v2.x)+(_v1.y - _v2.y)*(_v1.y - _v2.y)+(_v1.z - _v2.z)*(_v1.z - _v2.z);
}

function ResetPositionToInitial()
{
  screenTransf.position = initialPosition;
}

script.api.Reset = function(){
  ResetPositionToInitial();
  velocity = new vec2(0.4*(Math.random()*2.0-1.0), 1.0).normalize();
  speed = script.initialSpeed;
};
