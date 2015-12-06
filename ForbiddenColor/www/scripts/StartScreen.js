/// <reference path="typings/knockout/knockout.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "Screen", "GameScreen", "HighScores", "knockout"], function (require, exports, Screen_1, GameScreen_1, Scores, ko) {
    "use strict";
    // import * as ScreenManager from "ScreenManager";
    var scores = new Scores.HighScoreStorage();
    var StartScreen = (function (_super) {
        __extends(StartScreen, _super);
        function StartScreen(engine) {
            var _this = this;
            _super.call(this, "startscreen");
            this.highScores = ko.observableArray();
            this.gameScreen = new GameScreen_1.GameScreen(engine);
            this.engine = engine;
            $("#startbutton").on("touchstart", function (e) {
                e.preventDefault();
                e.stopPropagation();
                _this.hide();
                _this.gameScreen.show();
                return true;
            });
            this.updateHighScores();
            ko.applyBindings(this, $("#startscreen")[0]);
        }
        StartScreen.prototype.show = function () {
            $("body").css("background-color", this.engine.CurrentColor.color);
            this.updateHighScores();
            _super.prototype.show.call(this);
        };
        StartScreen.prototype.hide = function () {
            _super.prototype.hide.call(this);
        };
        StartScreen.prototype.updateHighScores = function () {
            var _this = this;
            this.highScores.removeAll();
            scores.getHighScores().forEach(function (e) { return _this.highScores.push(e); });
        };
        return StartScreen;
    })(Screen_1.Screen);
    exports.StartScreen = StartScreen;
});
//# sourceMappingURL=StartScreen.js.map