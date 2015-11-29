/// <reference path="../jquery/jquery.d.ts" />
// Type definitions for jquery ripples

interface JQuery {
    ripples(method: string, x:number, y:number, radius: number, strength: number): JQuery;
    ripples(method: string, ...args: any[]): JQuery;
    ripples(options: any): JQuery;
}

interface JQueryStatic {
    ripples(method: string, x: number, y: number, radius: number, strength: number): JQuery;
    ripples(method: string, ...args: any[]): JQuery;
    ripples(options: any): JQuery;
}

declare var ripples: JQueryStatic;
