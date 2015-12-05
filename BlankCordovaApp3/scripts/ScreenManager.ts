"use strict";

import {Screen} from "Screen";

module ScreenManager {
    var screens: Screen[] = [];

    export function addScreen(name: string, screen: Screen) {
        screens[name] = screen;
    }

    export function getScreen(name: string): Screen {
        return screens[name];
    }
}

export = ScreenManager;