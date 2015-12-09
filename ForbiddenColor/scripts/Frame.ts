"use strict";

import {ILiteEvent, LiteEvent} from "LiteEvents";
import * as timestamp from "timestamp";

export class NextFrameEventArgs {
    public Correct: boolean;

    constructor(correct: boolean) {
        this.Correct = correct;
    }
}

export class TimeBonusEventArgs {
    public ExtraTime: number;

    constructor(extraTime: number) {
        this.ExtraTime = extraTime;
    }
}

export class GameEndedEventArgs {
    public Score: number;

    constructor(score: number) {
        this.Score = score;
    }
}

export class CountDownEventArgs {
    public CountDown: number;

    constructor(countDown: number) {
        this.CountDown = countDown;
    }
}

export class GameStartedEventArgs {
}

export class TimerUpdatedEventArgs {
}

export class Color {
    public name: string;
    public color: string;
}

export class Frame {
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
    public IsPlaying: boolean;
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
            // { color: "#FF55FF", name: "Pink" } // pink
        ];

        this.CurrentColor = this.pickColor();
        this.ForbiddenColor = this.CurrentColor;
        this.CurrentStreak = 0;
        this.CountDown = 0;
        this.Score = 0;
        this.TimeLeft = 0;        
    }

    public start(): void {
        if (this.IsStarted) { return; }

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

        this._countdownInterval = setInterval(() => {
            this.CountDown -= 1;
            if (this.CountDown <= 0) {
                clearInterval(this._countdownInterval);
                this.CurrentColor = this.pickColor();
                this.IsPlaying = true;
                setTimeout(() => { this.animLoop(this.gameLoop, 100); }, 500);
            }

            this.onCountDown.trigger(new CountDownEventArgs(this.CountDown));
        }, 1000);

        this.onGameStarted.trigger(new GameStartedEventArgs());
        this.onCountDown.trigger(new CountDownEventArgs(this.CountDown));
    }

    public endGame(): void {
        var score = this.Score;

        this.TimeLeft = 0;
        this.IsStarted = false;
        this.IsPlaying = false;
        this.onGameEnded.trigger(new GameEndedEventArgs(score));
    }

    public swipe(): void {
        if (!this.IsPlaying) { return; }

        if (this.CurrentColor === this.ForbiddenColor) {
            this.success();
        } else {
            this.missClick();
        }
    }

    public tap(): void {
        if (!this.IsPlaying) { return; }

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

    success(): void {
        this.Score++;
        this.CurrentStreak++;

        if (this.CurrentStreak % 5 === 0) {
            this.TimeLeft += 1;
            this.onTimeBonus.trigger(new TimeBonusEventArgs(1));
        }

        this.CurrentColor = this.pickColor();
        this.onNextFrame.trigger(new NextFrameEventArgs(true));
    }

    missClick(): void {
        this.Score = 0;
        this.CurrentStreak = 0;
        this.CurrentColor = this.pickColor();
        this.onNextFrame.trigger(new NextFrameEventArgs(false));
    }

    updateInterval(): void {
        this.TimeLeft -= 0.1;

        if (this.TimeLeft <= 0) {
            this.endGame();
            return;
        }

        this.onTimerUpdated.trigger(new TimerUpdatedEventArgs());
    }

    gameLoop(delta: number): boolean {
        if (!this.IsStarted) { return false; }

        this.TimeLeft -= delta / 1000;

        if (this.TimeLeft <= 0) {
            this.endGame();
            return false;
        }

        this.onTimerUpdated.trigger(new TimerUpdatedEventArgs());
        return true;
    }

    animLoop(render: Function, speed: number = (1000 / 30)): void {
        var running, lastFrame = timestamp.now(),
            raf = window.requestAnimationFrame,
            that = this;
        function loop(now: number): void {
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
    }
}

