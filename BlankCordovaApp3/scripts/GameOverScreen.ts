/// <reference path="typings/knockout/knockout.d.ts" />

"use strict";

import {Frame} from "Frame";
import {Screen} from "Screen";
import * as Scores from "HighScores";
import * as ScreenManager from "ScreenManager";
import * as ko from "knockout";

var scores = new Scores.HighScoreStorage();

export class GameOverScreen extends Screen {
    public highScores: KnockoutObservableArray<Scores.HighScore> = <KnockoutObservableArray<Scores.HighScore>>ko.observableArray();
    public score: KnockoutObservable<number> = <KnockoutObservable<number>>ko.observable();
    public isHighScore: KnockoutObservable<boolean> = <KnockoutObservable<boolean>>ko.observable();
    public name: KnockoutObservable<string> = <KnockoutObservable<string>>ko.observable();

    constructor(engine: Frame) {
        super("gameoverscreen");

        this.engine = engine;

        this.updateHighScores();
        ko.applyBindings(this, $("#gameoverscreen")[0]);
    }

    public show() {
        this.updateHighScores();
        super.show();
    }

    public hide() {
        super.hide();
        ScreenManager.getScreen('start').show();
    }

    private updateHighScores() {
        this.highScores.removeAll();
        scores.getHighScores().forEach(e=> this.highScores.push(e));
        this.isHighScore(scores.isHighScore(this.score()));
    }

    public saveScore() {
        if (this.name().length < 3) return;

        scores.addScore(this.name(), this.score());
        this.hide();
    }

    engine: Frame;
}