// -----JS CODE-----

//@input float secsBeforeDestroy

var delayedEvent = script.createEvent("DelayedCallbackEvent");

delayedEvent.bind(function (eventData) {script.getSceneObject().destroy();});

delayedEvent.reset(script.secsBeforeDestroy);
