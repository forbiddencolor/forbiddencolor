/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/knockout/knockout.d.ts" />
/// <reference path="bindinghandlers.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "Screen", "HighScores", "ScreenManager", "knockout", "jquery"], function (require, exports, Screen_1, Scores, ScreenManager, ko, $) {
    "use strict";
    var scores = new Scores.HighScoreStorage();
    var GameOverScreen = (function (_super) {
        __extends(GameOverScreen, _super);
        function GameOverScreen(engine) {
            _super.call(this, "gameoverscreen");
            this.highScores = ko.observableArray();
            this.newHighScores = ko.observableArray();
            this.score = ko.observable();
            this.isHighScore = ko.observable();
            this.name = ko.observable();
            this.engine = engine;
            this.updateHighScores();
            ko.applyBindings(this, $("#gameoverscreen")[0]);
            $("#name").on("keydown", function (e) {
                //list of functional/control keys that you want to allow always
                var keys = [8, 9, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 144, 145];
                if ($.inArray(e.keyCode, keys) === -1) {
                    if ($(this).val().length >= scores.maxNameLength) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                }
                return true;
            });
        }
        GameOverScreen.prototype.show = function () {
            this.updateHighScores();
            _super.prototype.show.call(this);
            $("#name").first().focus();
        };
        GameOverScreen.prototype.hide = function () {
            _super.prototype.hide.call(this);
        };
        GameOverScreen.prototype.updateHighScores = function () {
            var _this = this;
            this.highScores.removeAll();
            this.newHighScores.removeAll();
            var hs = scores.getHighScores();
            hs.forEach(function (e) { return _this.highScores.push(e); });
            var newhs = scores.getNewHighScores("", this.score());
            newhs.forEach(function (e) { return _this.newHighScores.push(e); });
            this.isHighScore(scores.isHighScore(this.score()));
        };
        GameOverScreen.prototype.saveScore = function () {
            if (!this.name() || this.name().length < 3) {
                return;
            }
            scores.addScore(this.name(), this.score());
            this.mainScreen();
        };
        GameOverScreen.prototype.startGame = function () {
            this.hide();
            ScreenManager.getScreen("gamescreen").show();
        };
        GameOverScreen.prototype.mainScreen = function () {
            this.hide();
            ScreenManager.getScreen("startscreen").show();
        };
        GameOverScreen.prototype.setScore = function (score) {
            this.score(score);
        };
        return GameOverScreen;
    })(Screen_1.Screen);
    exports.GameOverScreen = GameOverScreen;
});
//# sourceMappingURL=GameOverScreen.js.map