
//Auth: Isaac Dart (isaac@etheria.co)
//Date: 12 July 2019.

// -----JS CODE-----
//@input Component.Camera camera
//@input Component.ScriptComponent[] levelSpawners

//@input Asset.AudioTrackAsset soundIntroMusic
//@input Asset.AudioTrackAsset soundStartGame
//@input Asset.AudioTrackAsset soundLevelPassed
//@input Asset.AudioTrackAsset soundBestWin
//@input Asset.AudioTrackAsset soundMinWin
//@input Asset.AudioTrackAsset soundLowWin


//@input Component.Text textHint
//@input Component.Text textScore
//@input string hintTapToPlace 
//@input Asset.ObjectPrefab selectedHaloPrefab
//@input SceneObject[] activateOnWin
//@input SceneObject[] deactivateOnWin
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


var tapEvent = script.createEvent("TapEvent").bind(function (eventData) { onTapEvent(eventData); });
var updateEvent = script.createEvent("LateUpdateEvent").bind(function (eventData) { onLateUpdateEvent(eventData); });

script.createEvent("CameraFrontEvent").bind(onFrontCamEvent);
script.createEvent("CameraBackEvent").bind(onBackCamEvent);




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
}

script.api.onLoad = function() {

    global.playAudioAsset(script.soundIntroMusic, -1, 0.05);  
}

//alled from Start tutorial button
script.api.StartGameplay = function() {
    Init();
}

function Init() {
    ResetVars();


    global.SetContentEnabled(script.activateOnWin, false);
    global.SetContentEnabled(script.deactivateOnWin, true);

    _highScore = global.GetHighScore();
    var didWinBefore = _highScore > 0;

    global.SetContentEnabled(script.unlockIfPreviouslyWon, didWinBefore);
    //SetFrontCamTextIfPreviouslySet();

      

    _isInit = true;
    
    hideScore();
    
     print("GamePlay Initialised, Last High Score was " + _highScore);
}


function onTapEvent(e) {

    if (global.wasSomthingHitThisFrame) return;
    
    if (!_isInit) {
        print("Error: GamePlay Not Initalised yet..");
        return;
    }


    hideHint();


    _isFindingPlayArea = false;

    //start game on tap..
    if (!_isGamePlaying) {
       
        StartLevel(_currLevel);
    }

   
}





//not working ? to confirm
function showHint(text) {
    if (script.textHint != null) {
        script.textHint.enabled = true;
        script.textHint.text.enabled = true;
        if (text != null) script.textHint.text = text;
       
    } else {
        print("Error: textHint was null");
    }
}

function hideHint() {
    if (script.textHint != null) {
        script.textHint.enabled = false;
        script.textHint.text.enabled = false;
    } else {
        print("Error: textHint was null");
    }
}



function showScore() {

    if (script.textScore != null) {
        //print("showScore(): Showing score! ");
        script.textScore.enabled = true;
        script.textScore.text.enabled = true;
        remBoxes = script.gameWorldCreatorScript.api.GetRemainingBoxes();
        var totalPairs = script.pairsPerLevel[_currLevel];
        var matchedPairs = totalPairs - remBoxes.length * 0.500000;


        var text = "Level "+(_currLevel + 1) + " - " + matchedPairs + " / " + totalPairs;
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

    if (_currLevel < script.levelSpawners.length) {
       StartSpawner();

    } else {
        //Show winning screen..
        print("You have finished the game.");
        hideScore();
        return;
    }
   
     global.playAudioAsset(script.soundStartGame, 1);   
     showScore();

    _isGamePlaying = _isWorldCreated;
}



function StartSpawner( level) {
    
    for (int i = 0; i < script.levelSpawners.length; i++) {
        script.levelSpawners[i].getSceneObject().enabled = (level == _currLevel);        
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

    _isGameFinished = true;

    global.SetContentEnabled(script.activateOnWin, true);
    global.SetContentEnabled(script.deactivateOnWin, false);

    var score = CalcCurrentScore();
    var grade = DerriveGrade(score);
    var wasHighScore = global.TrySetHighScore(score);


    var selfieBannerMessage = "Class of " + new Date().getFullYear() + "\n Grade: " + grade + "";
    global.persistentStorageSystem.store.putString(persistant_lastFrontMessageKey,selfieBannerMessage );
    script.frontCamTopMessage.text = selfieBannerMessage;


    var winTypeMessage = "have graduated.";
    if (wasHighScore) winTypeMessage = "graduated with a new high score.";

    var endOfGameMessage = "Congratulations! You " +  winTypeMessage + " Take a selfie to celebrate.\n\nFlip camera!";

    global.ShowLevelUI(endOfGameMessage, null);

    hideScore();

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




global.gameAudioCompoent = null;

global.playAudioAsset = function (audioAsset, loops, vol) {

    if (audioAsset == null) {
        print("global.playAudioAsset() Error: audioAsset was null");
        return;
    }

    if (global.gameAudioCompoent == null) {
        global.gameAudioCompoent = script.getSceneObject().createComponent("Component.AudioComponent");
    }



    if (global.gameAudioCompoent) {
       
        if (global.gameAudioCompoent.audioTrack != null && global.gameAudioCompoent.isPlaying()) {
            global.gameAudioCompoent.stop(false);
        }
       
        if (!audioAsset.isSame(global.gameAudioCompoent.audioTrack)) {
            global.gameAudioCompoent.audioTrack = audioAsset;
        }

        global.gameAudioCompoent.play(loops);

        if (vol == null) vol = 1;
        global.gameAudioCompoent.volume = vol;
        print("global.playAudioAsset() Playing audio at vol " + global.gameAudioCompoent.volume);

    } else {
        print("global.playAudioAsset() Error: global.gameAudioCompoent failed to initalise..");
    }


}



global.stopAudioAsset = function (audioAsset) {

    if (audioAsset == null) {
        print("global.stopAudioAsset() Error: audioAsset was null");
        return;
    }

    if (global.gameAudioCompoent = null) {
        return;
    }

    if (global.gameAudioCompoent.isPlaying() && audioAsset.isSame(global.gameAudioCompoent.audioTrack)) {
        global.gameAudioCompoent.stop();
    }

}

global.stopAudioAll = function () {

    if (global.gameAudioCompoent = null) {
        return;
    }

    global.gameAudioCompoent.stop();

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




