"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SvgJsRenderer = void 0;
var renderer_1 = require("../renderer");
var svg_js_1 = require("@svgdotjs/svg.js");
var constants_1 = require("../../constants");
var utils_1 = require("../../utils");
var SvgJsRenderer = /** @class */ (function (_super) {
    __extends(SvgJsRenderer, _super);
    function SvgJsRenderer(container) {
        var _this = _super.call(this, container) || this;
        // initialize the SVG
        var width = constants_1.constants.width;
        var height = 0;
        /*
        For some reason the container needs to be initiated differently with svgdom (node) and
        and in the browser. Might be a bug in either svg.js or svgdom. But this workaround works fine
        so I'm not going to care for now.
         */
        /* istanbul ignore else */
        if (utils_1.isNode()) {
            // node (jest)
            _this.svg = svg_js_1.SVG(container);
        }
        else {
            // browser
            _this.svg = svg_js_1.SVG().addTo(container);
        }
        _this.svg.attr('preserveAspectRatio', 'xMidYMid meet').viewbox(0, 0, width, height);
        return _this;
    }
    SvgJsRenderer.prototype.line = function (fromX, fromY, toX, toY, strokeWidth, color) {
        this.svg.line(fromX, fromY, toX, toY).stroke({ color: color, width: strokeWidth });
    };
    SvgJsRenderer.prototype.size = function (width, height) {
        this.svg.viewbox(0, 0, width, height);
    };
    SvgJsRenderer.prototype.clear = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.svg.children()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                child.remove();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    SvgJsRenderer.prototype.remove = function () {
        this.svg.remove();
    };
    SvgJsRenderer.prototype.background = function (color) {
        this.svg.rect().size('100%', '100%').fill(color);
    };
    SvgJsRenderer.prototype.text = function (text, x, y, fontSize, color, fontFamily, alignment, plain) {
        var element;
        if (plain) {
            // create a text element centered at x,y. No SVG.js magic.
            element = this.svg
                .plain(text)
                .attr({
                x: x,
                y: y,
            })
                .font({
                family: fontFamily,
                size: fontSize,
                anchor: alignment,
                'dominant-baseline': 'central',
            })
                .fill(color);
        }
        else {
            element = this.svg
                .text(text)
                .move(x, y)
                .font({
                family: fontFamily,
                size: fontSize,
                anchor: alignment,
            })
                .fill(color);
        }
        return this.boxToElement(element.bbox(), element.remove.bind(element));
    };
    SvgJsRenderer.prototype.circle = function (x, y, diameter, strokeWidth, strokeColor, fill) {
        var element = this.svg
            .circle(diameter)
            .move(x, y)
            .fill(fill || 'none')
            .stroke({
            color: strokeColor,
            width: strokeWidth,
        });
        return this.boxToElement(element.bbox(), element.remove.bind(element));
    };
    SvgJsRenderer.prototype.rect = function (x, y, width, height, strokeWidth, strokeColor, fill, radius) {
        var element = this.svg
            .rect(width, height)
            .move(x, y)
            .fill(fill || 'none')
            .stroke({
            width: strokeWidth,
            color: strokeColor,
        })
            .radius(radius || 0);
        return this.boxToElement(element.bbox(), element.remove.bind(element));
    };
    SvgJsRenderer.prototype.boxToElement = function (box, remove) {
        return {
            width: box.width,
            height: box.height,
            x: box.x,
            y: box.y,
            remove: remove,
        };
    };
    return SvgJsRenderer;
}(renderer_1.Renderer));
exports.SvgJsRenderer = SvgJsRenderer;
//# sourceMappingURL=svg-js-renderer.js.map