"use strict";
/* istanbul ignore file */
/*
Unfortunately this roughjs implementation can't be tested with jsdom at the moment. The problem is
that there is no SVG implementation for JSDOM. If that changes at some point this class can be
tested just like the svg.js implementation
 */
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoughJsRenderer = void 0;
var renderer_1 = require("../renderer");
var roughjs_1 = require("roughjs");
var defs_1 = require("./defs");
/**
 * Currently the font is hard-coded to 'Patrick Hand' when using the handdrawn chord diagram style.
 * The reason is that the font needs to be base64 encoded and embedded in the SVG. In theory a web-font
 * could be downloaded, base64 encoded and embedded in the SVG but that's too much of a hassle. But if the
 * need arises it should be possible.
 */
var FONT_FAMLILY = 'Patrick Hand';
var RoughJsRenderer = /** @class */ (function (_super) {
    __extends(RoughJsRenderer, _super);
    function RoughJsRenderer(container) {
        var _this = _super.call(this, container) || this;
        // initialize the container
        if (container instanceof HTMLElement) {
            _this.containerNode = container;
        }
        else {
            _this.containerNode = container;
            var node = document.querySelector(container);
            if (!node) {
                throw new Error("No element found with selector \"" + container + "\"");
            }
            _this.containerNode = node;
        }
        // create an empty SVG element
        _this.svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        _this.svgNode.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        _this.svgNode.setAttribute('version', '1.1');
        _this.svgNode.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        _this.svgNode.setAttribute('xmlns:svgjs', 'http://svgjs.com/svgjs');
        _this.svgNode.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        _this.svgNode.setAttribute('viewBox', '0 0 400 400');
        _this.embedDefs();
        _this.containerNode.appendChild(_this.svgNode);
        _this.rc = roughjs_1.default.svg(_this.svgNode);
        return _this;
    }
    /**
     * This will embed all defs defined in the defs.html file. Specifically this is used to embed the base64
     * encoded font into the SVG so that the font always looks correct.
     */
    RoughJsRenderer.prototype.embedDefs = function () {
        var _this = this;
        /*
        Embed the base64 encoded font. This is done in a timeout because roughjs also creates defs which will simply overwrite existing defs.
        By putting this in a timeout we make sure that the style tag is added after roughjs finished rendering.
        ATTENTION: This will only work as long as we're synchronously rendering the diagram! If we ever switch to asynchronous rendering a different
        solution must be found.
        */
        setTimeout(function () {
            var _a, _b, _c;
            // check if defs were already added
            if (_this.svgNode.querySelector('defs [data-svguitar-def]')) {
                return;
            }
            var currentDefs = _this.svgNode.querySelector('defs');
            if (!currentDefs) {
                currentDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                _this.svgNode.prepend(currentDefs);
            }
            // create dom nodes from HTML string
            var template = document.createElement('template');
            template.innerHTML = defs_1.default.trim();
            // typescript is complaining when I access content.firstChild.children, therefore this ugly workaround.
            var defsToAdd = (_c = (_b = (_a = template.content.firstChild) === null || _a === void 0 ? void 0 : _a.firstChild) === null || _b === void 0 ? void 0 : _b.parentElement) === null || _c === void 0 ? void 0 : _c.children;
            if (defsToAdd) {
                Array.from(defsToAdd).forEach(function (def) {
                    def.setAttribute('data-svguitar-def', 'true');
                    currentDefs === null || currentDefs === void 0 ? void 0 : currentDefs.appendChild(def);
                });
            }
        });
    };
    RoughJsRenderer.prototype.circle = function (x, y, diameter, strokeWidth, strokeColor, fill) {
        var options = {
            fill: fill || 'none',
            fillWeight: 2.5,
            stroke: strokeColor || fill || 'none',
            roughness: 1.5,
        };
        if (strokeWidth > 0) {
            options.strokeWidth = strokeWidth;
        }
        var circle = this.rc.circle(x + diameter / 2, y + diameter / 2, diameter, options);
        this.svgNode.appendChild(circle);
        return this.boxToElement(circle.getBBox(), function () { return (circle ? circle.remove() : void 0); });
    };
    RoughJsRenderer.prototype.clear = function () {
        while (this.svgNode.firstChild) {
            this.svgNode.removeChild(this.svgNode.firstChild);
        }
        this.rc = roughjs_1.default.svg(this.svgNode);
        this.embedDefs();
    };
    RoughJsRenderer.prototype.remove = function () {
        this.svgNode.remove();
    };
    RoughJsRenderer.prototype.line = function (x1, y1, x2, y2, strokeWidth, color) {
        if (strokeWidth > 5 && (x1 - x2 === 0 || y1 - y2 === 0)) {
            if (Math.abs(x1 - x2) > Math.abs(y1 - y2)) {
                this.rect(x1, y1, x2 - x1, strokeWidth, 0, color, color);
            }
            else {
                this.rect(x1 - strokeWidth / 2, y1, strokeWidth, y2 - y1, 0, color, color);
            }
        }
        else {
            var line = this.rc.line(x1, y1, x2, y2, {
                strokeWidth: strokeWidth,
                stroke: color,
            });
            this.svgNode.appendChild(line);
        }
    };
    RoughJsRenderer.prototype.rect = function (x, y, width, height, strokeWidth, strokeColor, fill, radius) {
        var rect2 = this.rc.rectangle(x, y, width, height, {
            // fill: fill || 'none',
            fill: 'none',
            fillWeight: 2,
            strokeWidth: strokeWidth,
            stroke: strokeColor,
            roughness: 2.8,
            fillStyle: 'cross-hatch',
            hachureAngle: 60,
            hachureGap: 4,
        });
        var rectRadius = radius || 0;
        var path = this.roundedRectData(width, height, rectRadius, rectRadius, rectRadius, rectRadius);
        var rect = this.rc.path(path, {
            fill: fill || 'none',
            fillWeight: 2.5,
            stroke: strokeColor || fill || 'none',
            roughness: 1.5,
        });
        rect.setAttribute('transform', "translate(" + x + ", " + y + ")");
        this.svgNode.appendChild(rect);
        this.svgNode.appendChild(rect2);
        return this.boxToElement(rect.getBBox(), function () { return rect.remove(); });
    };
    RoughJsRenderer.prototype.size = function (width, height) {
        this.svgNode.setAttribute('viewBox', "0 0 " + Math.ceil(width) + " " + Math.ceil(height));
    };
    RoughJsRenderer.prototype.background = function (color) {
        var bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bg.setAttributeNS(null, 'width', '100%');
        bg.setAttributeNS(null, 'height', '100%');
        bg.setAttributeNS(null, 'fill', color);
        this.svgNode.insertBefore(bg, this.svgNode.firstChild);
    };
    RoughJsRenderer.prototype.text = function (text, x, y, fontSize, color, fontFamily, alignment, plain) {
        // Place the SVG namespace in a variable to easily reference it.
        var txtElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        txtElem.setAttributeNS(null, 'x', String(x));
        txtElem.setAttributeNS(null, 'y', String(y));
        txtElem.setAttributeNS(null, 'font-size', String(fontSize));
        txtElem.setAttributeNS(null, 'font-family', FONT_FAMLILY);
        txtElem.setAttributeNS(null, 'align', alignment);
        txtElem.setAttributeNS(null, 'fill', color);
        if (plain) {
            txtElem.setAttributeNS(null, 'dominant-baseline', 'central');
        }
        txtElem.appendChild(document.createTextNode(text));
        this.svgNode.appendChild(txtElem);
        var bbox = txtElem.getBBox();
        var yOffset;
        switch (alignment) {
            case renderer_1.Alignment.MIDDLE:
                yOffset = -(bbox.width / 2);
                break;
            case renderer_1.Alignment.LEFT:
                yOffset = 0;
                break;
            case renderer_1.Alignment.RIGHT:
                yOffset = -bbox.width;
                break;
            default:
                throw new Error("Invalid alignment " + alignment);
        }
        txtElem.setAttributeNS(null, 'x', String(x + yOffset));
        txtElem.setAttributeNS(null, 'y', String(y + bbox.height / 2));
        return this.boxToElement(txtElem.getBBox(), txtElem.remove.bind(txtElem));
    };
    RoughJsRenderer.prototype.boxToElement = function (box, remove) {
        return {
            width: box.width,
            height: box.height,
            x: box.x,
            y: box.y,
            remove: remove,
        };
    };
    RoughJsRenderer.prototype.roundedRectData = function (w, h, tlr, trr, brr, blr) {
        return ('M 0 ' +
            tlr +
            ' A ' +
            tlr +
            ' ' +
            tlr +
            ' 0 0 1 ' +
            tlr +
            ' 0' +
            ' L ' +
            (w - trr) +
            ' 0' +
            ' A ' +
            trr +
            ' ' +
            trr +
            ' 0 0 1 ' +
            w +
            ' ' +
            trr +
            ' L ' +
            w +
            ' ' +
            (h - brr) +
            ' A ' +
            brr +
            ' ' +
            brr +
            ' 0 0 1 ' +
            (w - brr) +
            ' ' +
            h +
            ' L ' +
            blr +
            ' ' +
            h +
            ' A ' +
            blr +
            ' ' +
            blr +
            ' 0 0 1 0 ' +
            (h - blr) +
            ' Z');
    };
    return RoughJsRenderer;
}(renderer_1.Renderer));
exports.RoughJsRenderer = RoughJsRenderer;
//# sourceMappingURL=roughjs-renderer.js.map