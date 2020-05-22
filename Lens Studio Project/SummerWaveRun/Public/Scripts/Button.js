
// @input SceneObject[] onClickEnable
// @input SceneObject[] onClickDisable


var callback_OnClick;

script.createEvent("TapEvent").bind(function (eventData) { onButtonTriggered(eventData); });

function onButtonTriggered(eventData) {
   
    global.wasSomthingHitThisFrame = true;
    global.SetContentEnabled(script.onClickDisable, false);
    global.SetContentEnabled(script.onClickEnable, true); 

    if (callback_OnClick) {
         print ("Button tapped and calling back")
        callback_OnClick();
    } else {
        print("Button().onButtonTriggered but had no callback");
    }
}


script.api.SetOnClickCallback = function (callback) {
    callback_OnClick = callback;
     print("script.api.SetOnClickCallback set for button named: " + script.getSceneObject().name);
}