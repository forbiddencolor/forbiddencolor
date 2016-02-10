define(["require", "exports"], function (require, exports) {
    "use strict";
    var HighScore = (function () {
        function HighScore() {
        }
        return HighScore;
    })();
    exports.HighScore = HighScore;
    var HighScoreStorage = (function () {
        function HighScoreStorage(maxEntries) {
            if (maxEntries === void 0) { maxEntries = 5; }
            this.maxNameLength = 5;
            this.maxEntries = maxEntries;
        }
        HighScoreStorage.prototype.getHighScores = function () {
            var scores;
            try {
                var highscoresStr = localStorage.getItem("highscores");
                var highscores = JSON.parse(highscoresStr);
                if (!highscores || !highscores.scores) {
                    this.resetScores();
                    return this.getHighScores();
                }
                scores = highscores.scores;
            }
            catch (ex) {
                this.resetScores();
                return this.getHighScores();
            }
            return scores.sort(this.sort);
        };
        HighScoreStorage.prototype.getNewHighScores = function (name, score, longestStreak) {
            if (longestStreak === void 0) { longestStreak = 0; }
            var hs = this.getHighScores();
            var newhs = new HighScore();
            newhs.name = name;
            newhs.score = score;
            newhs.longestStreak = longestStreak;
            hs.push(newhs);
            return hs.sort(this.sort).slice(0, this.maxEntries);
        };
        HighScoreStorage.prototype.isHighScore = function (score) {
            var highScores = this.getHighScores();
            var lowest = highScores[highScores.length - 1];
            return (highScores.length < this.maxEntries) || (score > lowest.score);
        };
        HighScoreStorage.prototype.addScore = function (name, score, longestStreak) {
            if (longestStreak === void 0) { longestStreak = 0; }
            var hscore = new HighScore();
            hscore.name = name.substr(0, name.length > this.maxNameLength ? this.maxNameLength : name.length);
            hscore.score = score;
            hscore.longestStreak = longestStreak;
            return this.addHighScore(hscore);
        };
        HighScoreStorage.prototype.addHighScore = function (score) {
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
        };
        HighScoreStorage.prototype.resetScores = function () {
            var highscores = {
                scores: [
                    { name: "Johan", score: 25 },
                    { name: "Remco", score: 20 },
                    { name: "Joshua", score: 15 },
                    { name: "Bob", score: 10 },
                    { name: "Chris", score: 5 }]
            };
            localStorage.setItem("highscores", JSON.stringify(highscores));
        };
        HighScoreStorage.prototype.sort = function (a, b) {
            return a.score < b.score ? 1 : 0;
        };
        return HighScoreStorage;
    })();
    exports.HighScoreStorage = HighScoreStorage;
});
//# sourceMappingURL=HighScores.js.map