﻿module BlankCordovaApp3 {
    "use strict";

    interface ILiteEvent<T> {
        on(handler: { (data?: T): void });
        off(handler: { (data?: T): void });
    }

    class LiteEvent<T> implements ILiteEvent<T> {
        private handlers: { (data?: T): void; }[] = [];

        public on(handler: { (data?: T): void }) {
            this.handlers.push(handler);
        }

        public off(handler: { (data?: T): void }) {
            this.handlers = this.handlers.filter(h => h !== handler);
        }

        public trigger(data?: T) {
            this.handlers.slice(0).forEach(h => h(data));
        }
    }

    class NextFrameEventArgs {
        public Correct: boolean;

        constructor(correct: boolean) {
            this.Correct = correct;
        }
    }

    class TimeBonusEventArgs {
        public ExtraTime: number;

        constructor(extraTime: number) {
            this.ExtraTime = extraTime;
        }
    }

    class GameEndedEventArgs {
        public Score: number;

        constructor(score: number) {
            this.Score = score;
        }
    }

    class CountDownEventArgs {
        public CountDown: number;

        constructor(countDown: number) {
            this.CountDown = countDown;
        }
    }

    class GameStartedEventArgs {

        constructor() {
        }
    }

    class TimerUpdatedEventArgs {

        constructor() {
        }
    }

    class Color {
        public name: string;
        public color: string;
    }

    class Frame {
        private _interval: any;
        private onNextFrame = new LiteEvent<NextFrameEventArgs>();
        private onTimeBonus = new LiteEvent<TimeBonusEventArgs>();
        private onGameStarted = new LiteEvent<GameStartedEventArgs>();
        private onGameEnded = new LiteEvent<GameEndedEventArgs>();
        private onTimerUpdated = new LiteEvent<TimerUpdatedEventArgs>();
        private onCountDown = new LiteEvent<CountDownEventArgs>();
        private _countdownInterval: any;

        public Score: number;
        public CurrentColor: Color;
        public ForbiddenColor: Color;
        public PossibleColors: Color[];
        public Started: boolean;
        public TimeLeft: number;
        public CurrentStreak: number;
        public CountDown: number;

        public get NextFrame(): ILiteEvent<NextFrameEventArgs> { return this.onNextFrame; }
        public get TimeBonus(): ILiteEvent<TimeBonusEventArgs> { return this.onTimeBonus; }
        public get GameStarted(): ILiteEvent<GameStartedEventArgs> { return this.onGameStarted; }
        public get GameEnded(): ILiteEvent<GameEndedEventArgs> { return this.onGameEnded; }
        public get TimerUpdated(): ILiteEvent<TimerUpdatedEventArgs> { return this.onTimerUpdated; }
        public get CountDownUpdated(): ILiteEvent<CountDownEventArgs> { return this.onCountDown; }

        constructor() {
            this.PossibleColors = [
                { color: "#FFFF00", name: "Yellow" }, // yellow
                { color: "#FF7F00", name: "Orange" }, // orange
                { color: "#AA2AFF", name: "Purple" }, // purple
                { color: "#00CC00", name: "Green" }, // green
                { color: "#FF0000", name: "Red" }, // red
                { color: "#002AFF", name: "Blue" }, // blue
                { color: "#FF55FF", name: "Pink" } // pink
            ];

            this.CurrentColor = this.pickColor();
            // this.ForbiddenColor = "#FF0000";
            this.Score = 0;
            this.TimeLeft = 0;
        }

        public start() {
            if (this.Started) return;

            this.CurrentStreak = 0;
            this.Score = 0;
            this.TimeLeft = 10;

            this.ForbiddenColor = this.pickColor();
            this.CurrentColor = this.ForbiddenColor;

            this.CountDown = 3;

            //if (this._countdownInterval) {
            //    clearInterval(this._countdownInterval);
            //}

            //if (this._interval) {
            //    clearInterval(this._interval);
            //}

            this._countdownInterval = setInterval(() => {
                this.CountDown -= 1;
                if (this.CountDown <= 0) {
                    clearInterval(this._countdownInterval);
                    this.CurrentColor = this.pickColor();
                    this._interval = setInterval(() => { this.updateInterval(); }, 100);
                }

                this.onCountDown.trigger(new CountDownEventArgs(this.CountDown));
            }, 1000);

            this.onGameStarted.trigger(new GameStartedEventArgs());
            this.onCountDown.trigger(new CountDownEventArgs(this.CountDown));
        }

        public endGame() {
            var score = this.Score;

            this.TimeLeft = 0;
            clearInterval(this._interval);
            this.Started = false;
            this.onGameEnded.trigger(new GameEndedEventArgs(score));
        }

        public swipe() {
            if (!this.Started) return;

            if (this.CurrentColor === this.ForbiddenColor) {
                this.success();
            } else {
                this.missClick();
            }
        }

        public tap() {
            if (!this.Started) return;

            if (this.CurrentColor === this.ForbiddenColor) {
                this.missClick();
            } else {
                this.success();
            }
        }

        public pickColor(): Color {
            return this.PossibleColors[Math.floor((Math.random() * this.PossibleColors.length) + 1)];
        }

        success() {
            this.Score++;
            this.CurrentStreak++;

            if (this.CurrentStreak % 5 === 0) {
                this.TimeLeft += 1;
                this.onTimeBonus.trigger(new TimeBonusEventArgs(1));
            }

            this.CurrentColor = this.pickColor();
            this.onNextFrame.trigger(new NextFrameEventArgs(true));
        }

        missClick() {
            this.Score = 0;
            this.CurrentStreak = 0;
            this.CurrentColor = this.pickColor();
            this.onNextFrame.trigger(new NextFrameEventArgs(false));
        }

        updateInterval() {
            this.Started = true;
            this.TimeLeft -= 0.1;

            if (this.TimeLeft <= 0) {
                this.endGame();
                return;
            }

            this.onTimerUpdated.trigger(new TimerUpdatedEventArgs());
        }
    }

    export module Application {
        export function initialize() {
            document.addEventListener("deviceready", onDeviceReady, false);
        }

        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener("pause", onPause, false);
            document.addEventListener("resume", onResume, false);

            var popupmesssagedelay = 750;

            var frame = new Frame();

            $("body").css("background-color", frame.CurrentColor.color);
            $("#score > span").text(frame.Score);
            // $("#timer > span").text(frame.TimeLeft);

            $("body").on("click", e => {
                frame.tap();
                $("body").css("background-color", frame.CurrentColor.color);
                $("#score > span").text(frame.Score);
            });

            $("body").on("swipeone swipetwo", e => {
                frame.swipe();
                $("body").css("background-color", frame.CurrentColor.color);
                $("#score > span").text(frame.Score);
            });

            $("#startbutton").on("click", e => {
                frame.start();
            });

            frame.TimeBonus.on(x => {
                $("#timebonus .message > span").text("+" + x.ExtraTime);

                $("#timebonus").css("display", "block");
                $("#timebonus").addClass("animated bounceIn");
                setTimeout(() => {
                    $("#timebonus").css("display", "none");
                }, popupmesssagedelay);
            });

            frame.NextFrame.on(x => {
                $("#score > span").text(frame.Score);
                $("body").css("background-color", frame.CurrentColor.color);

                if (x.Correct) {
                    $("#plusscore > span").text("+1");

                    $("#plusscore").css("display", "block");
                    $("#plusscore").addClass("animated fadeOutDown");
                    setTimeout(() => {
                        $("#plusscore").css("display", "none");
                    }, popupmesssagedelay);
                } else {
                    $("#oops").css("display", "block");
                    $("#oops").addClass("animated bounceIn");
                    setTimeout(() => {
                        $("#oops").css("display", "none");
                    }, popupmesssagedelay);
                }
            });

            frame.GameStarted.on(e => {
                $("#timer > span").text(frame.TimeLeft);
                $("#startbutton").hide();
                $("body").css("background-color", frame.CurrentColor.color);
            });

            frame.GameEnded.on(e => {
                $("body").css("background-color", frame.CurrentColor.color);
                $("#timer > span").text(frame.TimeLeft);
                $("#startbutton").show();
            });

            frame.TimerUpdated.on(e => {
                if (frame.TimeLeft < 1) {
                    $("#timer > span").text(frame.TimeLeft.toFixed(1));
                } else {
                    $("#timer > span").text(frame.TimeLeft.toFixed(0));
                }
            });

            frame.CountDownUpdated.on(e => {
                if (e.CountDown > 0) {
                    // $('#forbiddencolor').html('Forbidden color<br />' + frame.CurrentColor.name);
                    $('#forbiddencolor').show();
                } else {
                    $('#forbiddencolor').hide();
                }
                var text = e.CountDown === 0 ? "Go" : e.CountDown; // (e.CountDown === 4 ? "Forbidden color" : e.CountDown);

                $("body").css("background-color", frame.CurrentColor.color);
                $("#countdown > span").text(text);
                $("#countdown").css("display", "block");
                $("#countdown").addClass("animated bounceIn");
                setTimeout(() => {
                    $("#countdown").css("display", "none");
                }, popupmesssagedelay);
            });
        }

        function onPause() {
            // TODO: This application has been suspended. Save application state here.
        }

        function onResume() {
            // TODO: This application has been reactivated. Restore application state here.
        }

    }

    window.onload = function () {
        Application.initialize();
    }
}
