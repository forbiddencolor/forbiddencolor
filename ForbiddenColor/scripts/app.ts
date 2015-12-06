/// <reference path="typings/jquery/jquery.d.ts" />

import {Frame} from "Frame";
import {StartScreen} from "StartScreen";
import * as ScreenManager from "ScreenManager";

module App {

    "use strict";

    export function initialize(): void {
        document.addEventListener("deviceready", onDeviceReady, false);
    }

    function onDeviceReady(): void {
        // Handle the Cordova pause and resume events
        document.addEventListener("pause", onPause, false);
        document.addEventListener("resume", onResume, false);

        // Init engine
        // Show start screen
        var frame = new Frame();
        var startScreen = new StartScreen(frame);
        startScreen.show();

        // for testing
        //var go = new GameOverScreen(frame);
        //ScreenManager.addScreen("gameover", go);
        //go.score(1);
        //go.show();
    }

    function onPause(): void {
        // TODO: This application has been suspended. Save application state here.
    }

    function onResume(): void {
        // TODO: This application has been reactivated. Restore application state here.
    }

}

export = App;