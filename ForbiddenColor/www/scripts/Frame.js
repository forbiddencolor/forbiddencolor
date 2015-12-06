define(["require", "exports", "LiteEvents", "timestamp"], function (require, exports, LiteEvents_1, timestamp) {
    "use strict";
    var NextFrameEventArgs = (function () {
        function NextFrameEventArgs(correct) {
            this.Correct = correct;
        }
        return NextFrameEventArgs;
    })();
    exports.NextFrameEventArgs = NextFrameEventArgs;
    var TimeBonusEventArgs = (function () {
        function TimeBonusEventArgs(extraTime) {
            this.ExtraTime = extraTime;
        }
        return TimeBonusEventArgs;
    })();
    exports.TimeBonusEventArgs = TimeBonusEventArgs;
    var GameEndedEventArgs = (function () {
        function GameEndedEventArgs(score) {
            this.Score = score;
        }
        return GameEndedEventArgs;
    })();
    exports.GameEndedEventArgs = GameEndedEventArgs;
    var CountDownEventArgs = (function () {
        function CountDownEventArgs(countDown) {
            this.CountDown = countDown;
        }
        return CountDownEventArgs;
    })();
    exports.CountDownEventArgs = CountDownEventArgs;
    var GameStartedEventArgs = (function () {
        function GameStartedEventArgs() {
        }
        return GameStartedEventArgs;
    })();
    exports.GameStartedEventArgs = GameStartedEventArgs;
    var TimerUpdatedEventArgs = (function () {
        function TimerUpdatedEventArgs() {
        }
        return TimerUpdatedEventArgs;
    })();
    exports.TimerUpdatedEventArgs = TimerUpdatedEventArgs;
    var Color = (function () {
        function Color() {
        }
        return Color;
    })();
    exports.Color = Color;
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
            if (this.IsStarted) {
                return;
            }
            this.IsStarted = true;
            this.IsPlaying = false;
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
                    _this.IsPlaying = true;
                    setTimeout(function () { _this.animLoop(_this.gameLoop, 100); }, 500);
                }
                _this.onCountDown.trigger(new CountDownEventArgs(_this.CountDown));
            }, 1000);
            this.onGameStarted.trigger(new GameStartedEventArgs());
            this.onCountDown.trigger(new CountDownEventArgs(this.CountDown));
        };
        Frame.prototype.endGame = function () {
            var score = this.Score;
            this.TimeLeft = 0;
            this.IsStarted = false;
            this.IsPlaying = false;
            this.onGameEnded.trigger(new GameEndedEventArgs(score));
        };
        Frame.prototype.swipe = function () {
            if (!this.IsPlaying) {
                return;
            }
            if (this.CurrentColor === this.ForbiddenColor) {
                this.success();
            }
            else {
                this.missClick();
            }
        };
        Frame.prototype.tap = function () {
            if (!this.IsPlaying) {
                return;
            }
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
            this.TimeLeft -= 0.1;
            if (this.TimeLeft <= 0) {
                this.endGame();
                return;
            }
            this.onTimerUpdated.trigger(new TimerUpdatedEventArgs());
        };
        Frame.prototype.gameLoop = function (delta) {
            if (!this.IsStarted) {
                return false;
            }
            this.TimeLeft -= delta / 1000;
            if (this.TimeLeft <= 0) {
                this.endGame();
                return false;
            }
            this.onTimerUpdated.trigger(new TimerUpdatedEventArgs());
            return true;
        };
        Frame.prototype.animLoop = function (render, speed) {
            if (speed === void 0) { speed = (1000 / 30); }
            var running, lastFrame = timestamp.now(), raf = window.requestAnimationFrame, that = this;
            function loop(now) {
                if (running !== false) {
                    raf(loop);
                    var elapsed = Math.min(1000, now - lastFrame);
                    if ((speed <= 0 || elapsed > speed)) {
                        lastFrame = now - (elapsed % speed);
                        running = render.bind(that)(elapsed);
                    }
                }
            }
            loop(lastFrame);
        };
        return Frame;
    })();
    exports.Frame = Frame;
});
//# sourceMappingURL=Frame.js.map