/// <reference path="typings/jquery/jquery.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jquery", "Screen", "GameOverScreen", "timestamp"], function (require, exports, $, Screen_1, GameOverScreen_1, timestamp) {
    "use strict";
    var GameScreen = (function (_super) {
        __extends(GameScreen, _super);
        function GameScreen(engine) {
            var _this = this;
            _super.call(this, "gamescreen");
            this.currentRipple = [];
            this.popupMessageCount = 0;
            this.lastScoreTime = +new Date;
            this.$body = $("body");
            this.$forbiddencolor = $("#forbiddencolor");
            this.$score = $("#score > span");
            this.$timebonus = $("#timebonus");
            this.$oops = $("#oops");
            this.$timer = $("#timer > span");
            this.$countdown = $("#countdown");
            this.$plusscore = $("#plusscore");
            this.shouldRenderRipples = false;
            this.shouldRenderTouches = false;
            this.popupmesssagedelay = 750;
            this.engine = engine;
            this.gameOverScreen = new GameOverScreen_1.GameOverScreen(engine);
            this.engine.TimeBonus.on(function (e) { return _this.onTimeBonus(e); });
            this.engine.NextFrame.on(function (e) { return _this.onNextFrame(e); });
            this.engine.GameStarted.on(function (e) { return _this.onGameStarted(e); });
            this.engine.GameEnded.on(function (e) { return _this.onGameEnded(e); });
            this.engine.TimerUpdated.on(function (e) { return _this.onTimerUpdated(e); });
            this.engine.CountDownUpdated.on(function (e) { return _this.onCountDownUpdated(e); });
            // ko.applyBindings(this, $("#gamescreen")[0]);
        }
        GameScreen.prototype.show = function () {
            this.$body.css("background-color", this.engine.CurrentColor.color);
            _super.prototype.show.call(this);
            this.__onTouchStart = this.onTouchStart.bind(this);
            this.$body.on("touchstart", this.__onTouchStart);
            this.engine.start();
            if (this.shouldRenderRipples) {
                this.resetRipples();
                this.animLoop(this.renderRipple);
            }
        };
        GameScreen.prototype.hide = function () {
            this.$body.off("touchstart", this.__onTouchStart);
            _super.prototype.hide.call(this);
        };
        GameScreen.prototype.onTimerUpdated = function (e) {
            if (this.engine.TimeLeft < 3) {
                this.$timer.text(this.engine.TimeLeft.toFixed(1));
            }
            else {
                this.$timer.text(this.engine.TimeLeft.toFixed(0));
            }
        };
        GameScreen.prototype.onGameEnded = function (e) {
            this.$score.text(this.engine.Score.toString());
            this.$timer.text(this.engine.TimeLeft.toString());
            this.hide();
            this.gameOverScreen.score(e.Score);
            this.gameOverScreen.show();
        };
        GameScreen.prototype.onGameStarted = function (e) {
            this.$score.text(this.engine.Score.toString());
            this.$timer.text(this.engine.TimeLeft.toString());
            this.$body.css("background-color", this.engine.CurrentColor.color);
            $("#startscreen").hide();
            $("#currentforbiddencolor").html(this.engine.CurrentColor.name);
            this.$oops.empty();
            this.$plusscore.empty();
            this.$forbiddencolor.find("> span").html("Forbidden color<br />" + this.engine.CurrentColor.name);
            this.$forbiddencolor.removeClass("animated fadeOut");
            this.$forbiddencolor.show();
        };
        GameScreen.prototype.onCountDownUpdated = function (e) {
            var _this = this;
            if (e.CountDown <= 1) {
                this.$forbiddencolor.addClass("animated fadeOut");
                this.resetRipples();
            }
            var text = e.CountDown === 0 ? "Go" : e.CountDown.toString();
            this.$countdown.find("> span").text(text);
            this.$countdown.css("display", "block");
            this.$countdown.addClass("animated bounceIn");
            setTimeout(function () {
                _this.$countdown.css("display", "none");
            }, this.popupmesssagedelay);
            this.$body.css("background-color", this.engine.CurrentColor.color);
        };
        GameScreen.prototype.onNextFrame = function (e) {
            var _this = this;
            if (e.Correct) {
                var now = +new Date;
                var delta = now - this.lastScoreTime;
                if (delta > 180) {
                    this.lastScoreTime = now;
                    var score = $("<div class=\"plusscore popupmessage\" style=\"display: block\"><span>+1</span></div>");
                    this.$plusscore.append(score);
                    score.addClass("animated fadeOutDown");
                    score.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                        score.remove();
                    });
                }
            }
            else {
                if (this.popupMessageCount < 3) {
                    this.popupMessageCount++;
                    var msg = $("<div class=\"oops popupmessage\" style=\"display: block\"><span>OOPS</span></div>");
                    this.$oops.append(msg);
                    msg.addClass("animated bounceIn");
                    msg.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                        msg.remove();
                        _this.popupMessageCount--;
                    });
                }
            }
            this.$score.text(this.engine.Score.toString());
            this.$body.css("background-color", this.engine.CurrentColor.color);
        };
        GameScreen.prototype.onTimeBonus = function (e) {
            var _this = this;
            this.$timebonus.find(".message > span").text("+" + e.ExtraTime);
            this.$timebonus.removeClass("animated bounceIn");
            this.$timebonus.css("display", "block");
            this.$timebonus.addClass("animated bounceIn");
            setTimeout(function () {
                _this.$timebonus.css("display", "none");
            }, this.popupmesssagedelay);
        };
        GameScreen.prototype.onTouchStart = function (e) {
            var that = this, frame = this.engine;
            e.preventDefault();
            // if (!frame.IsStarted) return;
            if (!e.originalEvent.touches || e.originalEvent.touches.length === 0) {
                return true;
            }
            var touchStart = e.originalEvent.touches[0], startX = touchStart.pageX, startY = touchStart.pageY, lastX = startX, lastY = startY, touchStartTime = new Date().getTime(), lastMoveTime = touchStartTime;
            function removeTouchHandler() {
                that.$body.off("touchmove", moveHandler).off("touchend", endHandler);
            }
            ;
            function endHandler(endEvent) {
                var timeDiff = new Date().getTime() - lastMoveTime;
                removeTouchHandler();
                if (timeDiff < 1000
                    && (Math.abs(lastX - startX) > 50 ||
                        Math.abs(lastY - startY) > 50)) {
                    if (frame.IsStarted) {
                        frame.swipe();
                    }
                }
                else {
                    if (frame.IsStarted) {
                        frame.tap();
                    }
                    that.waterRipple(lastX, lastY);
                }
                return true;
            }
            ;
            function moveHandler(moveEvent) {
                var touchMove = moveEvent.originalEvent.touches[0], movedX = Math.abs(touchMove.pageX - lastX), movedY = Math.abs(touchMove.pageY - lastY);
                // timeDiff = new Date().getTime() - lastMoveTime;
                if (movedX > 30 || movedY > 30) {
                    lastX = touchMove.pageX;
                    lastY = touchMove.pageY;
                    that.waterRipple(lastX, lastY);
                    that.showTouch(lastX, lastY);
                }
                lastMoveTime = new Date().getTime();
                return true;
            }
            that.waterRipple(lastX, lastY);
            that.showTouch(lastX, lastY);
            this.$body.on("touchmove", moveHandler).on("touchend", endHandler);
            return true;
        };
        GameScreen.prototype.showTouch = function (pageX, pageY) {
            if (!this.shouldRenderTouches) {
                return;
            }
            var target = this.$body;
            var ink = $("<div class='ripple'></div>");
            //if (target.find(".ink").length === 0)
            //    target.append(ink);
            //var ink = target.find(".ripple");
            //ink.removeClass("show");
            target.append(ink);
            var d = Math.max(target.width(), target.height());
            ink.css({ height: d / 2, width: d / 2 });
            var x = pageX - target.offset().left - ink.width() / 2;
            var y = pageY - target.offset().top - ink.height() / 2;
            ink.one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
                $(this).remove();
            });
            setTimeout(function () {
                ink.css({ top: y + "px", left: x + "px" }).addClass("show");
            }, 0);
        };
        GameScreen.prototype.resetRipples = function () {
            if (!this.shouldRenderRipples) {
                return;
            }
            this.$body.ripples("destroy");
            this.$body.ripples({
                resolution: 512,
                interactive: false
            });
        };
        GameScreen.prototype.renderRipple = function () {
            if (this.currentRipple.length > 0) {
                var ripple = this.currentRipple.pop();
                this.currentRipple = [];
                this.$body.ripples("drop", ripple.x, ripple.y, ripple.radius, ripple.strength);
            }
        };
        GameScreen.prototype.waterRipple = function (x, y, radius, strength) {
            if (radius === void 0) { radius = 10; }
            if (strength === void 0) { strength = 0.06; }
            if (!this.shouldRenderRipples) {
                return;
            }
            this.currentRipple.push({ x: x, y: y, radius: radius, strength: strength });
        };
        GameScreen.prototype.animLoop = function (render, speed) {
            var _this = this;
            if (speed === void 0) { speed = (1000 / 30); }
            var running, lastFrame = timestamp.now(), raf = window.requestAnimationFrame;
            var loop = function (now) {
                if (running !== false) {
                    raf(loop);
                    var elapsed = Math.min(1000, now - lastFrame);
                    if (speed <= 0 || elapsed > speed) {
                        lastFrame = now - (elapsed % speed);
                        running = render.bind(_this)(elapsed);
                    }
                }
            };
            loop(lastFrame);
        };
        return GameScreen;
    })(Screen_1.Screen);
    exports.GameScreen = GameScreen;
});
//# sourceMappingURL=GameScreen.js.map