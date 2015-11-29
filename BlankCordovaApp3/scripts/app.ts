﻿/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/jquery.ripples/jquery.ripples.d.ts" />
/// <reference path="typings/ripple/ripple.d.ts" />

import {Frame} from "./Frame";
import * as $ from "jquery";

module App {
    var currentRipples = 0;
    var maxRipples = 30;
    var skipRipple = false;
    var rippleTimeout = null;

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

        $("body").on("touchstart", (e: any) => {
            e.preventDefault();

            var touchStart = e.originalEvent.touches[0],
                startX = touchStart.pageX,
                startY = touchStart.pageY,
                lastX = startX,
                lastY = startY,
                touchStartTime = new Date().getTime();

            function removeTouchHandler() {
                $("body").off("touchmove", moveHandler).off("touchend", endHandler);
            };

            function endHandler(endEvent) {
                removeTouchHandler();

                if (Math.abs(lastX - startX) > 75 ||
                    Math.abs(lastY - startY) > 75) {
                    if (frame.IsStarted) {
                        frame.swipe();
                        waterRipple(lastX, lastY, 15, 0.05, true);
                    }
                } else {
                    if (frame.IsStarted) {
                        frame.tap();
                    }

                    // ripple(lastX, lastY, 20, 0.04);
                    // ripple(lastX, lastY, 25, 0.06);
                    ripple();
                }
            };

            function moveHandler(moveEvent) {
                var touchMove = moveEvent.originalEvent.touches[0];
                lastX = touchMove.pageX;
                lastY = touchMove.pageY;

                var movedX = Math.abs(lastX - startX);
                var movedY = Math.abs(lastY - startY);
                var timeDiff = new Date().getTime() - touchStartTime;

                if (timeDiff < 50 &&
                    (movedX > 100 || movedY > 100)) {
                    
                    waterRipple(lastX - Math.floor(movedX / 2), lastY - Math.floor(movedY / 2), 15, 0.05, true);
                }

                if (Math.abs(lastX - startX) > 10 ||
                    Math.abs(lastY - startY) > 10) {

                    waterRipple(lastX, lastY, 15, 0.05);
                }
            }

            // ripple(startX, startY, 25, 0.06);
            // ripple(startX, startY, 30, 0.08);
            
            $("body").on("touchmove", moveHandler).on("touchend", endHandler);
        });

        $("#startbutton").on("touchstart", e => {
            frame.start();
        });

        frame.TimeBonus.on(x => {
            $("#timebonus .message > span").text("+" + x.ExtraTime);

            $("#timebonus").css("display", "block");
            $("#timebonus").addClass("animated bounceIn");
            setTimeout(() => {
                $("#timebonus").css("display", "none");
            }, popupmesssagedelay);
        });

        frame.NextFrame.on(x => {
            $("#score > span").text(frame.Score);

            if (x.Correct) {
                $("#plusscore > span").text("+1");

                $("#plusscore").css("display", "block");
                $("#plusscore").addClass("animated fadeOutDown");
                setTimeout(() => {
                    $("#plusscore").css("display", "none");
                }, popupmesssagedelay);
            } else {
                $("#oops").css("display", "block");
                $("#oops").addClass("animated bounceIn");
                setTimeout(() => {
                    $("#oops").css("display", "none");
                }, popupmesssagedelay);
            }

            $("body").css("background-color", frame.CurrentColor.color);
        });

        frame.GameStarted.on(e => {
            resetRipples();

            $("#score > span").text(frame.Score);
            $("#timer > span").text(frame.TimeLeft);
            $("body").css("background-color", frame.CurrentColor.color);
            $("#startscreen").hide();
            $("#currentforbiddencolor").html("" + frame.CurrentColor.name);
        });

        frame.GameEnded.on(e => {
            $("#score > span").text(frame.Score);
            $("#timer > span").text(frame.TimeLeft);
            // $("body").css("background-color", frame.CurrentColor.color);
            resetRipples();
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
                // $('#forbiddencolor').html('Forbidden color<br />' + frame.CurrentColor.name);
                $("#forbiddencolor").show();
            } else {
                $("#forbiddencolor").hide();
                resetRipples();
            }

            var text = e.CountDown === 0 ? "Go" : e.CountDown; // (e.CountDown === 4 ? "Forbidden color" : e.CountDown);

            $("#countdown > span").text(text);
            $("#countdown").css("display", "block");
            $("#countdown").addClass("animated bounceIn");
            setTimeout(() => {
                $("#countdown").css("display", "none");
            }, popupmesssagedelay);

            $("body").css("background-color", frame.CurrentColor.color);
        });

        resetRipples();
    }

    function resetRipples() {
        $('body').ripples('destroy');

        $('body').ripples({
            resolution: 256,
            interactive: false
        });
    }

    function ripple() {
        $("body").ripple({});
    }

    function waterRipple(x: number, y: number, radius: number, strength: number, force: boolean = false) {
        if (!force && currentRipples > maxRipples) {
            if (rippleTimeout) {
                clearTimeout(rippleTimeout);
            }

            rippleTimeout = setTimeout(() => {
                $("body").ripples("drop", x, y, radius, strength);
            }, 50);

            return;
        }

        $("body").ripples("drop", x, y, radius, strength);
        currentRipples++;

        setTimeout(() => {
            currentRipples--;
        }, 1000);
    }

    function animLoop(render, speed: number = (1000 / 60)) {
        var running, lastFrame = +new Date,
            raf = window.requestAnimationFrame;
        function loop(now) {
            // stop the loop if render returned false
            if (running !== false) {
                raf(loop);
                var deltaT = now - lastFrame;
                if (deltaT < speed) {
                    running = render(deltaT);
                }
                lastFrame = now;
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