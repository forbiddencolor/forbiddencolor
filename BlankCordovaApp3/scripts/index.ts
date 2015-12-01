/// <reference path='typings/requirejs/require.d.ts' />
/// <reference path='typings/cordova/cordova.d.ts' />

requirejs.config({
    baseUrl: "scripts",
    paths: {
        "jquery": "libs/jquery.min",
        "jquery.ripples": "libs/jquery.ripples"
    },
    shim: {
        jquery: {
            exports: "$"
        },
        "jquery.ripples": {
            exports: "$",
            deps: ["jquery"]
        }
    }

});
requirejs(["../cordova", "jquery", "jquery.ripples", "app"], (c, $, jr, App) => {
    App.initialize();
});