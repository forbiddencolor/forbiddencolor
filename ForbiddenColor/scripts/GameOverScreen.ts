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

        $("#name").on("keypress", function (e): void {
            //list of functional/control keys that you want to allow always
            var keys = [8, 9, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 144, 145];

            if ($.inArray(e.keyCode, keys) === -1) {
                if ($(this).val().length >= scores.maxNameLength) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        });
    }

    public show(): void {
        this.updateHighScores();
        super.show();
        $("input[type=text]").first().focus();
    }

    public hide(): void {
        super.hide();
    }

    private updateHighScores(): void {
        this.highScores.removeAll();
        scores.getHighScores().forEach(e => this.highScores.push(e));
        this.isHighScore(scores.isHighScore(this.score()));
    }

    public saveScore(): void {
        if (!this.name() || this.name().length < 3) { return; }

        scores.addScore(this.name(), this.score());
        this.mainScreen();
    }

    public startGame(): void {
        this.hide();
        ScreenManager.getScreen("gamescreen").show();
    }

    public mainScreen(): void {
        this.hide();
        ScreenManager.getScreen("startscreen").show();
    }

    engine: Frame;
}