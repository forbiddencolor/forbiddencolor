/// <reference path="typings/jquery/jquery.d.ts" />
define(["require", "exports", "Frame", "StartScreen"], function (require, exports, Frame_1, StartScreen_1) {
    var App;
    (function (App) {
        "use strict";
        function initialize() {
            document.addEventListener("deviceready", onDeviceReady, false);
        }
        App.initialize = initialize;
        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener("pause", onPause, false);
            document.addEventListener("resume", onResume, false);
            // ripple.init();
            // var scores = new Scores.HighScoreStorage();
            // scores.resetScores();
            // Init engine
            // Show start screen
            var frame = new Frame_1.Frame();
            var startScreen = new StartScreen_1.StartScreen(frame);
            startScreen.show();
            // For testing
            //var gameover = ScreenManager.getScreen("gameoverscreen") as GameOverScreen;
            //gameover.setScore(100);
            //gameover.show();
        }
        function onPause() {
            // TODO: This application has been suspended. Save application state here.
        }
        function onResume() {
            // TODO: This application has been reactivated. Restore application state here.
        }
    })(App || (App = {}));
    return App;
});
//# sourceMappingURL=app.js.map