
//Auth: Isaac Dart (isaac@etheria.co)
//Date: 12 July 2019.

// -----JS CODE-----
//@input Component.Camera camera
//@input Component.ScriptComponent gameWorldCreatorScript

//@input Asset.AudioTrackAsset soundIntroMusic
//@input Asset.AudioTrackAsset soundNoMatch
//@input Asset.AudioTrackAsset soundMatch
//@input Asset.AudioTrackAsset soundStartGame
//@input Asset.AudioTrackAsset soundWonLevel
//@input int[] pairsPerLevel

//@input Component.Text textHint
//@input Component.Text textScore
//@input string hintTapToPlace 
//@input Asset.ObjectPrefab selectedHaloPrefab
//@input SceneObject[] activateOnWin
//@input SceneObject[] deactivateOnWin
//@input Component.Text frontCamTopMessage
//@input SceneObject[] unlockIfPreviouslyWon
//@input bool isContinuousAreaAdjustment = true



global.gamePlayManager = script;

global.revealtedItems = [];


global.wasSomthingHitThisFrame = false;
global.countObjectsCurrentlyManupulated = 0;
global.perspecitveGameCam = null;

global.selectedItemHalos = [];



const  persistant_lastFrontMessageKey = "gobackbig_key_lastFrontMessage";

var _isInit = false;
var _isFindingPlayArea = false;
var _isWorldCreated = false;
var _isGamePlaying = false;
var _isLevelWon = false;
var _isGameFinished = false;
var _currLevel = 0;
var _highScore = 0;
var matchFailedAttempts = [];

var absoluteCamWorldDepth = 250;

var areaSelectorPlane = null;

//var touchEvent = script.createEvent("TouchEndEvent").bind(function (eventData) { onTouchEndEvent(eventData); });
var tapEvent = script.createEvent("TapEvent").bind(function (eventData) { onTapEvent(eventData); });
var updateEvent = script.createEvent("LateUpdateEvent").bind(function (eventData) { onLateUpdateEvent(eventData); });

script.createEvent("CameraFrontEvent").bind(onFrontCamEvent);
script.createEvent("CameraBackEvent").bind(onBackCamEvent);



var lastTouchScreenPosNRM;


global.SetContentEnabled = function(content, isEnabled) {
 for(var i = 0; i < content.length; i++)    {
        if(content[i])content[i].enabled = isEnabled;
    }
}


function ResetVars() {

    _isInit = false;
    _isFindingPlayArea = false;
    _isWorldCreated = false;
    _isGamePlaying = false;
    _isLevelWon = false;
    _isGameFinished = false;
    _currLevel = 0;
    _highScore = 0;
    _currScore = 0;
    matchFailedAttempts = [];
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

    global.perspecitveGameCam = script.camera;
    global.touchSystem.touchBlocking = true;

    matchFailedAttempts = [];
    global.revealtedItems = [];

    global.SetContentEnabled(script.activateOnWin, false);
    global.SetContentEnabled(script.deactivateOnWin, true);

    _highScore = global.GetHighScore();
    var didWinBefore = _highScore > 0;

    global.SetContentEnabled(script.unlockIfPreviouslyWon, didWinBefore);
    SetFrontCamTextIfPreviouslySet();

    
    if (global.selectedItemHalos.length == 0) {
        if (script.selectedHaloPrefab != null) {
            var SelectedItem1Halo = script.selectedHaloPrefab.instantiate(script.getSceneObject());
            SelectedItem1Halo.enabled = false;
            global.selectedItemHalos.push(SelectedItem1Halo);

            var SelectedItem2Halo = script.selectedHaloPrefab.instantiate(script.getSceneObject());
            SelectedItem2Halo.enabled = false;
            global.selectedItemHalos.push(SelectedItem2Halo);
        } else {
            print("GameplayManager.Init(): Warning - selectedUIPrefab was null. ");
        }
    }
   


    //showHint(script.hintTapToPlace);

    if (areaSelectorPlane == null)   areaSelectorPlane = GetAreaSelectorInstance();

    _isInit = true;
    _isFindingPlayArea = true;
    hideScore();
    showHint(script.hintTapToPlace);


    lastTouchScreenPosNRM = new vec2(0.5, 0.5);

     print("GamePlay Initialised, Last High Score was " + _highScore);
}


function onTapEvent(e) {

    if (global.wasSomthingHitThisFrame) return;
    if (global.countObjectsCurrentlyManupulated > 0) return;
    
    if (!_isInit) {
        print("Error: GamePlay Not Initalised yet..");
        return;
    }


    //lastTouchScreenPosNRM = e.getTouchPosition(); //locked to center of screen..
     

    hideHint();


    _isFindingPlayArea = false;

    //start game on tap..
    if (!_isGamePlaying) {
        global.doEnableAreaManipulation(script.isContinuousAreaAdjustment);
        StartLevel(_currLevel);
    }

   
}



function UpdateAreaSelectorPlaneState(doShow) {

    if (areaSelectorPlane == null) {
        areaSelectorPlane = GetAreaSelectorInstance();
    }

    if (areaSelectorPlane != null) {

        if (doShow) {
            var sTrans = areaSelectorPlane.getTransform();
           
            var middleScreenWorldPosition = script.camera.screenSpaceToWorldSpace(lastTouchScreenPosNRM, absoluteCamWorldDepth);
            var camPosFloor = script.camera.getSceneObject().getTransform().getWorldPosition();
            camPosFloor.y = middleScreenWorldPosition.y;
            var sDir = camPosFloor.sub(middleScreenWorldPosition);
            var sRot = quat.lookAt(sDir, vec3.up());

            sTrans.setWorldPosition(middleScreenWorldPosition);
            sTrans.setWorldRotation(sRot);

        }
        areaSelectorPlane.enabled = doShow;

    } else {
       if (Math.random() < 0.1) print("UpdateAreaSelectorPlaneState() : No areaSelectorPlane available. ");
    }

}

function GetAreaSelectorInstance() {

    var ret = null;

    if (script.gameWorldCreatorScript && script.gameWorldCreatorScript.api.GetAreaSelector) {
        ret  = script.gameWorldCreatorScript.api.GetAreaSelector();
        if (ret == null) {
            print("GetAreaSelectorInstance() areaSelectorPlane failed to be created.");
        }

    } else {
        print("GetAreaSelector() not found on target script.");
    }

    return ret;

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
    numPairs = 2;

    StopGame();
    print("Starting level " + level);

    if (_currLevel < script.pairsPerLevel.length) {
        numPairs = script.pairsPerLevel[_currLevel];
        matchFailedAttempts.push(0);

    } else {
        //Show winning screen..
        print("You have finished the game.");
        hideScore();
        return;
    }

    _isWorldCreated = RequestCreateWorld( numPairs);
   
    if (_isWorldCreated) {
        global.playAudioAsset(script.soundStartGame, 1);   
        showScore();
    }

    _isGamePlaying = _isWorldCreated;
}



function RequestCreateWorld( numPairs) {

    var success = false;

    if (script.camera) {

       
        if (script.gameWorldCreatorScript && script.gameWorldCreatorScript.api.CreateLevel) {
            boxesCreated = script.gameWorldCreatorScript.api.CreateLevel( numPairs);
            success = boxesCreated > 0;
            print("CreateLevel made " + boxesCreated + " boxes.");
        } else {
            print("Error: Unable to call api CreateWorld. ");
        }
    } else {
        print("Error: no script camera found..");
    }
    
    return success;
}


function StopGame() {

    var success = false;

       
    if (script.gameWorldCreatorScript && script.gameWorldCreatorScript.api.ResetWorld) {
        success = (script.gameWorldCreatorScript.api.ResetWorld() );
    } else {
        print("Error: Unable to call api ResetWorld. ");
    }

    
    return success;
}



global.TryResetRevealedItems = function() {
    global.revealtedItems = [];
    if (global.selectedItemHalos.length > 0) {
        global.selectedItemHalos[0].enabled = false;
        global.selectedItemHalos[1].enabled = false;
    }
}


global.TryRegisterRevealedItem = function (item) {
    if (_isLevelWon) {
        print("Error: Trying to Register after level won.");
        return;
    }

    var id = "n/a";

    if (item.api.GetGroupID) { id = item.api.GetGroupID(); }

    if (global.revealtedItems.length >= 2) return false;

    revealtedItems.push(item);
    if (global.selectedItemHalos.length > 0) {
        var halo = global.selectedItemHalos[revealtedItems.length - 1];
        halo.getTransform().setWorldPosition(item.getTransform().getWorldPosition());
        halo.enabled = true;
    }

    return true;

}






global.CheckRevealedForAMatch = function () {
    if (_isLevelWon) return;

    print("CheckRevealedForAMatch() CurrScore: " + CalcCurrentScore());

    if (global.revealtedItems.length == 2) {

        var isMatch = false;

        if (global.revealtedItems[0].script.api.moveActive || global.revealtedItems[1].script.api.moveActive) {
            //wait for both to fully reveal
            return;
        } else if (global.revealtedItems[0].isSame(global.revealtedItems[1])) {
            TappedSameBox();

        } else {
            isMatch =
                global.revealtedItems[0].getSceneObject().name
                == global.revealtedItems[1].getSceneObject().name;
        }

        if (isMatch) {
            DoMatch(global.revealtedItems[0], global.revealtedItems[1]);
        } else {
            DoNotMatched(global.revealtedItems[0], global.revealtedItems[1]);
        }

    }

    return isMatch;
}

function DoMatch(i1, i2) {
    print("Whoo! Match found for " + i1.getSceneObject().name);
    global.playAudioAsset(script.soundMatch, 1);

    i1.api.DoExplode();
    i2.api.DoExplode();

    global.TryResetRevealedItems();

    DoCheckWin();

}


function DoNotMatched(i1, i2) {
    print("match not made for " + i1.getSceneObject().name + " and " + i2.getSceneObject().name + ". Try again!");
    global.TryResetRevealedItems();
    
    matchFailedAttempts[_currLevel] = matchFailedAttempts[_currLevel] + 1;
    print("(Failed match attempts (size "+matchFailedAttempts.length+") (level " + _currLevel + ") = " + matchFailedAttempts[_currLevel] + ")");

    boxesCurrentlyUnrevealing = 2;

    global.playAudioAsset(script.soundNoMatch, 1);
    i1.api.doReturnToInitPosition(i1.dropSpeed, function () { OnBoxHaveReCovered(); });
    i2.api.doReturnToInitPosition(i2.dropSpeed, function () { OnBoxHaveReCovered(); });
}

var boxesCurrentlyUnrevealing = 0;
function OnBoxHaveReCovered() {
    boxesCurrentlyUnrevealing--;
    if (boxesCurrentlyUnrevealing == 0) {
        print("boxes have recovered.");
    }
}

function TappedSameBox() {
    print("You tapped on the same box!");

}

function DoCheckWin() {

    _isLevelWon = false;


     if (script.gameWorldCreatorScript && script.gameWorldCreatorScript.api.GetRemainingBoxes) {
         remBoxes = script.gameWorldCreatorScript.api.GetRemainingBoxes();
         _isLevelWon = (remBoxes.length  == 0);
    } else {
        print("Error: Unable to call api GetRemainingBoxes. ");
    }

    if (_isLevelWon) {

        hideScore();

        global.playAudioAsset(script.soundWonLevel, 1);
        print("Level completed with " + matchFailedAttempts[_currLevel] + " failed attempts. ");
        _currLevel++;

        if (_currLevel < script.pairsPerLevel.length) {
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

//Auth Isaac Dart; July 2019.
function CalcCurrentScore() {

    var totalPairs = 0;
    var totalFails = 0;

    for (i = 0; i < matchFailedAttempts.length; i++) {
        totalPairs += script.pairsPerLevel[i];
        totalFails += matchFailedAttempts[i];
    }

    var score = 1 - (totalFails / (2 * totalPairs * totalPairs)); // seems fair after sacrificing some chickens

    score = Math.floor(Math.max(0.51, score ) * 100); // give them a pass at least for finishing and turn to pct

    print("CalcCurrentScore() = " + score);
    return score;
}

function DerriveGrade(pct) {

    //ref: https://en.wikipedia.org/wiki/Academic_grading_in_the_United_States

    if (pct >= 97) return "A+";
    if (pct >= 93) return "A";
    if (pct >= 90) return "A-";
    if (pct >= 87) return "B+";
    if (pct >= 83) return "B";
    if (pct >= 80) return "B-";
    if (pct >= 77) return "C+";
    if (pct >= 73) return "C";
    if (pct >= 70) return "C-";
    if (pct >= 67) return "D+";
    if (pct >= 63) return "D";
    if (pct >= 60) return "D-";

    return "F";

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




//Fake collision detection..
global.tappedClosest_callback = null;
global.closetHitDist = -1;

global.registerTapThisFrame = function (sObj, callback) {


    global.wasSomthingHitThisFrame = true;

    var camPos = GetComponentWorldPos(global.perspecitveGameCam);
    var oPos = GetComponentWorldPos(sObj);
    var oHitDist = camPos.distance(oPos);

    if (global.closetHitDist < 0 || oHitDist < global.closetHitDist) {
        global.closetHitDist = oHitDist;
        global.tappedClosest_callback = callback;
    }
}

function onLateUpdateEvent(e) {

    if (!_isInit) { return; }

    //if (!_isInit) { Init(); }

    //..call back to the closted tappped object if tap made this frame
    if (global.closetHitDist >= 0) {

        //only trigger the tap if nothing is being manipulated at the same time..
        if (global.countObjectsCurrentlyManupulated == 0) {
            global.tappedClosest_callback();
        }

        global.closetHitDist = -1;
        global.tappedClosest_callback = null;
    }

    global.wasSomthingHitThisFrame = false;


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





