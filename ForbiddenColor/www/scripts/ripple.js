define(["require", "exports"], function (require, exports) {
    "use strict";
    var QUALITY = 1, WIDTH = Math.floor(window.innerWidth / QUALITY), HEIGHT = Math.floor(window.innerHeight / QUALITY), SIZE = WIDTH * HEIGHT, context, image, data, buffer1, buffer2, tempbuffer, isUserInteracting, pointers;
    function init() {
        var $container = $("body");
        var canvas = document.createElement("canvas");
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        var $canvas = $(canvas);
        $canvas.css({
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: -1
        });
        $container.append(canvas);
        context = canvas.getContext("2d");
        context.fillStyle = $("body").css("background-color");
        context.fillRect(0, 0, WIDTH, HEIGHT);
        image = context.getImageData(0, 0, WIDTH, HEIGHT);
        data = image.data;
        buffer1 = [];
        buffer2 = [];
        for (var i = 0; i < SIZE; i++) {
            buffer1[i] = 0;
            buffer2[i] = i > WIDTH && i < SIZE - WIDTH && Math.random() > 0.995 ? 255 : 0;
        }
        document.addEventListener("mousedown", onDocumentMouseDown, false);
        document.addEventListener("mousemove", onDocumentMouseMove, false);
        document.addEventListener("mouseup", onDocumentMouseUp, false);
        document.addEventListener("mouseout", onDocumentMouseOut, false);
        document.addEventListener("touchstart", onDocumentTouchStart, false);
        document.addEventListener("touchmove", onDocumentTouchMove, false);
        document.addEventListener("touchend", onDocumentTouchEnd, false);
        document.addEventListener("keyup", onDocumentKeyUp, false);
        $(window).on("resize", function () {
            if (window.innerWidth !== canvas.width || window.innerHeight !== canvas.height) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        });
        setInterval(loop, 1000 / 60);
    }
    exports.init = init;
    // Event Handlers
    function onDocumentMouseDown(event) {
        event.preventDefault();
        isUserInteracting = true;
        pointers = [[event.clientX / QUALITY, event.clientY / QUALITY]];
    }
    function onDocumentMouseMove(event) {
        pointers = [[event.clientX / QUALITY, event.clientY / QUALITY]];
    }
    function onDocumentMouseUp(event) {
        isUserInteracting = false;
    }
    function onDocumentMouseOut(event) {
        isUserInteracting = false;
    }
    function onDocumentTouchStart(event) {
        isUserInteracting = true;
        event.preventDefault();
        pointers = [];
        for (var i = 0; i < event.touches.length; i++) {
            pointers.push([event.touches[i].pageX / QUALITY, event.touches[i].pageY / QUALITY]);
        }
    }
    function onDocumentTouchMove(event) {
        event.preventDefault();
        pointers = [];
        for (var i = 0; i < event.touches.length; i++) {
            pointers.push([event.touches[i].pageX / QUALITY, event.touches[i].pageY / QUALITY]);
        }
    }
    function onDocumentTouchEnd(event) {
        event.preventDefault();
        isUserInteracting = false;
    }
    function onDocumentKeyUp(e) {
        emit(Math.random() * WIDTH, Math.random() * HEIGHT);
    }
    function emit(x, y) {
        buffer1[Math.floor(x) + (Math.floor(y) * WIDTH)] = 255;
    }
    function loop() {
        if (isUserInteracting) {
            for (var i = 0; i < pointers.length; i++) {
                emit(pointers[i][0], pointers[i][1]);
            }
        }
        var pixel;
        var iMax = (WIDTH * HEIGHT) - WIDTH;
        for (var i = WIDTH; i < iMax; i++) {
            pixel = ((buffer1[i - 1] + buffer1[i + 1] + buffer1[i - WIDTH] + buffer1[i + WIDTH]) >> 1) - buffer2[i];
            pixel -= pixel >> 20;
            buffer2[i] = pixel;
            pixel = pixel > 255 ? 255 : pixel < 0 ? 0 : pixel;
            data[(i * 4) + 1] = pixel;
            data[((i + 1) * 4) + 2] = pixel;
        }
        tempbuffer = buffer1;
        buffer1 = buffer2;
        buffer2 = tempbuffer;
        // context.fillStyle = $("body").css("background-color");
        // context.fillRect(0, 0, WIDTH, HEIGHT);
        context.putImageData(image, 0, 0);
    }
});
//# sourceMappingURL=ripple.js.map