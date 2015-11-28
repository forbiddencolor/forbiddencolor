var BlankCordovaApp3;
(function (BlankCordovaApp3) {
    "use strict";
    var LiteEvent = (function () {
        function LiteEvent() {
            this.handlers = [];
        }
        LiteEvent.prototype.on = function (handler) {
            this.handlers.push(handler);
        };
        LiteEvent.prototype.off = function (handler) {
            this.handlers = this.handlers.filter(function (h) { return h !== handler; });
        };
        LiteEvent.prototype.trigger = function (data) {
            this.handlers.slice(0).forEach(function (h) { return h(data); });
        };
        return LiteEvent;
    })();
    var NextFrameEventArgs = (function () {
        function NextFrameEventArgs(correct) {
            this.Correct = correct;
        }
        return NextFrameEventArgs;
    })();
    var TimeBonusEventArgs = (function () {
        function TimeBonusEventArgs(extraTime) {
            this.ExtraTime = extraTime;
        }
        return TimeBonusEventArgs;
    })();
    var GameEndedEventArgs = (function () {
        function GameEndedEventArgs(score) {
            this.Score = score;
        }
        return GameEndedEventArgs;
    })();
    var GameStartedEventArgs = (function () {
        function GameStartedEventArgs() {
        }
        return GameStartedEventArgs;
    })();
    var TimerUpdatedEventArgs = (function () {
        function TimerUpdatedEventArgs() {
        }
        return TimerUpdatedEventArgs;
    })();
    var Frame = (function () {
        function Frame() {
            this.onNextFrame = new LiteEvent();
            this.onTimeBonus = new LiteEvent();
            this.onGameStarted = new LiteEvent();
            this.onGameEnded = new LiteEvent();
            this.onTimerUpdated = new LiteEvent();
            this.PossibleColors = [
                "#FFFF00",
                "#FF7F00",
                "#AA2AFF",
                "#00CC00",
                "#FF0000",
                "#002AFF",
                "#FF55FF" // pink
            ];
            this.CurrentColor = this.pickColor();
            // this.ForbiddenColor = "#FF0000";
            this.Score = 0;
            this.TimeLeft = 0;
        }
        Object.defineProperty(Frame.prototype, "NextFrame", {
            get: function () { return this.onNextFrame; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Frame.prototype, "TimeBonus", {
            get: function () { return this.onTimeBonus; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Frame.prototype, "GameStarted", {
            get: function () { return this.onGameStarted; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Frame.prototype, "GameEnded", {
            get: function () { return this.onGameEnded; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Frame.prototype, "TimerUpdated", {
            get: function () { return this.onTimerUpdated; },
            enumerable: true,
            configurable: true
        });
        Frame.prototype.start = function () {
            var _this = this;
            if (this.Started)
                return;
            this.CurrentStreak = 0;
            this.Score = 0;
            this.TimeLeft = 10;
            this.CurrentColor = this.pickColor();
            this.ForbiddenColor = "#FF0000";
            this.CurrentColor = this.pickColor();
            this._interval = setInterval(function () { _this.updateInterval(); }, 100);
            this.onGameStarted.trigger(new GameStartedEventArgs());
        };
        Frame.prototype.endGame = function () {
            var score = this.Score;
            this.TimeLeft = 0;
            clearInterval(this._interval);
            this.Started = false;
            this.onGameEnded.trigger(new GameEndedEventArgs(score));
        };
        Frame.prototype.swipe = function () {
            if (!this.Started)
                return;
            if (this.CurrentColor === this.ForbiddenColor) {
                this.success();
            }
            else {
                this.missClick();
            }
            this.CurrentColor = this.pickColor();
        };
        Frame.prototype.tap = function () {
            if (!this.Started)
                return;
            if (this.CurrentColor === this.ForbiddenColor) {
                this.missClick();
            }
            else {
                this.success();
            }
            this.CurrentColor = this.pickColor();
        };
        Frame.prototype.success = function () {
            this.Score++;
            this.CurrentStreak++;
            if (this.CurrentStreak % 5 === 0) {
                this.TimeLeft += 1;
                this.onTimeBonus.trigger(new TimeBonusEventArgs(1));
            }
            this.onNextFrame.trigger(new NextFrameEventArgs(true));
        };
        Frame.prototype.missClick = function () {
            this.Score = 0;
            this.CurrentStreak = 0;
            this.onNextFrame.trigger(new NextFrameEventArgs(false));
        };
        Frame.prototype.pickColor = function () {
            return this.PossibleColors[Math.floor((Math.random() * this.PossibleColors.length) + 1)];
        };
        Frame.prototype.updateInterval = function () {
            this.Started = true;
            this.TimeLeft -= 0.1;
            if (this.TimeLeft <= 0) {
                this.endGame();
                return;
            }
            this.onTimerUpdated.trigger(new TimerUpdatedEventArgs());
        };
        return Frame;
    })();
    var Application;
    (function (Application) {
        function initialize() {
            document.addEventListener("deviceready", onDeviceReady, false);
        }
        Application.initialize = initialize;
        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener("pause", onPause, false);
            document.addEventListener("resume", onResume, false);
            var popupmesssagedelay = 750;
            var frame = new Frame();
            $("body").css("background-color", frame.CurrentColor);
            $("#score > span").text(frame.Score);
            // $("#timer > span").text(frame.TimeLeft);
            $("body").on("click", function (e) {
                frame.tap();
                $("body").css("background-color", frame.CurrentColor);
                $("#score > span").text(frame.Score);
            });
            $("body").on("swipeone swipetwo", function (e) {
                frame.swipe();
                $("body").css("background-color", frame.CurrentColor);
                $("#score > span").text(frame.Score);
            });
            $("#startbutton").on("click", function (e) {
                frame.start();
            });
            frame.TimeBonus.on(function (x) {
                $("#timebonus .message > span").text("+" + x.ExtraTime);
                $("#timebonus").css("display", "block");
                $("#timebonus").addClass("animated bounceIn");
                setTimeout(function () {
                    $("#timebonus").css("display", "none");
                }, popupmesssagedelay);
            });
            frame.NextFrame.on(function (x) {
                $("#score > span").text(frame.Score);
                if (x.Correct) {
                    $("#plusscore > span").text("+1");
                    $("#plusscore").css("display", "block");
                    $("#plusscore").addClass("animated fadeOutDown");
                    setTimeout(function () {
                        $("#plusscore").css("display", "none");
                    }, popupmesssagedelay);
                }
                else {
                    $("#oops").css("display", "block");
                    $("#oops").addClass("animated bounceIn");
                    setTimeout(function () {
                        $("#oops").css("display", "none");
                    }, popupmesssagedelay);
                }
            });
            frame.GameStarted.on(function (e) {
                $("#timer > span").text(frame.TimeLeft);
                $("#startbutton").hide();
            });
            frame.GameEnded.on(function (e) {
                $("#timer > span").text(frame.TimeLeft);
                $("#startbutton").show();
            });
            frame.TimerUpdated.on(function (e) {
                if (frame.TimeLeft < 1) {
                    $("#timer > span").text(frame.TimeLeft.toFixed(1));
                }
                else {
                    $("#timer > span").text(frame.TimeLeft.toFixed(0));
                }
            });
        }
        function onPause() {
            // TODO: This application has been suspended. Save application state here.
        }
        function onResume() {
            // TODO: This application has been reactivated. Restore application state here.
        }
    })(Application = BlankCordovaApp3.Application || (BlankCordovaApp3.Application = {}));
    window.onload = function () {
        Application.initialize();
    };
})(BlankCordovaApp3 || (BlankCordovaApp3 = {}));
//# sourceMappingURL=appBundle.js.map