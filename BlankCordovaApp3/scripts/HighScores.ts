"use strict";

export class HighScore {
    public name: string;
    public score: number;
    public longestStreak: number;
}

export class HighScoreStorage {
    public maxEntries: number;
    public maxNameLength: number = 5;

    constructor(maxEntries: number = 5) {
        this.maxEntries = maxEntries;
    }

    public getHighScores(): HighScore[] {
        var scores: HighScore[];

        try {
            var highscoresStr = localStorage.getItem('highscores');
            var highscores = JSON.parse(highscoresStr);
            if (!highscores || !highscores.scores) {
                this.resetScores();
                return this.getHighScores();
            }
            scores = highscores.scores;
        } catch (ex) {
            this.resetScores();
            return this.getHighScores();
        }

        return scores.sort(this.sort);
    }

    public isHighScore(score: number) {
        var highScores = this.getHighScores();
        if (highScores.length < this.maxEntries) return true;

        for (var hscore of highScores) {
            if (score < hscore.score)
                return false;
        }

        return true;
    }

    public addScore(name: string, score: number, longestStreak: number = 0): boolean {
        var hscore = new HighScore();
        hscore.name = name.substr(0, name.length > this.maxNameLength ? this.maxNameLength : name.length);
        hscore.score = score;
        hscore.longestStreak = longestStreak;
        return this.addHighScore(hscore);
    }

    public addHighScore(score: HighScore): boolean {
        if (!this.isHighScore(score.score))
            return false;

        var scores = this.getHighScores();
        scores.push(score);

        var sorted = scores.sort(this.sort);
        sorted.slice(0, this.maxEntries);

        var highscores = { scores: scores };
        localStorage.setItem('highscores', JSON.stringify(highscores));
        return true;
    }

    public resetScores() {
        var highscores = { scores: [{ name: 'ros', score: 2 }, { name: 'joh', score: 1 }] };
        localStorage.setItem('highscores', JSON.stringify(highscores));
    }

    private sort(a: any, b: any) {
        return a.score < b.score ? 1 : 0;
    }
}