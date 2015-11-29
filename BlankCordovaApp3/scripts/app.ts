/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/jquery.ripples/jquery.ripples.d.ts" />

import {ILiteEvent, LiteEvent} from './LiteEvents';
import * as $ from "jquery";
// import $ = require('jquery');

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
    public IsStarted: boolean;
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
            { color: "#10E5E5", name: "Cyan" }, // 
            { color: "#FF7F00", name: "Orange" }, // orange
            { color: "#AA2AFF", name: "Purple" }, // purple
            { color: "#00CC00", name: "Green" }, // green
            { color: "#FF0000", name: "Red" }, // red
            { color: "#002AFF", name: "Blue" }, // blue
            { color: "#FF55FF", name: "Pink" } // pink
        ];

        this.CurrentColor = this.pickColor();
        this.ForbiddenColor = this.CurrentColor;
        this.CurrentStreak = 0;
        this.CountDown = 0;
        this.Score = 0;
        this.TimeLeft = 0;
    }

    public start() {
        if (this.IsStarted) return;

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
        this.IsStarted = false;
        this.onGameEnded.trigger(new GameEndedEventArgs(score));
    }

    public swipe() {
        if (!this.IsStarted) return;

        if (this.CurrentColor === this.ForbiddenColor) {
            this.success();
        } else {
            this.missClick();
        }
    }

    public tap() {
        if (!this.IsStarted) return;

        if (this.CurrentColor === this.ForbiddenColor) {
            this.missClick();
        } else {
            this.success();
        }
    }

    public pickColor(): Color {
        var num = Math.floor((Math.random() * this.PossibleColors.length));
        var color = this.PossibleColors[num];
        return color;
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
        this.IsStarted = true;
        this.TimeLeft -= 0.1;

        if (this.TimeLeft <= 0) {
            this.endGame();
            return;
        }

        this.onTimerUpdated.trigger(new TimerUpdatedEventArgs());
    }
}

module App {
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
        // $("#score > span").text(frame.Score);
        // $("#timer > span").text(frame.TimeLeft);

        $("body").on("touchstart", (e: any) => {
            e.preventDefault();

            var touchStart = e.originalEvent.touches[0],
                startX = touchStart.pageX,
                startY = touchStart.pageY,
                lastX = startX,
                lastY = startY;

            function removeTouchHandler() {
                $("body").off("touchmove", moveHandler).off("touchend", endHandler);
            };

            function endHandler(endEvent) {
                removeTouchHandler();

                if (Math.abs(lastX - startX) > 50 ||
                    Math.abs(lastY - startY) > 50) {
                    if (frame.IsStarted) {
                        frame.swipe();
                    }
                } else {
                    if (frame.IsStarted) {
                        frame.tap();
                    }

                    ripple(lastX, lastY, 15, 0.02);
                    ripple(lastX, lastY, 20, 0.04);
                }
            };

            function moveHandler(moveEvent) {
                var touchMove = moveEvent.originalEvent.touches[0];
                lastX = touchMove.pageX;
                lastY = touchMove.pageY;

                if (Math.abs(lastX - startX) > 10 ||
                    Math.abs(lastY - startY) > 10) {

                    ripple(lastX, lastY, 20, 0.04);
                }
            }

            ripple(startX, startY, 20, 0.04);
            ripple(startX, startY, 25, 0.06);

            $("body").on("touchmove", moveHandler).on("touchend", endHandler);
        });

        $("#startbutton").on("touchstart", e => {
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

            $("body").css("background-color", frame.CurrentColor.color);
        });

        frame.GameStarted.on(e => {
            resetRipples();

            $("#score > span").text(frame.Score);
            $("#timer > span").text(frame.TimeLeft);
            $("body").css("background-color", frame.CurrentColor.color);
            $("#startscreen").hide();
            $("#currentforbiddencolor").html("" + frame.CurrentColor.name);
        });

        frame.GameEnded.on(e => {
            $("#score > span").text(frame.Score);
            $("#timer > span").text(frame.TimeLeft);
            // $("body").css("background-color", frame.CurrentColor.color);
            resetRipples();
            $("#startscreen").show();
        });

        frame.TimerUpdated.on(e => {
            if (frame.TimeLeft < 3) {
                $("#timer > span").text(frame.TimeLeft.toFixed(1));
            } else {
                $("#timer > span").text(frame.TimeLeft.toFixed(0));
            }
        });

        frame.CountDownUpdated.on(e => {
            if (e.CountDown > 0) {
                // $('#forbiddencolor').html('Forbidden color<br />' + frame.CurrentColor.name);
                $("#forbiddencolor").show();
            } else {
                $("#forbiddencolor").hide();
                resetRipples();
            }

            var text = e.CountDown === 0 ? "Go" : e.CountDown; // (e.CountDown === 4 ? "Forbidden color" : e.CountDown);

            $("#countdown > span").text(text);
            $("#countdown").css("display", "block");
            $("#countdown").addClass("animated bounceIn");
            setTimeout(() => {
                $("#countdown").css("display", "none");
            }, popupmesssagedelay);

            $("body").css("background-color", frame.CurrentColor.color);
        });

        resetRipples();
    }

    function resetRipples() {
        $('body').ripples('destroy');

        $('body').ripples({
            resolution: 512,
            interactive: false
        });
    }

    function ripple(x: number, y: number, radius: number, strength: number, timeout?: number) {
        $("body").queue((next) => {
            $("body").ripples("drop", x, y, radius, strength);
            next();
        });
    }

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    }

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    }

}

export = App;