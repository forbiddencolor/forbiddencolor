/// <reference path="typings/jquery.ripples/jquery.ripples.d.ts" />
define(["require", "exports", './LiteEvents'], function (require, exports, LiteEvents_1) {
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
    var CountDownEventArgs = (function () {
        function CountDownEventArgs(countDown) {
            this.CountDown = countDown;
        }
        return CountDownEventArgs;
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
    var Color = (function () {
        function Color() {
        }
        return Color;
    })();
    var Frame = (function () {
        function Frame() {
            this.onNextFrame = new LiteEvents_1.LiteEvent();
            this.onTimeBonus = new LiteEvents_1.LiteEvent();
            this.onGameStarted = new LiteEvents_1.LiteEvent();
            this.onGameEnded = new LiteEvents_1.LiteEvent();
            this.onTimerUpdated = new LiteEvents_1.LiteEvent();
            this.onCountDown = new LiteEvents_1.LiteEvent();
            this.PossibleColors = [
                { color: "#10E5E5", name: "Cyan" },
                { color: "#FF7F00", name: "Orange" },
                { color: "#AA2AFF", name: "Purple" },
                { color: "#00CC00", name: "Green" },
                { color: "#FF0000", name: "Red" },
                { color: "#002AFF", name: "Blue" },
                { color: "#FF55FF", name: "Pink" } // pink
            ];
            this.CurrentColor = this.pickColor();
            this.ForbiddenColor = this.CurrentColor;
            this.CurrentStreak = 0;
            this.CountDown = 0;
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
        Object.defineProperty(Frame.prototype, "CountDownUpdated", {
            get: function () { return this.onCountDown; },
            enumerable: true,
            configurable: true
        });
        Frame.prototype.start = function () {
            var _this = this;
            if (this.IsStarted)
                return;
            this.CurrentStreak = 0;
            this.Score = 0;
            this.TimeLeft = 10;
            this.ForbiddenColor = this.pickColor();
            this.CurrentColor = this.ForbiddenColor;
            this.CountDown = 2;
            if (this._countdownInterval) {
                clearInterval(this._countdownInterval);
            }
            if (this._interval) {
                clearInterval(this._interval);
            }
            this._countdownInterval = setInterval(function () {
                _this.CountDown -= 1;
                if (_this.CountDown <= 0) {
                    clearInterval(_this._countdownInterval);
                    _this.CurrentColor = _this.pickColor();
                    _this._interval = setInterval(function () { _this.updateInterval(); }, 100);
                }
                _this.onCountDown.trigger(new CountDownEventArgs(_this.CountDown));
            }, 1000);
            this.onGameStarted.trigger(new GameStartedEventArgs());
            this.onCountDown.trigger(new CountDownEventArgs(this.CountDown));
        };
        Frame.prototype.endGame = function () {
            var score = this.Score;
            this.TimeLeft = 0;
            clearInterval(this._interval);
            this.IsStarted = false;
            this.onGameEnded.trigger(new GameEndedEventArgs(score));
        };
        Frame.prototype.swipe = function () {
            if (!this.IsStarted)
                return;
            if (this.CurrentColor === this.ForbiddenColor) {
                this.success();
            }
            else {
                this.missClick();
            }
        };
        Frame.prototype.tap = function () {
            if (!this.IsStarted)
                return;
            if (this.CurrentColor === this.ForbiddenColor) {
                this.missClick();
            }
            else {
                this.success();
            }
        };
        Frame.prototype.pickColor = function () {
            var num = Math.floor((Math.random() * this.PossibleColors.length));
            var color = this.PossibleColors[num];
            return color;
        };
        Frame.prototype.success = function () {
            this.Score++;
            this.CurrentStreak++;
            if (this.CurrentStreak % 5 === 0) {
                this.TimeLeft += 1;
                this.onTimeBonus.trigger(new TimeBonusEventArgs(1));
            }
            this.CurrentColor = this.pickColor();
            this.onNextFrame.trigger(new NextFrameEventArgs(true));
        };
        Frame.prototype.missClick = function () {
            this.Score = 0;
            this.CurrentStreak = 0;
            this.CurrentColor = this.pickColor();
            this.onNextFrame.trigger(new NextFrameEventArgs(false));
        };
        Frame.prototype.updateInterval = function () {
            this.IsStarted = true;
            this.TimeLeft -= 0.1;
            if (this.TimeLeft <= 0) {
                this.endGame();
                return;
            }
            this.onTimerUpdated.trigger(new TimerUpdatedEventArgs());
        };
        return Frame;
    })();
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
            var popupmesssagedelay = 750;
            var frame = new Frame();
            $("body").css("background-color", frame.CurrentColor.color);
            $("#score > span").text(frame.Score);
            // $("#timer > span").text(frame.TimeLeft);
            $("body").on("click", function (e) {
                if (frame.IsStarted) {
                }
            });
            $("body").on("swipemove", function (event, args) {
                if (!frame.IsStarted)
                    return;
                var clientX = args.originalEvent.clientX;
                var clientY = args.originalEvent.clientY;
                if (args.delta[0].moved > 5) {
                    $('body').ripples("drop", clientX, clientY, 10, 0.04);
                    $('body').ripples("drop", clientX, clientY, 13, 0.06);
                }
            });
            $("body").on("click swipeone swipetwo", function (e) {
                if (!frame.IsStarted)
                    return;
                if (e.type === "click") {
                    frame.tap();
                }
                else {
                    frame.swipe();
                }
                $('body').ripples("drop", e.clientX, e.clientY, 10, 0.04);
                $('body').ripples("drop", e.clientX, e.clientY, 13, 0.06);
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
                $("body").css("background-color", frame.CurrentColor.color);
            });
            frame.GameStarted.on(function (e) {
                $("#score > span").text(frame.Score);
                $("#timer > span").text(frame.TimeLeft);
                $("body").css("background-color", frame.CurrentColor.color);
                $("#startscreen").hide();
                $("#currentforbiddencolor").html("" + frame.CurrentColor.name);
            });
            frame.GameEnded.on(function (e) {
                $("#score > span").text(frame.Score);
                $("#timer > span").text(frame.TimeLeft);
                // $("body").css("background-color", frame.CurrentColor.color);
                $("#startscreen").show();
            });
            frame.TimerUpdated.on(function (e) {
                if (frame.TimeLeft < 3) {
                    $("#timer > span").text(frame.TimeLeft.toFixed(1));
                }
                else {
                    $("#timer > span").text(frame.TimeLeft.toFixed(0));
                }
            });
            frame.CountDownUpdated.on(function (e) {
                if (e.CountDown > 0) {
                    // $('#forbiddencolor').html('Forbidden color<br />' + frame.CurrentColor.name);
                    $("#forbiddencolor").show();
                }
                else {
                    $("#forbiddencolor").hide();
                }
                var text = e.CountDown === 0 ? "Go" : e.CountDown; // (e.CountDown === 4 ? "Forbidden color" : e.CountDown);
                $("#countdown > span").text(text);
                $("#countdown").css("display", "block");
                $("#countdown").addClass("animated bounceIn");
                setTimeout(function () {
                    $("#countdown").css("display", "none");
                }, popupmesssagedelay);
                $("body").css("background-color", frame.CurrentColor.color);
            });
            $('body').ripples({
                resolution: 512,
                interactive: false
            });
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