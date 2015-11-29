/// <reference path='typings/requirejs/require.d.ts' />
/// <reference path='typings/cordova/cordova.d.ts' />
import App = require("app");

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
        },
        "ripple": {
            exports: "$"
        }
    }

    //only use shim config for non- AMD scripts,
    //scripts that do not already call define(). The shim
    //config will not work correctly if used on AMD scripts,
    //in particular, the exports and init config will not
    //be triggered, and the deps config will be confusing
    //for those cases.
});
requirejs(["../cordova", "jquery", "jquery.ripples", "jgestures", "ripple"], () => {
    //This function will be called when all the dependencies
    //listed above are loaded. Note that this function could
    //be called before the page is loaded.
    App.initialize();
});