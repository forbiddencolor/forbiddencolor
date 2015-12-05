var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "Screen", "GameOverScreen", "ScreenManager"], function (require, exports, Screen_1, GameOverScreen_1, ScreenManager) {
    "use strict";
    var GameScreen = (function (_super) {
        __extends(GameScreen, _super);
        function GameScreen(engine) {
            var _this = this;
            _super.call(this, "gamescreen");
            this.currentRipple = [];
            this.popupMessageCount = 0;
            this.lastScoreTime = +new Date;
            this.shouldRenderRipples = false;
            this.shouldRenderTouches = false;
            this.popupmesssagedelay = 750;
            ScreenManager.addScreen("gamescreen", this);
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
            $("body").css("background-color", this.engine.CurrentColor.color);
            _super.prototype.show.call(this);
            this.__onTouchStart = this.onTouchStart.bind(this);
            $("body").on('touchstart', this.__onTouchStart);
            this.engine.start();
            this.resetRipples();
            if (this.shouldRenderRipples) {
                this.animLoop(this.renderRipple);
            }
        };
        GameScreen.prototype.hide = function () {
            $("body").off('touchstart', this.__onTouchStart);
            _super.prototype.hide.call(this);
        };
        GameScreen.prototype.onTimerUpdated = function (e) {
            if (this.engine.TimeLeft < 3) {
                $("#timer > span").text(this.engine.TimeLeft.toFixed(1));
            }
            else {
                $("#timer > span").text(this.engine.TimeLeft.toFixed(0));
            }
        };
        GameScreen.prototype.onGameEnded = function (e) {
            $("#score > span").text(this.engine.Score.toString());
            $("#timer > span").text(this.engine.TimeLeft.toString());
            this.hide();
            this.gameOverScreen.score(e.Score);
            this.gameOverScreen.show();
        };
        GameScreen.prototype.onGameStarted = function (e) {
            $("#score > span").text(this.engine.Score.toString());
            $("#timer > span").text(this.engine.TimeLeft.toString());
            $("body").css("background-color", this.engine.CurrentColor.color);
            $("#startscreen").hide();
            $("#currentforbiddencolor").html("" + this.engine.CurrentColor.name);
        };
        GameScreen.prototype.onCountDownUpdated = function (e) {
            if (e.CountDown > 0) {
                $('#forbiddencolor > span').html('Forbidden color<br />' + this.engine.CurrentColor.name);
                $("#forbiddencolor").removeClass("animated fadeOut");
                $("#forbiddencolor").show();
            }
            else {
                $("#forbiddencolor").addClass("animated fadeOut");
                this.resetRipples();
            }
            var text = e.CountDown === 0 ? "Go" : e.CountDown.toString();
            $("#countdown > span").text(text);
            $("#countdown").css("display", "block");
            $("#countdown").addClass("animated bounceIn");
            setTimeout(function () {
                $("#countdown").css("display", "none");
            }, this.popupmesssagedelay);
            $("body").css("background-color", this.engine.CurrentColor.color);
        };
        GameScreen.prototype.onNextFrame = function (e) {
            var _this = this;
            if (e.Correct) {
                var now = +new Date;
                var delta = now - this.lastScoreTime;
                if (delta > 180) {
                    this.lastScoreTime = now;
                    var score = $('<div class="plusscore popupmessage" style="display: block"><span></span></div>');
                    $("> span", score).text("+1");
                    $("#plusscore").append(score);
                    score.addClass("animated fadeOutDown");
                    score.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                        score.remove();
                    });
                }
            }
            else {
                if (this.popupMessageCount < 3) {
                    this.popupMessageCount++;
                    var $oops = $("#oops");
                    var msg = $('<div class="oops popupmessage" style="display: block"><span></span></div>');
                    $("> span", msg).text("OOPS");
                    $oops.append(msg);
                    msg.addClass("animated bounceIn");
                    msg.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                        msg.remove();
                        _this.popupMessageCount--;
                    });
                }
            }
            $("#score > span").text(this.engine.Score.toString());
            $("body").css("background-color", this.engine.CurrentColor.color);
        };
        GameScreen.prototype.onTimeBonus = function (e) {
            $("#timebonus .message > span").text("+" + e.ExtraTime);
            $("#timebonus").removeClass("animated bounceIn");
            $("#timebonus").css("display", "block");
            $("#timebonus").addClass("animated bounceIn");
            setTimeout(function () {
                $("#timebonus").css("display", "none");
            }, this.popupmesssagedelay);
        };
        GameScreen.prototype.onTouchStart = function (e) {
            var that = this, frame = this.engine;
            e.preventDefault();
            // if (!frame.IsStarted) return;
            if (!e.originalEvent.touches || e.originalEvent.touches.length === 0)
                return true;
            var touchStart = e.originalEvent.touches[0], startX = touchStart.pageX, startY = touchStart.pageY, lastX = startX, lastY = startY, touchStartTime = new Date().getTime(), lastMoveTime = touchStartTime;
            function removeTouchHandler() {
                $("body").off("touchmove", moveHandler).off("touchend", endHandler);
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
                var touchMove = moveEvent.originalEvent.touches[0], movedX = Math.abs(touchMove.pageX - lastX), movedY = Math.abs(touchMove.pageY - lastY), timeDiff = new Date().getTime() - lastMoveTime;
                if (movedX > 60 || movedY > 60) {
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
            $("body").on('touchmove', moveHandler).on("touchend", endHandler);
            return true;
        };
        GameScreen.prototype.showTouch = function (pageX, pageY) {
            if (!this.shouldRenderTouches)
                return;
            var target = $("#page");
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
            ink.one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function () {
                $(this).remove();
            });
            setTimeout(function () {
                ink.css({ top: y + 'px', left: x + 'px' }).addClass("show");
            }, 0);
        };
        GameScreen.prototype.resetRipples = function () {
            if (!this.shouldRenderRipples)
                return;
            $("body").ripples("destroy");
            $("body").ripples({
                resolution: 512,
                interactive: false
            });
        };
        GameScreen.prototype.renderRipple = function () {
            if (this.currentRipple.length > 0) {
                var ripple = this.currentRipple.pop();
                this.currentRipple = [];
                $("body").ripples("drop", ripple.x, ripple.y, ripple.radius, ripple.strength);
            }
        };
        GameScreen.prototype.waterRipple = function (x, y, radius, strength) {
            if (radius === void 0) { radius = 10; }
            if (strength === void 0) { strength = 0.06; }
            if (!this.shouldRenderRipples)
                return;
            this.currentRipple.push({ x: x, y: y, radius: radius, strength: strength });
        };
        GameScreen.prototype.animLoop = function (render, speed) {
            if (speed === void 0) { speed = (1000 / 30); }
            function timestamp() {
                return window.performance && window.performance.now ? window.performance.now() : +new Date;
            }
            var running, lastFrame = timestamp(), raf = window.requestAnimationFrame, that = this;
            function loop(now) {
                if (running !== false) {
                    raf(loop);
                    var elapsed = Math.min(1000, now - lastFrame);
                    if (speed <= 0 || elapsed > speed) {
                        lastFrame = now - (elapsed % speed);
                        running = render.bind(that)(elapsed);
                    }
                }
            }
            loop(lastFrame);
        };
        return GameScreen;
    })(Screen_1.Screen);
    exports.GameScreen = GameScreen;
});
//# sourceMappingURL=GameScreen.js.map