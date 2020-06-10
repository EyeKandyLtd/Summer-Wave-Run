// -----JS CODE-----

//@input SceneObject tutorialUI
//  -- ignore input Component.Text textMessage
//@input Component.ScriptComponent buttonContinue
//


global.tutorialUI;
global.tutorialIsActive = false;


script.api.onLoad = function () {
     print("TutorialUI().onLoad called ..");
    SetTutorialUI();
}


function SetTutorialUI() {
    global.tutorialUI = script;
    global.ShowTutorialUI ("", global.HideTutorialUI);

}


script.api.Refresh = function (message, callback) {
      
    if (script.tutorialUI != null) {
        print("Enabling tutorial ..");
        script.tutorialUI.enabled = true;
    } else {
         print("Error: Can find tutorial object to refresh");
    }


    if (callback == null) {
        print("TutorialUI() Warning: callback was null");
    } else {
        if (script.buttonContinue != null) {
            if (script.buttonContinue.api.SetOnClickCallback) {
                script.buttonContinue.api.SetOnClickCallback(callback);
            } else {
                print("Error: TutorialUI SetOnClickCallback missing.");
            }
        } else {
            print("Error: TutorialUI buttonContinue missing.");
        }
    }
}


global.HideTutorialUI = function () {

    print("HideTutorialUI");
    global.tutorialIsActive = false;
    //var disableList = [];
    //disableList.push(script.tutorialUI);
    // global.SetContentEnabled(disableList, false);
    script.tutorialUI.enabled = false;

    global.gamePlayManager.api.StartGameplay();

}





global.ShowTutorialUI = function (message, callback) {

    print("TutorialUI(): ShowTutorialUI called.");

    if (global.tutorialUI != null) {
        global.tutorialUI.script.api.Refresh(message, callback);
        global.tutorialIsActive = true;
    } else {
        print("Error: Can find tutorial to call");
    }

}

