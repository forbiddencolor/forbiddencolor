/// <reference path="typings/knockout/knockout.d.ts" />

"use strict";

import {Frame} from "Frame";
import {Screen} from "Screen";
import {GameScreen} from "GameScreen";
import * as Scores from "HighScores";
import * as ko from "knockout";

var scores = new Scores.HighScoreStorage();

export class StartScreen extends Screen {
    public highScores: KnockoutObservableArray<Scores.HighScore> = <KnockoutObservableArray<Scores.HighScore>>ko.observableArray();

    constructor(engine: Frame) {
        super("startscreen");

        this.gameScreen = new GameScreen(engine);
        this.engine = engine;

        $("#startbutton").on("touchstart", e => {
            e.preventDefault();
            e.stopPropagation();

            this.hide();
            this.gameScreen.show();
            return true;
        });

        this.updateHighScores();
        ko.applyBindings(this, $("#startscreen")[0]);
    }

    public show(): void {
        $("body").css("background-color", this.engine.CurrentColor.color);
        this.updateHighScores();
        super.show();
    }

    public hide(): void {

        super.hide();
    }

    private updateHighScores(): void {
        this.highScores.removeAll();
        scores.getHighScores().forEach(e=> this.highScores.push(e));
    }

    engine: Frame;
    gameScreen: GameScreen;
}