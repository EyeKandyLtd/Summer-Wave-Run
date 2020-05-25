
//Auth: Isaac Dart (isaac@etheria.co)
//Date: 12 July 2019.

// -----JS CODE-----
//@input Component.Camera camera
//@input Component.ScriptComponent hudController

//@input Component.ScriptComponent[] levels

//@input Asset.AudioTrackAsset soundIntroMusic
//@input Asset.AudioTrackAsset soundStartGame
//@input Asset.AudioTrackAsset soundLevelPassed
//@input Asset.AudioTrackAsset soundBestWin
//@input Asset.AudioTrackAsset soundMinWin
//@input Asset.AudioTrackAsset soundLowWin


//@input Component.Text textHint
//@input Component.Text textScore
//@input Asset.ObjectPrefab selectedHaloPrefab

//@input SceneObject[] deactiveOnStart
//@input SceneObject[] activateOnStart
//@input SceneObject[] activateOnGameEnd

//@input Component.Text frontCamTopMessage
//@input SceneObject[] unlockIfPreviouslyWon



global.gamePlayManager = script;




const  persistant_lastFrontMessageKey = "EK_key_lastFrontMessage";

var _isInit = false;

var _isGamePlaying = false;
var _isLevelWon = false;
var _isGameFinished = false;
var _currLevel = 0;
var _highScore = 0;
var _currScore = 0;
var _lifeCount = 3;
var _maxLives = 3;
var currLevel;
var _distance = 0;
var _timeGameStarted = 0;

var tapEvent = script.createEvent("TapEvent").bind(function (eventData) { onTapEvent(eventData); });
//var updateEvent = script.createEvent("LateUpdateEvent").bind(function (eventData) { onLateUpdateEvent(eventData); });

script.createEvent("CameraFrontEvent").bind(onFrontCamEvent);
script.createEvent("CameraBackEvent").bind(onBackCamEvent);

var mouthOpenedEvent = script.createEvent("MouthOpenedEvent");
mouthOpenedEvent.faceIndex = 0;
mouthOpenedEvent.bind(function (eventData)
{
    script.api.StartGameplay();
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
    _currLevel = 0;
    _highScore = 0;
    _currScore = 0;
    _lifeCount = _maxLives;
    _distance = 0;
    _timeGameStarted = 0;
}

script.api.onLoad = function() {

    global.playAudioAsset(script.soundIntroMusic, -1, 0.05);  
}

script.api.StartGameplay = function() {
   
    
     //start game on tap..
    if (!_isGamePlaying) {
        Init();
        StartLevel(_currLevel);
    }
}

function Init() {
    ResetVars();

    
    global.SetContentEnabled(script.deactiveOnStart, false);
    global.SetContentEnabled(script.activateOnStart, true);

    _highScore = global.GetHighScore();
    var didWinBefore = _highScore > 0;

    global.SetContentEnabled(script.unlockIfPreviouslyWon, didWinBefore);
    //SetFrontCamTextIfPreviouslySet();

      

    _isInit = true;
    
    hideScore();
    
     print("GamePlay Initialised, Last High Score was " + _highScore);
    
    
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

var updateEvent = script.createEvent("UpdateEvent");
updateEvent.bind(function(eventData) {
      
   if (_isGamePlaying) {
        var d = Math.floor((getTime() - _timeGameStarted) * 7 * (1+_currLevel)) ;
        _distance = d;
        
        script.hudController.api.SetScore (_distance);
    }
 
    
});







function showScore() {

    if (script.textScore != null) {
        //print("showScore(): Showing score! ");
        script.textScore.enabled = true;
        script.textScore.text.enabled = true;
       

        var text = "Level "+(_currLevel + 1) 
        script.textScore.text = text;

    } else {
        print("showScore(): Error textScore was null");
    }
}


function hideScore() {
    if (script.textScore != null) {
         print("showScore(): Hiding score! ");
        script.textScore.text.enabled = false;
        script.textScore.enabled = false;
    } else {
        print("hideScore(): Error textScore was null");
    }
}



function StartLevel(level) {

    _currLevel = level;
    _isLevelWon = false;
   

    StopGame();
    print("Starting level " + level);

    if (_currLevel < script.levels.length) {
       StartSpawner(level);

    } else {
        //Show winning screen..
        print("You have finished the game.");
        hideScore();
        return;
    }
   
     global.playAudioAsset(script.soundStartGame, 1);   
     showScore();

    _timeGameStarted = getTime();
    _isGamePlaying = true;
}




function StartSpawner( level) {
    
    for (i = 0; i < script.levels.length; i++) {

        var level = script.levels[i];
        var so = level.getSceneObject();
       
        if (so.enabled) {
             level.api.StopSpawning();
        }
        
        so.enabled = (i == _currLevel);  
        
        if (so.enabled) {
            currLevel = level;
            level.api.StartSpawning();
        }
    }

}


function StopGame() {

    var success = false;

       /*
    if (script.gameWorldCreatorScript && script.gameWorldCreatorScript.api.ResetWorld) {
        success = (script.gameWorldCreatorScript.api.ResetWorld() );
    } else {
        print("Error: Unable to call api ResetWorld. ");
    }
    */
    
    return success;
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

        hideScore();

        global.playAudioAsset(script.soundWonLevel, 1);
        print("Level completed");
        _currLevel++;

        if (_currLevel < script.levelSpawners.length) {
            winMsg = "Nice job! Let’s make this a little harder. Get ready for level " + (_currLevel + 1) + "!";
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
    StartLevel(_currLevel);

}


function DoFinishedGame() {


    //global.ResetHighScore(); //debug only
    print ("Game over");

    _isGameFinished = true;
    currLevel.api.StopSpawning();

       global.SetContentEnabled(script.activateOnGameEnd, true);
    global.SetContentEnabled(script.activateOnStart, false);

    var score = CalcCurrentScore();
    var grade = DerriveGrade(score);
    var wasHighScore = global.TrySetHighScore(score);


    var selfieBannerMessage = "Jet Ski Distance " + "\n " + _distance + "";
    global.persistentStorageSystem.store.putString(persistant_lastFrontMessageKey,selfieBannerMessage );
    script.frontCamTopMessage.text = selfieBannerMessage;
    


    var winTypeMessage = "have graduated.";
    if (wasHighScore) winTypeMessage = "graduated with a new high score.";

    var endOfGameMessage = "Congratulations! You " +  winTypeMessage + " Take a selfie to celebrate.\n\nFlip camera!";
    


    //global.ShowLevelUI(endOfGameMessage, null);

    //hideScore();

    /*
    var userCity = "";
    global.userContextSystem.requestCity(function(city) {
        userCity = city;
        });
    */

}

function SetFrontCamTextIfPreviouslySet() {
    var frontText = global.persistentStorageSystem.store.getString(persistant_lastFrontMessageKey) || "";
    if (frontText != "") {
        script.frontCamTopMessage.text = frontText;
    }

}


function CalcCurrentScore() {

  var score = 999;

    print("CalcCurrentScore() = " + score);
    return score;
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





