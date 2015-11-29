define(["require", "exports", "app"], function (require, exports, App) {
    requirejs.config({
        baseUrl: "scripts",
        shim: {
            "jquery": {
                exports: "$"
            },
            "jquery.ripples": {
                exports: "$"
            },
            "jgestures": {
                exports: "$"
            }
        }
    });
    requirejs(["../cordova", "jquery", "jquery.ripples", "jgestures"], function () {
        //This function will be called when all the dependencies
        //listed above are loaded. Note that this function could
        //be called before the page is loaded.
        App.initialize();
    });
});
//# sourceMappingURL=index.js.map