import {Screen} from "Screen";

module ScreenManager {

    "use strict";

    var screens: Screen[] = [];

    export function addScreen(name: string, screen: Screen): void {
        screens[name] = screen;
    }

    export function getScreen(name: string): Screen {
        return screens[name];
    }
}

export = ScreenManager;