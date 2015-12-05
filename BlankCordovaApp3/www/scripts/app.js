/// <reference path="typings/jquery/jquery.d.ts" />
define(["require", "exports", "Frame", "StartScreen", "ScreenManager"], function (require, exports, Frame_1, StartScreen_1, ScreenManager) {
    var App;
    (function (App) {
        function initialize() {
            document.addEventListener("deviceready", onDeviceReady, false);
        }
        App.initialize = initialize;
        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener("pause", onPause, false);
            document.addEventListener("resume", onResume, false);
            // Init engine
            // Show start screen
            var frame = new Frame_1.Frame();
            var startScreen = new StartScreen_1.StartScreen(frame);
            ScreenManager.addScreen("start", startScreen);
            startScreen.show();
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