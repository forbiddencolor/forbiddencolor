/// <reference path='typings/requirejs/require.d.ts' />
/// <reference path='typings/cordova/cordova.d.ts' />
requirejs.config({
    baseUrl: "scripts",
    paths: {
        "knockout": "libs/knockout",
        "jquery": "libs/jquery.min",
        "jquery.ripples": "libs/jquery.ripples"
    },
    shim: {
        jquery: {
            exports: "$"
        },
        knockout: {
            exports: "ko"
        },
        "jquery.ripples": {
            exports: "$",
            deps: ["jquery"]
        }
    }
});
requirejs(["../cordova", "jquery", "jquery.ripples", "app"], function (c, $, jr, App) {
    App.initialize();
});
//# sourceMappingURL=index.js.map