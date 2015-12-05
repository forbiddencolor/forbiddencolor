/// <reference path="typings/jquery/jquery.d.ts" />

import {Frame} from "Frame";
import * as $ from "jquery";
import {StartScreen} from "StartScreen";
import {GameOverScreen} from "GameOverScreen";
import * as ScreenManager from "ScreenManager";
import {HighScoreStorage} from "HighScores";

var scores = new HighScoreStorage();

module App {
    export function initialize() {
        document.addEventListener("deviceready", onDeviceReady, false);
    }

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener("pause", onPause, false);
        document.addEventListener("resume", onResume, false);
        
        // Init engine
        // Show start screen
        var frame = new Frame();
        var startScreen = new StartScreen(frame);
        ScreenManager.addScreen("start", startScreen);
        startScreen.show();

        // for testing
        //var go = new GameOverScreen(frame);
        //ScreenManager.addScreen("gameover", go);
        //go.score(1);
        //go.show();
    }

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    }

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    }

}

export = App;