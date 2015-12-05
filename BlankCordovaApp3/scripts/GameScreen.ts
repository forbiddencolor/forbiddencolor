"use strict";

import * as Engine from "Frame"
import {Screen} from "Screen"
import {GameOverScreen} from "GameOverScreen"

export class GameScreen extends Screen {
    private currentRipple = [];
    private popupMessageCount = 0;
    private lastScoreTime = +new Date;

    public shouldRenderRipples = false;
    public shouldRenderTouches = false;
    public popupmesssagedelay = 750;

    constructor(engine: Engine.Frame) {
        super("gamescreen");

        this.engine = engine;
        this.gameOverScreen = new GameOverScreen(engine);

        this.engine.TimeBonus.on(e=> this.onTimeBonus(e));
        this.engine.NextFrame.on(e=> this.onNextFrame(e));
        this.engine.GameStarted.on(e=> this.onGameStarted(e));
        this.engine.GameEnded.on(e=> this.onGameEnded(e));
        this.engine.TimerUpdated.on(e=> this.onTimerUpdated(e));
        this.engine.CountDownUpdated.on(e=> this.onCountDownUpdated(e));

        // ko.applyBindings(this, $("#gamescreen")[0]);
    }

    public show() {
        $("body").css("background-color", this.engine.CurrentColor.color);
        super.show();
        this.__onTouchStart = this.onTouchStart.bind(this);
        $("body").on('touchstart', this.__onTouchStart);
        this.engine.start();

        this.resetRipples();
        if (this.shouldRenderRipples) {
            this.animLoop(this.renderRipple);
        }
    }

    public hide() {
        $("body").off('touchstart', this.__onTouchStart);
        super.hide();
    }

    private onTimerUpdated(e: Engine.TimerUpdatedEventArgs) {
        if (this.engine.TimeLeft < 3) {
            $("#timer > span").text(this.engine.TimeLeft.toFixed(1));
        } else {
            $("#timer > span").text(this.engine.TimeLeft.toFixed(0));
        }
    }

    private onGameEnded(e: Engine.GameEndedEventArgs) {
        $("#score > span").text(this.engine.Score.toString());
        $("#timer > span").text(this.engine.TimeLeft.toString());
        this.hide();
        this.gameOverScreen.score(e.Score);
        this.gameOverScreen.show();
    }

    private onGameStarted(e: Engine.GameStartedEventArgs) {
        $("#score > span").text(this.engine.Score.toString());
        $("#timer > span").text(this.engine.TimeLeft.toString());
        $("body").css("background-color", this.engine.CurrentColor.color);
        $("#startscreen").hide();
        $("#currentforbiddencolor").html("" + this.engine.CurrentColor.name);
    }

    private onCountDownUpdated(e: Engine.CountDownEventArgs) {
        if (e.CountDown > 0) {
            $('#forbiddencolor > span').html('Forbidden color<br />' + this.engine.CurrentColor.name);
            $("#forbiddencolor").removeClass("animated fadeOut");
            $("#forbiddencolor").show();
        } else {
            $("#forbiddencolor").addClass("animated fadeOut");
            this.resetRipples();
        }

        var text = e.CountDown === 0 ? "Go" : e.CountDown.toString();

        $("#countdown > span").text(text);
        $("#countdown").css("display", "block");
        $("#countdown").addClass("animated bounceIn");
        setTimeout(() => {
            $("#countdown").css("display", "none");
        }, this.popupmesssagedelay);

        $("body").css("background-color", this.engine.CurrentColor.color);
    }

    private onNextFrame(e: Engine.NextFrameEventArgs) {
        if (e.Correct) {
            var now = +new Date;
            var delta = now - this.lastScoreTime;
            if (delta > 180) {
                this.lastScoreTime = now;
                var score = $('<div class="plusscore popupmessage" style="display: block"><span></span></div>');
                $("> span", score).text("+1");
                $("#plusscore").append(score);
                score.addClass("animated fadeOutDown");
                score.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", () => {
                    score.remove();
                });
            }
        } else {
            if (this.popupMessageCount < 3) {
                this.popupMessageCount++;
                var $oops = $("#oops");
                var msg = $('<div class="oops popupmessage" style="display: block"><span></span></div>');
                $("> span", msg).text("OOPS");
                $oops.append(msg);
                msg.addClass("animated bounceIn");
                msg.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", () => {
                    msg.remove();
                    this.popupMessageCount--;
                });
            }
        }

        $("#score > span").text(this.engine.Score.toString());
        $("body").css("background-color", this.engine.CurrentColor.color);
    }

    private onTimeBonus(e: Engine.TimeBonusEventArgs) {
        $("#timebonus .message > span").text("+" + e.ExtraTime);

        $("#timebonus").removeClass("animated bounceIn");
        $("#timebonus").css("display", "block");
        $("#timebonus").addClass("animated bounceIn");
        setTimeout(() => {
            $("#timebonus").css("display", "none");
        }, this.popupmesssagedelay);
    }

    private onTouchStart(e: any) {
        var that = this,
            frame = this.engine;
        e.preventDefault();
            
        // if (!frame.IsStarted) return;

        if (!e.originalEvent.touches || e.originalEvent.touches.length === 0) return true;

        var touchStart = e.originalEvent.touches[0],
            startX: number = touchStart.pageX,
            startY: number = touchStart.pageY,
            lastX = startX,
            lastY = startY,
            touchStartTime = new Date().getTime(),
            lastMoveTime = touchStartTime;

        function removeTouchHandler() {
            $("body").off("touchmove", moveHandler).off("touchend", endHandler);
        };

        function endHandler(endEvent): boolean {
            var timeDiff = new Date().getTime() - lastMoveTime;
            removeTouchHandler();

            if (timeDiff < 1000
                && (Math.abs(lastX - startX) > 50 ||
                    Math.abs(lastY - startY) > 50)) {
                if (frame.IsStarted) {
                    frame.swipe();
                }

                //showTouch(startX, startY);
                //showTouch(lastX - ((lastX - startX) / 2), lastY - ((lastY - startY) / 2));
                //showTouch(lastX, lastY);
            } else {
                if (frame.IsStarted) {
                    frame.tap();
                }

                that.waterRipple(lastX, lastY);
            }

            return true;
        };

        function moveHandler(moveEvent): boolean {
            var touchMove = moveEvent.originalEvent.touches[0],
                movedX = Math.abs(touchMove.pageX - lastX),
                movedY = Math.abs(touchMove.pageY - lastY),
                timeDiff = new Date().getTime() - lastMoveTime;

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
    }

    private showTouch(pageX, pageY) {
        if (!this.shouldRenderTouches) return;

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

        setTimeout(() => {
            ink.css({ top: y + 'px', left: x + 'px' }).addClass("show");
        }, 0);
    }

    private resetRipples() {
        if (!this.shouldRenderRipples) return;

        $("body").ripples("destroy");

        $("body").ripples({
            resolution: 512,
            interactive: false
        });
    }


    private renderRipple() {
        if (this.currentRipple.length > 0) {
            var ripple = this.currentRipple.pop();
            this.currentRipple = [];
            $("body").ripples("drop", ripple.x, ripple.y, ripple.radius, ripple.strength);
        }
    }

    private waterRipple(x: number, y: number, radius: number = 10, strength: number = 0.06) {
        if (!this.shouldRenderRipples) return;

        this.currentRipple.push({ x, y, radius, strength });
    }

    private animLoop(render: Function, speed: number = (1000 / 30)) {
        function timestamp() {
            return window.performance && window.performance.now ? window.performance.now() : +new Date;
        }

        var running, lastFrame = timestamp(),
            raf = window.requestAnimationFrame,
            that = this;
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
    }
    engine: Engine.Frame;
    __onTouchStart : any;
    gameOverScreen: GameOverScreen;
}