
//Auth: Isaac Dart (isaac@etheria.co)
//Date: 12 July 2019.

// -----JS CODE-----
//@input Component.Camera camera
//@input Component.ScriptComponent hudController
//@input Component.ScriptComponent pfxManager
//@input Component.ScriptComponent wearablesManager
//@input Component.ScriptComponent scrollingWater

//@input Component.ScriptComponent[] levels
//@input float scorePerLevel = 200



//@input Asset.AudioTrackAsset soundIntroMusic
//@input Asset.AudioTrackAsset soundStartGame
//@input Asset.AudioTrackAsset soundStartLevel
//@input Asset.AudioTrackAsset soundLevelPassed
//@input Asset.AudioTrackAsset soundBestWin
//@input Asset.AudioTrackAsset soundMinWin
//@input Asset.AudioTrackAsset soundLowWin


//@input SceneObject[] deactiveOnStart
//@input SceneObject[] activateOnStart
//@input SceneObject[] activateOnGameEnd

//@input Component.Text frontCamTopMessage
//@input Component.Text frontCamMiddleMessage

//@input SceneObject[] unlockIfPreviouslyWon



global.gamePlayManager = script;

const scoreFactor = 5;

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

var initialLevelVec = new vec3(0,0,-100);




script.createEvent("CameraFrontEvent").bind(onFrontCamEvent);
script.createEvent("CameraBackEvent").bind(onBackCamEvent);

/*

//var updateEvent = script.createEvent("LateUpdateEvent").bind(function (eventData) { onLateUpdateEvent(eventData); });


var mouthOpenedEvent = script.createEvent("MouthOpenedEvent");
mouthOpenedEvent.faceIndex = 0;
mouthOpenedEvent.bind(function (eventData)
{
    script.api.StartGameplay();
});
*/

//Tap To Start
var tapEvent = script.createEvent("TapEvent").bind(function (eventData) { 
   
    if ( _isGameFinished) {
        Init();
    } else {
        script.api.StartGameplay(); 
    }
});


global.SetContentEnabled = function(content, isEnabled) {
 for(var i = 0; i < content.length; i++)    {
        if(content[i]) content[i].enabled = isEnabled;
    }
}


function ResetVars() {

    
    _isGamePlaying = false;
    _isLevelWon = false;
    _isGameFinished = false;
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
   // StartLevel(0);
   
    
}


var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(function(eventData) {
      
   if (_isGamePlaying) {
        
       UpdateDistanceAndScore();
        
        if (_scoreThisLevel > _scorePerLevel) {
            
            StartLevel( _currLevelNumber + 1);
            
        }
        print ("_scoreThisLevel = " + _scoreThisLevel) ;
    }
 
    
});



function StartLevel(level) {
    
       print("Starting level " + level);
    
    
    if (level < script.levels.length) {
       
        //..spawn in end level ramp?
        if (level > 0) {
            var rampStartPos = script.camera.getSceneObject().getTransform().getWorldPosition();
            rampStartPos.y = 0;
            global.gamePlayManager.pfxManager.api.DoPFX_LevelFinalBoss(rampStartPos);
        }
         
         _currLevelNumber = level;
         _isLevelWon = false;
         _scoreThisLevel = 0;
                
        RefreshSpeed();
        
        StartSpawner(level);
        
         script.wearablesManager.api.ActiveLevelWearables(level);

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

function UpdateDistanceAndScore() {
    
     var deltaDist = getDeltaTime() * _currSpeed;
        _distance += deltaDist;
        _scoreThisLevel += deltaDist * scoreFactor;
        _currScore = _distance * scoreFactor;
        
        script.hudController.api.SetScore (Math.floor(_currScore));
    
}


function RefreshSpeed() {
    
        _currSpeed = 1.5 * (1 + _currLevelNumber * 0.4);
        global.directionController3DVector = initialLevelVec.uniformScale(_currSpeed);
        script.scrollingWater.api.SetScrollDirection_UV2(0,-0.40 * _currSpeed);
        script.scrollingWater.api.SetScrollDirection_UV3(0,-0.12 * _currSpeed);
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






function DoMatch(i1, i2) {
    print("Whoo! Match found for " + i1.getSceneObject().name);
    global.playAudioAsset(script.soundMatch, 1);

    i1.api.DoExplode();
    i2.api.DoExplode();

    global.TryResetRevealedItems();

    DoCheckWin();

}



function DoCheckWin() {

    _isLevelWon = false;

    //TODO: check if level one

    if (_isLevelWon) {


        global.playAudioAsset(script.soundWonLevel, 1);
        print("Level completed");
        _currLevelNumber++;

        if (_currLevelNumber < script.levelSpawners.length) {
            winMsg = "Nice job! Let’s make this a little harder. Get ready for level " + (_currLevelNumber + 1) + "!";
            global.ShowLevelUI(winMsg, StartCurrentLevel);
        } else {
            DoFinishedGame();
        }

    } else {
        showScore();
    }

    return _isLevelWon;
}

function StartCurrentLevel() {
    StartLevel(_currLevelNumber);

}


function DoFinishedGame() {


   //global.ResetHighScore(); //debug only
    print ("Game over");

    _isGameFinished = true;
    StopAllSpawners();

    global.SetContentEnabled(script.activateOnGameEnd, true);
    global.SetContentEnabled(script.activateOnStart, false);

    var score = CalcCurrentScore();
    var grade = DerriveGrade(score);
    var wasHighScore = global.TrySetHighScore(score);


    var selfieBannerMessage = "Jet Ski Distance " + "\n " + Math.floor(_currScore) + "!";
    global.persistentStorageSystem.store.putString(persistant_lastFrontMessageKey,selfieBannerMessage );
    script.frontCamTopMessage.text = selfieBannerMessage;
    

    
    var highScoreText = wasHighScore
    ?("New high score!!! \n " + global.GetHighScore() + " !!!")
    :("Highscore: " + global.GetHighScore());
    
    script.frontCamMiddleMessage.text = highScoreText;
    
    StopGame();


}

function StopGame() {

    ResetVars();
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

function DerriveGrade(pct) {

    //ref: https://en.wikipedia.org/wiki/Academic_grading_in_the_United_States

    return "TODO: DerriveGrade";

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





