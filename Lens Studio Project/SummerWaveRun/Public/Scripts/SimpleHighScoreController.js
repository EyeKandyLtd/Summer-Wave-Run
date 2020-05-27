

// Define the key which the persistent storage system will use to save the data to
const highScoreKey = "gobackbig_key_high_score";

//if heighest score recorded, set it and return true; else return false
global.TrySetHighScore = function (currentScore) {

    if( currentScore > global.GetHighScore() ) {
       global.persistentStorageSystem.store.putFloat(highScoreKey, currentScore);
        return true;
    }
    return false;
}

global.GetHighScore = function() {
    return global.persistentStorageSystem.store.getFloat(highScoreKey) || 0;
}

global.ResetHighScore = function () {
    global.persistentStorageSystem.store.putFloat(highScoreKey, 0);
}
