/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/jquery.ripples/jquery.ripples.d.ts" />
/// <reference path="typings/ripple/ripple.d.ts" />
define(["require", "exports", "./Frame", "jquery"], function (require, exports, Frame_1, $) {
    var App;
    (function (App) {
        function initialize() {
            document.addEventListener("deviceready", onDeviceReady, false);
        }
        App.initialize = initialize;
        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener("pause", onPause, false);
            document.addEventListener("resume", onResume, false);
            var popupmesssagedelay = 750;
            var frame = new Frame_1.Frame();
            $("body").css("background-color", frame.CurrentColor.color);
            // $("#score > span").text(frame.Score);
            // $("#timer > span").text(frame.TimeLeft);
            $("body").on("touchstart", function (e) {
                e.preventDefault();
                if (!frame.IsStarted)
                    return;
                var touchStart = e.originalEvent.touches[0], startX = touchStart.pageX, startY = touchStart.pageY, lastX = startX, lastY = startY, touchStartTime = new Date().getTime();
                function removeTouchHandler() {
                    $("body").off("touchmove", moveHandler).off("touchend", endHandler);
                }
                ;
                function endHandler(endEvent) {
                    removeTouchHandler();
                    if (Math.abs(lastX - startX) > 75 ||
                        Math.abs(lastY - startY) > 75) {
                        if (frame.IsStarted) {
                            frame.swipe();
                            waterRipple(lastX, lastY, 20, 0.2);
                        }
                    }
                    else {
                        if (frame.IsStarted) {
                            frame.tap();
                        }
                        ripple();
                    }
                }
                ;
                function moveHandler(moveEvent) {
                    var touchMove = moveEvent.originalEvent.touches[0];
                    lastX = touchMove.pageX;
                    lastY = touchMove.pageY;
                    var movedX = Math.abs(lastX - startX);
                    var movedY = Math.abs(lastY - startY);
                    var timeDiff = new Date().getTime() - touchStartTime;
                    if (timeDiff < 50 &&
                        (movedX > 100 || movedY > 100)) {
                        waterRipple(lastX - Math.floor(movedX / 2), lastY - Math.floor(movedY / 2), 20, 0.2);
                    }
                    if (Math.abs(lastX - startX) > 10 ||
                        Math.abs(lastY - startY) > 10) {
                        waterRipple(lastX, lastY, 20, 0.2);
                    }
                }
                $("body").on("touchmove", moveHandler).on("touchend", endHandler);
            });
            $("#startbutton").on("touchstart", function (e) {
                frame.start();
            });
            frame.TimeBonus.on(function (x) {
                $("#timebonus .message > span").text("+" + x.ExtraTime);
                $("#timebonus").css("display", "block");
                $("#timebonus").addClass("animated bounceIn");
                setTimeout(function () {
                    $("#timebonus").css("display", "none");
                }, popupmesssagedelay);
            });
            frame.NextFrame.on(function (x) {
                $("#score > span").text(frame.Score);
                if (x.Correct) {
                    var score = $('<div class="plusscore popupmessage" style="display: block"><span></span></div>');
                    $("> span", score).text("+1");
                    $("#plusscore").append(score);
                    score.addClass("animated fadeOutDown");
                    setTimeout(function () {
                        score.remove();
                        // $("#plusscore").css("display", "none");
                    }, popupmesssagedelay);
                }
                else {
                    $("#oops").css("display", "block");
                    $("#oops").addClass("animated bounceIn");
                    setTimeout(function () {
                        $("#oops").css("display", "none");
                    }, popupmesssagedelay);
                }
                $("body").css("background-color", frame.CurrentColor.color);
            });
            frame.GameStarted.on(function (e) {
                resetRipples();
                $("#score > span").text(frame.Score);
                $("#timer > span").text(frame.TimeLeft);
                $("body").css("background-color", frame.CurrentColor.color);
                $("#startscreen").hide();
                $("#currentforbiddencolor").html("" + frame.CurrentColor.name);
            });
            frame.GameEnded.on(function (e) {
                $("#score > span").text(frame.Score);
                $("#timer > span").text(frame.TimeLeft);
                // $("body").css("background-color", frame.CurrentColor.color);
                resetRipples();
                $("#startscreen").show();
            });
            frame.TimerUpdated.on(function (e) {
                if (frame.TimeLeft < 3) {
                    $("#timer > span").text(frame.TimeLeft.toFixed(1));
                }
                else {
                    $("#timer > span").text(frame.TimeLeft.toFixed(0));
                }
            });
            frame.CountDownUpdated.on(function (e) {
                if (e.CountDown > 0) {
                    // $('#forbiddencolor').html('Forbidden color<br />' + frame.CurrentColor.name);
                    $("#forbiddencolor").show();
                }
                else {
                    $("#forbiddencolor").hide();
                    resetRipples();
                }
                var text = e.CountDown === 0 ? "Go" : e.CountDown; // (e.CountDown === 4 ? "Forbidden color" : e.CountDown);
                $("#countdown > span").text(text);
                $("#countdown").css("display", "block");
                $("#countdown").addClass("animated bounceIn");
                setTimeout(function () {
                    $("#countdown").css("display", "none");
                }, popupmesssagedelay);
                $("body").css("background-color", frame.CurrentColor.color);
            });
            resetRipples();
            animLoop(renderRipple);
        }
        function resetRipples() {
            $('body').ripples('destroy');
            $('body').ripples({
                resolution: 512,
                interactive: false
            });
        }
        function ripple() {
            $("body").ripple({});
        }
        var currentRipple = [];
        function renderRipple() {
            if (currentRipple.length > 0) {
                var ripple = currentRipple.pop();
                currentRipple = [];
                $("body").ripples("drop", ripple.x, ripple.y, ripple.radius, ripple.strength);
            }
        }
        function waterRipple(x, y, radius, strength) {
            currentRipple.push({ x: x, y: y, radius: radius, strength: strength });
        }
        function animLoop(render, speed) {
            if (speed === void 0) { speed = (1000 / 60); }
            var running, lastFrame = +new Date, raf = window.requestAnimationFrame;
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
    })(App || (App = {}));
    return App;
});
//# sourceMappingURL=app.js.map