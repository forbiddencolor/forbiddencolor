"use strict";

import * as $ from "jquery";
import * as ScreenManager from "ScreenManager";

export class Screen {
    public Id: string;

    constructor(id:string) {
        this.Id = id;
        ScreenManager.addScreen(id, this);
    }

    public show(): void {
        $("#" + this.Id).show();
    }

    public hide(): void {
        $("#" + this.Id).hide();
    }
}