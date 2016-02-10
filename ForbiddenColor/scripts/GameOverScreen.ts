/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/knockout/knockout.d.ts" />
/// <reference path="bindinghandlers.d.ts" />

"use strict";

import {Frame} from "Frame";
import {Screen} from "Screen";
import * as Scores from "HighScores";
import * as ScreenManager from "ScreenManager";
import * as ko from "knockout";
import * as $ from "jquery";

var scores = new Scores.HighScoreStorage();

export class GameOverScreen extends Screen {
    public highScores: KnockoutObservableArray<Scores.HighScore> = <KnockoutObservableArray<Scores.HighScore>>ko.observableArray();
    public newHighScores: KnockoutObservableArray<Scores.HighScore> = <KnockoutObservableArray<Scores.HighScore>>ko.observableArray();
    public score: KnockoutObservable<number> = <KnockoutObservable<number>>ko.observable();
    public isHighScore: KnockoutObservable<boolean> = <KnockoutObservable<boolean>>ko.observable();
    public name: KnockoutObservable<string> = <KnockoutObservable<string>>ko.observable();

    constructor(engine: Frame) {
        super("gameoverscreen");

        this.engine = engine;

        this.updateHighScores();
        ko.applyBindings(this, $("#gameoverscreen")[0]);

        $("#name").on("keydown", function (e): boolean {
            //list of functional/control keys that you want to allow always
            var keys = [8, 9, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 144, 145];

            if ($.inArray(e.keyCode, keys) === -1) {
                if ($(this).val().length >= scores.maxNameLength) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            }

            return true;
        });
    }

    public show(): void {
        this.updateHighScores();
        super.show();
        $("#name").first().focus();
    }

    public hide(): void {
        super.hide();
    }

    private updateHighScores(): void {
        this.highScores.removeAll();
        this.newHighScores.removeAll();

        var hs = scores.getHighScores();
        hs.forEach(e => this.highScores.push(e));

        var newhs = scores.getNewHighScores("", this.score());
        newhs.forEach(e => this.newHighScores.push(e));

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

    setScore(score: number) {
        this.score(score);
    }
}