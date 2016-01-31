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
            var highscoresStr = localStorage.getItem("highscores");
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

    public getNewHighScores(name: string, score: number, longestStreak: number = 0): HighScore[] {
        var hs = this.getHighScores();
        var newhs = new HighScore();
        newhs.name = name;
        newhs.score = score;
        newhs.longestStreak = longestStreak;
        hs.push(newhs);
        return hs.sort(this.sort).slice(0, this.maxEntries);
    }

    public isHighScore(score: number): boolean {
        var highScores = this.getHighScores();
        var lowest = highScores[highScores.length - 1];
        return (highScores.length < this.maxEntries) || (score > lowest.score);
    }

    public addScore(name: string, score: number, longestStreak: number = 0): boolean {
        var hscore = new HighScore();
        hscore.name = name.substr(0, name.length > this.maxNameLength ? this.maxNameLength : name.length);
        hscore.score = score;
        hscore.longestStreak = longestStreak;
        return this.addHighScore(hscore);
    }

    public addHighScore(score: HighScore): boolean {
        if (!this.isHighScore(score.score)) {
            return false;
        }

        var scores = this.getHighScores();
        scores.push(score);

        scores = scores.sort(this.sort)
            .slice(0, this.maxEntries);

        var highscores = { scores: scores };
        localStorage.setItem("highscores", JSON.stringify(highscores));
        return true;
    }

    public resetScores(): void {
        var highscores = {
            scores: [
                { name: "Johan", score: 43 },
                { name: "Remco", score: 38 },
                { name: "Bob", score: 27 },
                { name: "John", score: 15 },
                { name: "Chris", score: 4 }]
        };
        // For testing
        //var highscores = {
        //    scores: [
        //        { name: 'Johan', score: 5 },
        //        { name: 'Remco', score: 4 },
        //        { name: 'Bob', score: 3 },
        //        { name: 'John', score: 2 },
        //        { name: 'Chris', score: 1 }]
        //};
        localStorage.setItem("highscores", JSON.stringify(highscores));
    }

    private sort(a: any, b: any): number {
        return a.score < b.score ? 1 : 0;
    }
}