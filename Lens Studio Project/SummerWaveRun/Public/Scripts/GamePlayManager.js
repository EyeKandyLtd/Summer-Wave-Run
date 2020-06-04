
//Auth: Isaac Dart (isaac@etheria.co)
//Date: 12 July 2019.

// -----JS CODE-----
//@input Component.Camera camera
//@input Component.ScriptComponent hudController
//@input Component.ScriptComponent pfxManager
//@input Component.ScriptComponent wearablesManager
//@input Component.ScriptComponent scrollingWater
//@input Component.ScriptComponent playingCharacter

//@input Component.ScriptComponent[] levels
//@input float scorePerLevel = 100
//@input vec3 initialLevelVec 


//@input Asset.AudioTrackAsset soundIntroMusic
//@input Asset.AudioTrackAsset soundStartGame
//@input Asset.AudioTrackAsset soundStartLevel
//@input Asset.AudioTrackAsset soundLevelPassed
//@input Asset.AudioTrackAsset soundBestWin
//@input Asset.AudioTrackAsset soundMinWin
//@input Asset.AudioTrackAsset soundLowWin
//@input Asset.AudioTrackAsset soundGameFinished


//@input SceneObject[] deactiveOnStart
//@input SceneObject[] activateOnStart
//@input SceneObject[] activateOnGameEnd

//@input Component.Text frontCamTopMessage
//@input Component.Text frontCamMiddleMessage

//@input SceneObject[] unlockIfPreviouslyWon




global.gamePlayManager = script;

const scoreFactor = 2.5;

const  persistant_lastFrontMessageKey = "EK_key_lastFrontMessage";

var currLevel;

var _isInit = false;
var _isGamePlaying = false;
var _isLevelWon = false;
var _isGameFinished = false;

var _timeGameStarted = 0;
var _currLevelNumber = 0;
var _lifeCount = 3;
var _maxLives = 3;
var _highScore = 0;
var _currScore = 0;
var _scoreThisLevel = 0;
var _scorePerLevel = script.scorePerLevel;

var _currSpeed = 0;
var _distance = 0;

var _startCamPos = script.camera.getSceneObject().getTransform().getWorldPosition();
var _camDistanceFromSpeedFactor = 0.



script.createEvent("CameraFrontEvent").bind(onFrontCamEvent);
script.createEvent("CameraBackEvent").bind(onBackCamEvent);

/*
script.wearablesManager.api.onLoad = function() {
    script.wearablesManager.api.ActiveRandomWearables();
};
*/

//Tap To Start
var tapEvent = script.createEvent("TapEvent").bind(function (eventData) { 
   
    if ( !_isGamePlaying) {
        script.api.StartGameplay(); 
    }

});


global.SetContentEnabled = function(content, isEnabled) {
 for(var i = 0; i < content.length; i++)    {
        if(content[i]) content[i].enabled = isEnabled;
    }
}


function ResetVars() {

    if (script.initialLevelVec == vec3.zero) script.initialLevelVec = new vec3(0,0,-100);
    
    _isGamePlaying = false;
    _isLevelWon = false;
    
    _currLevelNumber = 0;
    _highScore = 0;
    _currScore = 0;
    _lifeCount = _maxLives;
    _distance = 0;
    _timeGameStarted = 0;
    _scoreThisLevel = 0;
    _scorePerLevel = script.scorePerLevel;
}

script.api.onLoad = function() {

    global.playAudioAsset(script.soundIntroMusic, -1, 0.05);  
}

script.api.StartGameplay = function() {
   
    
     //start game on tap..
    if (!_isGamePlaying) {
        Init();
        StartGame();
        StartLevel(_currLevelNumber);
    }
}



function Init() {
    ResetVars();

    
    global.SetContentEnabled(script.deactiveOnStart, false);
    global.SetContentEnabled(script.activateOnStart, true);

    _highScore = global.GetHighScore();
    var didWinBefore = _highScore > 0;
    global.SetContentEnabled(script.unlockIfPreviouslyWon, didWinBefore);
    
    script.frontCamTopMessage.text = "";

    _isInit = true;
    
    
     print("GamePlay Initialised, Last High Score was " + _highScore);
    
    
}


function StartGame() {
      
    StopGame();
    
    print("Starting game");

      
     global.playAudioAsset(script.soundStartGame, 1);   
    
    _timeGameStarted = getTime();
    
     script.hudController.api.SetLives(_lifeCount);     
     script.hudController.api.SetScore (Math.floor(_currScore));
    
     _isGamePlaying = true;
    _isGameFinished = false;
   // StartLevel(0);
   
    
}


var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(function(eventData) {
      
   if (_isGamePlaying) {
        
       UpdateDistanceAndScore();
        
        if (_scoreThisLevel > _scorePerLevel) {
            
            StartLevel( _currLevelNumber + 1);
            
        }
       
    } else if(_isGameFinished) {
       
        //slow down..
        if (_currSpeed > 2.5) {
            _currSpeed -=  getDeltaTime() * .003;
            UpdateSpeedVisuals(_currSpeed);
        }
    }
 
    
});



function StartLevel(level) {
    
       print("Starting level " + level);
    
    
    if (level < script.levels.length) {

        script.playingCharacter.api.DoLevelUp(level);
        
        //..spawn in end level ramp?
        if (level > 0) {
            var rampStartPos = script.camera.getSceneObject().getTransform().getWorldPosition();
            rampStartPos.y = 0;
            global.gamePlayManager.pfxManager.api.DoPFX_LevelFinalBoss(rampStartPos);
            script.wearablesManager.api.ActiveLevelWearables(level);
        }
         
         _currLevelNumber = level;
         _isLevelWon = false;
         _scoreThisLevel = 0;
                
        RefreshSpeed();
        
        StartSpawner(level);
        
         

    } else {
        //Show winning screen..
       
        //RefreshSpeed();
        var cs = currLevel.api.GetSecondsBetweenSpawns();
        cs = Math.max(0.2, cs * 0.95);
        currLevel.api.SetSecondsBetweenSpawns(cs);
        _scorePerLevel *= 1.3; // make level up longer distance
        
        script.wearablesManager.api.ActiveRandomWearables();
        
        return;
    }
    
    if (level > 0) {
        global.playAudioAsset(script.soundStartLevel, 1);   
    }

}



script.api.Lives_Increment = function() {
   
    if (_isGamePlaying) {
       if (_lifeCount < _maxLives) {
            _lifeCount++;
            script.hudController.api.SetLives(_lifeCount);            
        }
    }
}

script.api.Lives_Decrement = function() {
    print("life count " + _lifeCount);
    
    if (_isGamePlaying) {
       if (_lifeCount > 0) {
            _lifeCount--;
            script.hudController.api.SetLives(_lifeCount);            
        } else {
            DoFinishedGame();
        }
        
    }
    
}

script.api.GetCurrentSpeed = function() {
    
    return _currSpeed;
}

script.api.GetCurrentDistance = function() {
    
    
        return _distance;
    
   
}

function UpdateDistanceAndScore() {
    
     var deltaDist = getDeltaTime() * _currSpeed;
        _distance += deltaDist;
        _scoreThisLevel += deltaDist * scoreFactor;
        _currScore = _distance * scoreFactor;
        
        script.hudController.api.SetScore (Math.floor(_currScore));
    
}


function RefreshSpeed() {
    
     _currSpeed = 1 * (2 + _currLevelNumber * 0.2);
    UpdateSpeedVisuals(_currSpeed);
        
        
}

function UpdateSpeedVisuals(speed) {
    
    global.directionController3DVector = script.initialLevelVec.uniformScale(speed);
    script.scrollingWater.api.SetScrollDirection_UV2(0,-0.60 * speed);
    script.scrollingWater.api.SetScrollDirection_UV3(0,-0.18 * speed);
    
}


function StartSpawner( level) {
    
    level = Math.min(level, script.levels.length-1);
    level = Math.max(level, 0);
    
    for (i = 0; i < script.levels.length; i++) {

        var level = script.levels[i];
        var so = level.getSceneObject();
       
        if (so.enabled) {
             level.api.StopSpawning();
        }
        
        so.enabled = (i == _currLevelNumber);  
        
        if (so.enabled) {
            currLevel = level;
            level.api.SetSpawnCallback(OnObjectSpawned);
            level.api.StartSpawning();
        }
    }

}

function OnObjectSpawned(inst) {
    
    var s = inst.getFirstComponent("Component.ScriptComponent");
    
    s.api.onLoad = function() {
        s.api.UpdateDirection(global.directionController3DVector );
    };
        
}

function StopAllSpawners() {
    
    for (i = 0; i < script.levels.length; i++) {
        var level = script.levels[i];
        level.api.StopSpawning();
        level.getSceneObject().enabled = false;
    }
}






function DoFinishedGame() {


   //global.ResetHighScore(); //debug only
    print ("Game over");

    _isGameFinished = true;
    StopAllSpawners();

    global.SetContentEnabled(script.activateOnGameEnd, true);
    global.SetContentEnabled(script.activateOnStart, false);

    var score = CalcCurrentScore();
    var wasHighScore = global.TrySetHighScore(score);


    var selfieBannerMessage = "Distance: " + Math.floor(_currScore) + "!";
    global.persistentStorageSystem.store.putString(persistant_lastFrontMessageKey,selfieBannerMessage );
    script.frontCamTopMessage.text = selfieBannerMessage;
    

    
    var highScoreText = wasHighScore
    ?("New best distance of " + global.GetHighScore() + " !!!")
    :("Best ever distance: " + global.GetHighScore());
    
    script.frontCamMiddleMessage.text = highScoreText;
    
    StopGame();
    _distance = -50; // this makes the camera zoom in..
    global.playAudioAsset(script.soundGameFinished, 1);   

    

}

function StopGame() {

    ResetVars();
    //RefreshSpeed();
    //UpdateSpeedVisuals();
    _isGamePlaying = false;
    _isGameFinished = true;
    
}


function SetFrontCamTextIfPreviouslySet() {
    var frontText = global.persistentStorageSystem.store.getString(persistant_lastFrontMessageKey) || "";
    if (frontText != "") {
        script.frontCamTopMessage.text = frontText;
    }

}


function CalcCurrentScore() {

  return _currScore;
}



function GetComponentWorldPos(component) {
    return component.getSceneObject().getTransform().getWorldPosition();
}






function onFrontCamEvent() {

    //reset game if switching to front cam at the end of the game..
    if (_isGameFinished) {
        _isInit = false;
        StopGame();
        global.ResartCameraController();
    }
}

function onBackCamEvent() {

    if (_isGameFinished) {
       // _isInit = false;
    }
}





