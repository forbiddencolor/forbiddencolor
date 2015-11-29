/// <reference path="typings/jquery/jquery.d.ts" />
/// <reference path="typings/jquery.ripples/jquery.ripples.d.ts" />
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
                // if (!frame.IsStarted) return;
                if (!e.originalEvent.touches || e.originalEvent.touches.length === 0)
                    return;
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
                        waterRipple(lastX, lastY, 20, 0.2);
                    }
                }
                ;
                function moveHandler(moveEvent) {
                    var touchMove = moveEvent.originalEvent.touches[0], movedX = Math.abs(touchMove.pageX - lastX), movedY = Math.abs(touchMove.pageY - lastY), timeDiff = new Date().getTime() - lastMoveTime;
                    if (movedX > 30 || movedY > 30) {
                        lastX = touchMove.pageX;
                        lastY = touchMove.pageY;
                        waterRipple(lastX, lastY, 20, 0.2);
                    }
                    lastMoveTime = new Date().getTime();
                }
                waterRipple(lastX, lastY, 20, 0.2);
                $("body").on("touchmove", moveHandler).on("touchend", endHandler);
            });
            $("#startbutton").on("touchstart", function (e) {
                e.preventDefault();
                e.stopPropagation();
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
                if (x.Correct) {
                    var score = $('<div class="plusscore popupmessage" style="display: block"><span></span></div>');
                    $("> span", score).text("+1");
                    $("#plusscore").append(score);
                    score.addClass("animated fadeOutDown");
                    score.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                        score.remove();
                    });
                }
                else {
                    var $oops = $("#oops");
                    var msg = $('<div class="oops popupmessage" style="display: block"><span></span></div>');
                    $("> span", msg).text("OOPS");
                    $oops.append(msg);
                    msg.addClass("animated bounceIn");
                    msg.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                        msg.remove();
                    });
                    var pos = $oops.position(), rippleX = $('body').outerWidth() / 2, rippleY = pos.top;
                }
                $("#score > span").text(frame.Score);
                $("body").css("background-color", frame.CurrentColor.color);
            });
            frame.GameStarted.on(function (e) {
                $("#score > span").text(frame.Score);
                $("#timer > span").text(frame.TimeLeft);
                $("body").css("background-color", frame.CurrentColor.color);
                $("#startscreen").hide();
                $("#currentforbiddencolor").html("" + frame.CurrentColor.name);
            });
            frame.GameEnded.on(function (e) {
                $("#score > span").text(frame.Score);
                $("#timer > span").text(frame.TimeLeft);
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
                    $('#forbiddencolor > span').html('Forbidden color<br />' + frame.CurrentColor.name);
                    $("#forbiddencolor").show();
                }
                else {
                    $("#forbiddencolor").addClass("animated fadeOut");
                    resetRipples();
                }
                var text = e.CountDown === 0 ? "Go" : e.CountDown;
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
        function showRipple(pageX, pageY) {
            var target = $("#page");
            var ink = $("<span class='ripple'></span>");
            //if (target.find(".ink").length === 0)
            //    target.append(ink);
            //var ink = target.find(".ripple");
            //ink.removeClass("show");
            target.append(ink);
            if (!ink.height() && !ink.width()) {
                var d = Math.max(target.outerWidth(), target.outerHeight());
                // ink.css({ height: d, width: d });
                // ink.css({ height: '50px', width: '50px' });
                ink.css({ height: d / 2, width: d / 2 });
            }
            var x = pageX - target.offset().left - ink.width() / 2;
            var y = pageY - target.offset().top - ink.height() / 2;
            ink.css({ top: y + 'px', left: x + 'px' }).addClass("show");
            ink.one('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function () {
                $(this).remove();
            });
        }
        function resetRipples() {
            $("body").ripples("destroy");
            $("body").ripples({
                resolution: 384,
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
        function waterRipple(x, y, radius, strength) {
            currentRipple.push({ x: x, y: y, radius: radius, strength: strength });
        }
        function animLoop(render, speed, clamp) {
            if (speed === void 0) { speed = (1000 / 30); }
            if (clamp === void 0) { clamp = 500; }
            function timestamp() {
                return window.performance && window.performance.now ? window.performance.now() : +new Date;
            }
            var running, lastFrame = timestamp(), raf = window.requestAnimationFrame, that = this;
            function loop(now) {
                if (running !== false) {
                    raf(loop);
                    var elapsed = Math.min(1000, now - lastFrame);
                    if ((speed <= 0 || elapsed > speed) && elapsed < clamp) {
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
    })(App || (App = {}));
    return App;
});
//# sourceMappingURL=app.js.map