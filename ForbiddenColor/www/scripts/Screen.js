define(["require", "exports", "jquery"], function (require, exports, $) {
    "use strict";
    var Screen = (function () {
        function Screen(id) {
            this.Id = id;
        }
        Screen.prototype.show = function () {
            $("#" + this.Id).show();
        };
        Screen.prototype.hide = function () {
            $("#" + this.Id).hide();
        };
        return Screen;
    })();
    exports.Screen = Screen;
});
//# sourceMappingURL=Screen.js.map