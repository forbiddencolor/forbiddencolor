define(["require", "exports"], function (require, exports) {
    var TimeStamp;
    (function (TimeStamp) {
        "use strict";
        TimeStamp.now = window.performance && window.performance.now
            ? function () { return window.performance.now(); }
            : function () { return +new Date; };
    })(TimeStamp || (TimeStamp = {}));
    return TimeStamp;
});
//# sourceMappingURL=timestamp.js.map