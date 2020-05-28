// -----JS CODE-----


global.gameAudioCompoent = null;

global.playAudioAsset = function (audioAsset, loops, vol) {

    if (audioAsset == null) {
        //print("global.playAudioAsset() Error: audioAsset was null");
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
       // print("global.playAudioAsset() Playing audio at vol " + global.gameAudioCompoent.volume);

    } else {
        //print("global.playAudioAsset() Error: global.gameAudioCompoent failed to initalise..");
    }


}



global.stopAudioAsset = function (audioAsset) {

    if (audioAsset == null) {
        //print("global.stopAudioAsset() Error: audioAsset was null");
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
