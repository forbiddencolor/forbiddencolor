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
            this.maxEntries = maxEntries;
        }
        HighScoreStorage.prototype.getHighScores = function () {
            var scores;
            try {
                var highscoresStr = localStorage.getItem('highscores');
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
        HighScoreStorage.prototype.isHighScore = function (score) {
            var highScores = this.getHighScores();
            if (highScores.length < this.maxEntries)
                return true;
            for (var _i = 0; _i < highScores.length; _i++) {
                var hscore = highScores[_i];
                if (score < hscore.score)
                    return false;
            }
            return true;
        };
        HighScoreStorage.prototype.addScore = function (name, score, longestStreak) {
            if (longestStreak === void 0) { longestStreak = 0; }
            var hscore = new HighScore();
            hscore.name = name;
            hscore.score = score;
            hscore.longestStreak = longestStreak;
            return this.addHighScore(hscore);
        };
        HighScoreStorage.prototype.addHighScore = function (score) {
            if (!this.isHighScore(score.score))
                return false;
            var scores = this.getHighScores();
            scores.push(score);
            var sorted = scores.sort(this.sort);
            sorted.slice(0, this.maxEntries);
            var highscores = { scores: scores };
            localStorage.setItem('highscores', JSON.stringify(highscores));
            return true;
        };
        HighScoreStorage.prototype.resetScores = function () {
            var highscores = { scores: [{ name: 'ros', score: 2 }, { name: 'joh', score: 1 }] };
            localStorage.setItem('highscores', JSON.stringify(highscores));
        };
        HighScoreStorage.prototype.sort = function (a, b) {
            return a.score < b.score ? 1 : 0;
        };
        return HighScoreStorage;
    })();
    exports.HighScoreStorage = HighScoreStorage;
});
//# sourceMappingURL=HighScores.js.map