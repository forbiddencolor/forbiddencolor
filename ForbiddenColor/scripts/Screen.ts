"use strict";

import * as $ from "jquery";

export class Screen {
    public Id: string;

    constructor(id:string) {
        this.Id = id;
    }

    public show(): void {
        $("#" + this.Id).show();
    }

    public hide(): void {
        $("#" + this.Id).hide();
    }
}