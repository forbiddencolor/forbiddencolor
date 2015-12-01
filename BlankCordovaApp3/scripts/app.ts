/// <reference path="typings/jquery/jquery.d.ts" />

import {Frame} from "./Frame";
import * as $ from "jquery";

// import * as $ from "zepto";
// import $ = require("zepto");
// var $ = require("zepto");

module App {
    export var shouldRenderRipples = false;
    export var shouldRenderTouches = false;

    export function initialize() {
        document.addEventListener("deviceready", onDeviceReady, false);
    }

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener("pause", onPause, false);
        document.addEventListener("resume", onResume, false);

        var popupmesssagedelay = 750;
        var frame = new Frame();

        $("body").css("background-color", frame.CurrentColor.color);
        // $("#score > span").text(frame.Score);
        // $("#timer > span").text(frame.TimeLeft);

        $("body").on('touchstart', (e: any) => {
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

                    waterRipple(lastX, lastY);
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

                    waterRipple(lastX, lastY);
                    showTouch(lastX, lastY);
                }

                lastMoveTime = new Date().getTime();

                return true;
            }

            waterRipple(lastX, lastY);
            showTouch(lastX, lastY);
            $("body").on('touchmove', moveHandler).on("touchend", endHandler);
            return true;
        });

        $("#startbutton").on("touchstart", e => {
            e.preventDefault();
            e.stopPropagation();

            frame.start();
            return true;
        });

        frame.TimeBonus.on(x => {
            $("#timebonus .message > span").text("+" + x.ExtraTime);

            $("#timebonus").removeClass("animated bounceIn");
            $("#timebonus").css("display", "block");
            $("#timebonus").addClass("animated bounceIn");
            setTimeout(() => {
                $("#timebonus").css("display", "none");
            }, popupmesssagedelay);
        });

        var popupMessageCount = 0;
        var lastScoreTime = +new Date;
        frame.NextFrame.on(x => {
            if (x.Correct) {
                var now = +new Date;
                var delta = now - lastScoreTime;
                if (delta > 180) {
                    lastScoreTime = now;
                    var score = $('<div class="plusscore popupmessage" style="display: block"><span></span></div>');
                    $("> span", score).text("+1");
                    $("#plusscore").append(score);
                    score.addClass("animated fadeOutDown");
                    score.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", () => {
                        score.remove();
                    });                    
                }
            } else {
                if (popupMessageCount < 3) {
                    popupMessageCount++
                    var $oops = $("#oops");
                    var msg = $('<div class="oops popupmessage" style="display: block"><span></span></div>');
                    $("> span", msg).text("OOPS");
                    $oops.append(msg);
                    msg.addClass("animated bounceIn");
                    msg.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", () => {
                        msg.remove();
                        popupMessageCount--;
                    });
                }
            }

            $("#score > span").text(frame.Score.toString());
            $("body").css("background-color", frame.CurrentColor.color);
        });

        frame.GameStarted.on(e => {
            $("#score > span").text(frame.Score.toString());
            $("#timer > span").text(frame.TimeLeft.toString());
            $("body").css("background-color", frame.CurrentColor.color);
            $("#startscreen").hide();
            $("#currentforbiddencolor").html("" + frame.CurrentColor.name);
        });

        frame.GameEnded.on(e => {
            $("#score > span").text(frame.Score.toString());
            $("#timer > span").text(frame.TimeLeft.toString());
            $("#startscreen").show();
        });

        frame.TimerUpdated.on(e => {
            if (frame.TimeLeft < 3) {
                $("#timer > span").text(frame.TimeLeft.toFixed(1));
            } else {
                $("#timer > span").text(frame.TimeLeft.toFixed(0));
            }
        });

        frame.CountDownUpdated.on(e => {
            if (e.CountDown > 0) {
                $('#forbiddencolor > span').html('Forbidden color<br />' + frame.CurrentColor.name);
                $("#forbiddencolor").removeClass("animated fadeOut");
                $("#forbiddencolor").show();
            } else {
                $("#forbiddencolor").addClass("animated fadeOut");
                resetRipples();
            }

            var text = e.CountDown === 0 ? "Go" : e.CountDown.toString();

            $("#countdown > span").text(text);
            $("#countdown").css("display", "block");
            $("#countdown").addClass("animated bounceIn");
            setTimeout(() => {
                $("#countdown").css("display", "none");
            }, popupmesssagedelay);

            $("body").css("background-color", frame.CurrentColor.color);
        });

        resetRipples();
        if (shouldRenderRipples) {
            animLoop(renderRipple);
        }
    }

    function showTouch(pageX, pageY) {
        if (!shouldRenderTouches) return;

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

    function resetRipples() {
        if (!shouldRenderRipples) return;

        $("body").ripples("destroy");

        $("body").ripples({
            resolution: 512,
            interactive: false
        });
    }

    var currentRipple = [];

    function renderRipple() {
        if (currentRipple.length > 0) {
            var ripple = currentRipple.pop();
            currentRipple = [];
            $("body").ripples("drop", ripple.x, ripple.y, ripple.radius, ripple.strength);
        }
    }

    function waterRipple(x: number, y: number, radius: number = 10, strength: number = 0.06) {
        if (!shouldRenderRipples) return;

        currentRipple.push({ x, y, radius, strength});
    }

    function animLoop(render: Function, speed: number = (1000 / 30)) {
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

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    }

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    }

}

export = App;