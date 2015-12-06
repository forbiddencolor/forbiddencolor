module TimeStamp {

    "use strict";

    export const now: Function = window.performance && window.performance.now
        ? () => { return window.performance.now(); }
        : () => { return +new Date; };
}

export = TimeStamp;