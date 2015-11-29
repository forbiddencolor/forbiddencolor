/// <reference path="../jquery/jquery.d.ts" />
// Type definitions for legitRipple

interface JQuery {    
    ripple(options?: any): JQuery;
}

interface JQueryStatic {
    ripple: RippleStatic;
}

interface RippleStatic {
    destroy();
}

declare var ripple: JQueryStatic;
