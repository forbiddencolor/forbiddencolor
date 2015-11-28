module BlankCordovaApp3 {
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

    class GameStartedEventArgs {

        constructor() {
        }
    }

    class TimerUpdatedEventArgs {

        constructor() {
        }
    }

    class Frame {
        private _interval: any;
        private onNextFrame = new LiteEvent<NextFrameEventArgs>();
        private onTimeBonus = new LiteEvent<TimeBonusEventArgs>();
        private onGameStarted = new LiteEvent<GameStartedEventArgs>();
        private onGameEnded = new LiteEvent<GameEndedEventArgs>();
        private onTimerUpdated = new LiteEvent<TimerUpdatedEventArgs>();

        public Score: number;
        public CurrentColor: string;
        public ForbiddenColor: string;
        public PossibleColors: string[];
        public Started: boolean;
        public TimeLeft: number;
        public CurrentStreak: number;

        public get NextFrame(): ILiteEvent<NextFrameEventArgs> { return this.onNextFrame; } 
        public get TimeBonus(): ILiteEvent<TimeBonusEventArgs> { return this.onTimeBonus; } 
        public get GameStarted(): ILiteEvent<GameStartedEventArgs> { return this.onGameStarted; } 
        public get GameEnded(): ILiteEvent<GameEndedEventArgs> { return this.onGameEnded; } 
        public get TimerUpdated(): ILiteEvent<TimerUpdatedEventArgs> { return this.onTimerUpdated; } 

        constructor() {
            this.PossibleColors = [
                "#FFFF00", // yellow
                "#FF7F00", // orange
                "#AA2AFF", // purple
                "#00CC00", // green
                "#FF0000", // red
                "#002AFF", // blue
                "#FF55FF" // pink
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
            this.CurrentColor = this.pickColor();

            this.ForbiddenColor = "#FF0000";

            this.CurrentColor = this.pickColor();
            this._interval = setInterval(() => { this.updateInterval(); }, 100);
            this.onGameStarted.trigger(new GameStartedEventArgs());
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

            this.CurrentColor = this.pickColor();
        }

        public tap() {
            if (!this.Started) return;

            if (this.CurrentColor === this.ForbiddenColor) {
                this.missClick();
            } else {
                this.success();
            }

            this.CurrentColor = this.pickColor();
        }

        success() {
            this.Score++;
            this.CurrentStreak++;

            if (this.CurrentStreak % 5 === 0) {
                this.TimeLeft += 1;
                this.onTimeBonus.trigger(new TimeBonusEventArgs(1));
            }

            this.onNextFrame.trigger(new NextFrameEventArgs(true));
        }

        missClick() {
            this.Score = 0;
            this.CurrentStreak = 0;
            this.onNextFrame.trigger(new NextFrameEventArgs(false));
        }

        pickColor(): string {
            return this.PossibleColors[Math.floor((Math.random() * this.PossibleColors.length) + 1)];
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
            
            $("body").css("background-color", frame.CurrentColor);
            $("#score > span").text(frame.Score);
            // $("#timer > span").text(frame.TimeLeft);

            $("body").on("click", e => {
                frame.tap();
                $("body").css("background-color", frame.CurrentColor);
                $("#score > span").text(frame.Score);
            });

            $("body").on("swipeone swipetwo", e => {
                frame.swipe();
                $("body").css("background-color", frame.CurrentColor);
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
            });

            frame.GameEnded.on(e => {
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
