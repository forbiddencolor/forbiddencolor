define(["require", "exports", "jquery", "ScreenManager"], function (require, exports, $, ScreenManager) {
    "use strict";
    var Screen = (function () {
        function Screen(id) {
            this.Id = id;
            ScreenManager.addScreen(id, this);
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