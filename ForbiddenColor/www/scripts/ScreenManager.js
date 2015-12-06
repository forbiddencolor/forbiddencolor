define(["require", "exports"], function (require, exports) {
    var ScreenManager;
    (function (ScreenManager) {
        "use strict";
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