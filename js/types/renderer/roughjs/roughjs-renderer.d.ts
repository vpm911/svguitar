import { Alignment, GraphcisElement, Renderer } from '../renderer';
import { QuerySelector } from '@svgdotjs/svg.js';
export declare class RoughJsRenderer extends Renderer {
    private rc;
    private containerNode;
    private svgNode;
    constructor(container: QuerySelector | HTMLElement);
    /**
     * This will embed all defs defined in the defs.html file. Specifically this is used to embed the base64
     * encoded font into the SVG so that the font always looks correct.
     */
    private embedDefs;
    circle(x: number, y: number, diameter: number, strokeWidth: number, strokeColor: string, fill?: string): GraphcisElement;
    clear(): void;
    remove(): void;
    line(x1: number, y1: number, x2: number, y2: number, strokeWidth: number, color: string): void;
    rect(x: number, y: number, width: number, height: number, strokeWidth: number, strokeColor: string, fill?: string, radius?: number): GraphcisElement;
    size(width: number, height: number): void;
    background(color: string): void;
    text(text: string, x: number, y: number, fontSize: number, color: string, fontFamily: string, alignment: Alignment, plain?: boolean): GraphcisElement;
    private boxToElement;
    private roundedRectData;
}
