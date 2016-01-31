/// <reference path="typings/jquery/jquery.d.ts" />

import * as $ from "jquery";
import {Frame} from "Frame";
import {StartScreen} from "StartScreen";
import {GameOverScreen} from "GameOverScreen";
import * as ScreenManager from "ScreenManager";
import * as ripple from "ripple";

module App {

    "use strict";

    export function initialize(): void {
        document.addEventListener("deviceready", onDeviceReady, false);
    }

    function onDeviceReady(): void {
        // Handle the Cordova pause and resume events
        document.addEventListener("pause", onPause, false);
        document.addEventListener("resume", onResume, false);

        // ripple.init();

        // Init engine
        // Show start screen
        var frame = new Frame();
        var startScreen = new StartScreen(frame);
        startScreen.show();
        
        // For testing
        //var gameover = ScreenManager.getScreen("gameoverscreen") as GameOverScreen;
        //gameover.setScore(100);
        //gameover.show();
    }

    function onPause(): void {
        // TODO: This application has been suspended. Save application state here.
    }

    function onResume(): void {
        // TODO: This application has been reactivated. Restore application state here.
    }

}

export = App;