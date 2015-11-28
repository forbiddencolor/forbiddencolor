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
            this.onNextFrame = new LiteEvent();
            this.onTimeBonus = new LiteEvent();
            this.onGameStarted = new LiteEvent();
            this.onGameEnded = new LiteEvent();
            this.onTimerUpdated = new LiteEvent();
            this.onCountDown = new LiteEvent();
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
            if (this.Started)
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
        };
        Frame.prototype.pickColor = function () {
            var num = Math.floor((Math.random() * this.PossibleColors.length));
            console.log('picked: ' + num);
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
            $("body").css("background-color", frame.CurrentColor.color);
            $("#score > span").text(frame.Score);
            // $("#timer > span").text(frame.TimeLeft);
            $("body").on("click", function (e) {
                // frame.tap();
                // $("body").css("background-color", frame.CurrentColor.color);
                // $("#score > span").text(frame.Score);
            });
            $("body").on("click swipeone swipetwo", function (e) {
                if (e.type === "click") {
                    frame.tap();
                }
                else {
                    frame.swipe();
                }
                // $("body").css("background-color", frame.CurrentColor.color);
                // $("#score > span").text(frame.Score);
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
                $("#startbutton").hide();
                $("#currentforbiddencolor").html("" + frame.CurrentColor.name);
            });
            frame.GameEnded.on(function (e) {
                $("#score > span").text(frame.Score);
                $("#timer > span").text(frame.TimeLeft);
                // $("body").css("background-color", frame.CurrentColor.color);
                $("#startbutton").show();
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