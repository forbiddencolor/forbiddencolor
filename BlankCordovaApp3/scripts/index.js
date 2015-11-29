define(["require", "exports", './app'], function (require, exports, App) {
    requirejs.config({
        baseUrl: 'scripts',
        paths: {
            jquery: 'jquery'
        }
    });
    requirejs(['../cordova'], function () {
        //This function will be called when all the dependencies
        //listed above are loaded. Note that this function could
        //be called before the page is loaded.
        window.onload = function () {
            App.initialize();
        };
    });
});
//# sourceMappingURL=index.js.map