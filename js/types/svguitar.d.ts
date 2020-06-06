import { QuerySelector } from '@svgdotjs/svg.js';
export declare type SilentString = 'x';
export declare type OpenString = 0;
export declare type Finger = [number, number | OpenString | SilentString, string?];
export declare type Barre = {
    fromString: number;
    toString: number;
    fret: number;
    text?: string;
};
export declare type Chord = {
    fingers: Finger[];
    barres: Barre[];
};
/**
 * Value for an open string (O)
 */
export declare const OPEN: OpenString;
/**
 * Value for a silent string (X)
 */
export declare const SILENT: SilentString;
/**
 * Possible positions of the fret label (eg. "3fr").
 */
export declare enum FretLabelPosition {
    LEFT = "left",
    RIGHT = "right"
}
export declare enum ChordStyle {
    normal = "normal",
    handdrawn = "handdrawn"
}
export interface ChordSettings {
    /**
     * Style of the chord diagram. Currently you can chose between "normal" and "handdrawn".
     */
    style?: ChordStyle;
    /**
     * The number of strings
     */
    strings?: number;
    /**
     * The number of frets
     */
    frets?: number;
    /**
     * The starting fret (first fret is 1)
     */
    position?: number;
    /**
     * These are the labels under the strings. Can be any string.
     */
    tuning?: string[];
    /**
     * The position of the fret label (eg. "3fr")
     */
    fretLabelPosition?: FretLabelPosition;
    /**
     * The font size of the fret label
     */
    fretLabelFontSize?: number;
    /**
     * The font size of the string labels
     */
    tuningsFontSize?: number;
    /**
     * Size of a nut relative to the string spacing
     */
    nutSize?: number;
    /**
     * Color of a finger / nut
     */
    nutColor?: string;
    /**
     * The color of text inside nuts
     */
    nutTextColor?: string;
    /**
     * The size of text inside nuts
     */
    nutTextSize?: number;
    /**
     * Height of a fret, relative to the space between two strings
     */
    fretSize?: number;
    /**
     * The minimum side padding (from the guitar to the edge of the SVG) relative to the whole width.
     * This is only applied if it's larger than the letters inside of the padding (eg the starting fret)
     */
    sidePadding?: number;
    /**
     * The font family used for all letters and numbers. Please not that when using the 'handdrawn' chord diagram style setting the font family has no effect.
     */
    fontFamily?: string;
    /**
     * The title of the diagram
     */
    title?: string;
    /**
     * Font size of the title. This is only the initial font size. If the title doesn't fit, the title
     * is automatically scaled so that it fits.
     */
    titleFontSize?: number;
    /**
     * Space between the title and the chord diagram
     */
    titleBottomMargin?: number;
    /**
     * Global color of the whole diagram. Can be overridden with more specifig color settings such as
     * @link titleColor or @link stringColor etc.
     */
    color?: string;
    /**
     * The background color of the chord diagram. By default the background is transparent. To set the background to transparent either set this to 'none' or undefined
     */
    backgroundColor?: string;
    /**
     * The color of the title (overrides color)
     */
    titleColor?: string;
    /**
     * The color of the strings (overrides color)
     */
    stringColor?: string;
    /**
     * The color of the fret position (overrides color)
     */
    fretLabelColor?: string;
    /**
     * The color of the tunings (overrides color)
     */
    tuningsColor?: string;
    /**
     * The color of the frets (overrides color)
     */
    fretColor?: string;
    /**
     * Barre chord rectangle border radius relative to the nutSize (eg. 1 means completely round endges, 0 means not rounded at all)
     */
    barreChordRadius?: number;
    /**
     * Size of the Xs and Os above empty strings relative to the space between two strings
     */
    emptyStringIndicatorSize?: number;
    /**
     * Global stroke width
     */
    strokeWidth?: number;
    /**
     * The width of the top fret (only used if position is 1)
     */
    topFretWidth?: number;
    /**
     * When set to true the distance between the chord diagram and the top of the SVG stayes the same,
     * no matter if a title is defined or not.
     */
    fixedDiagramPosition?: boolean;
}
export declare class SVGuitarChord {
    private container;
    private _renderer?;
    private settings;
    private _chord;
    constructor(container: QuerySelector | HTMLElement);
    private get renderer();
    configure(settings: ChordSettings): this;
    chord(chord: Chord): SVGuitarChord;
    draw(): {
        width: number;
        height: number;
    };
    private sanityCheckSettings;
    private drawTunings;
    private drawPosition;
    /**
     * Hack to prevent the empty space of the svg from being cut off without having to define a
     * fixed width
     */
    private drawTopEdges;
    private drawBackground;
    private drawTopFret;
    private stringXPos;
    private stringSpacing;
    private fretSpacing;
    private fretLinesYPos;
    private toArrayIndex;
    private drawEmptyStringIndicators;
    private drawGrid;
    private drawTitle;
    clear(): void;
    /**
     * Completely remove the diagram from the DOM
     */
    remove(): void;
}
