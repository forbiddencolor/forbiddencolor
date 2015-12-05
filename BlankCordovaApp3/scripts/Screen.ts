"use strict";

import * as $ from "jquery";

export class Screen {
    public Id: string;

    constructor(id:string) {
        this.Id = id;
    }

    public show() {
        $("#" + this.Id).show();
    }

    public hide() {
        $("#" + this.Id).hide();
    }
}