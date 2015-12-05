define(["require", "exports"], function (require, exports) {
    "use strict";
    var ScreenManager;
    (function (ScreenManager) {
        var screens = [];
        function addScreen(name, screen) {
            screens[name] = screen;
        }
        ScreenManager.addScreen = addScreen;
        function getScreen(name) {
            return screens[name];
        }
        ScreenManager.getScreen = getScreen;
    })(ScreenManager || (ScreenManager = {}));
    return ScreenManager;
});
//# sourceMappingURL=ScreenManager.js.map