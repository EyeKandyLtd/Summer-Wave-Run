// -----JS CODE-----

//@input SceneObject levelMenu
//@input Component.Text textMessage
//@input Component.ScriptComponent buttonContinue
//


global.menuUI;


function StartMenuUI() {
    global.menuUI = script;
}
StartMenuUI();


global.ShowLevelUI = function (message, callback) {

    if (global.menuUI != null) {
        global.menuUI.script.api.Refresh(message, callback);
    } else {
        print("Error: Can find level Menu to call");
    }

}

script.api.Refresh = function (message, callback) {
    print("MenuUI() Refresh..");

    if (script.levelMenu != null) {
        print("Enabling level Menu..");
        script.levelMenu.enabled = true;
    } else {
         print("Error: Can find level Menu to refresh");
    }

    if (script.textMessage != null) {
        script.textMessage.text = message;
    } else {
         print("Error: Can find textMessage to refresh");
    }

    if (callback == null) {
        print("MenuUI() Warning: callback was null");
    } else {
        if (script.buttonContinue) {
            if (script.buttonContinue.api.SetOnClickCallback) {
                script.buttonContinue.api.SetOnClickCallback(callback);
            } else {
                print("MenuUI() Error:  Function 'buttonContinue.api.SetOnClickCallback' missing.");
            }
        }
         else {
            print("Error: MenuUI buttonContinue missing.");
        }
    }

}
