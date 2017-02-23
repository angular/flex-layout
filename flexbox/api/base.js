import { applyCssPrefixes } from '../../utils/auto-prefixer';
import { ResponsiveActivation, KeyOptions } from '../responsive/responsive-activation';
/** Abstract base class for the Layout API styling directives. */
export var BaseFxDirective = (function () {
    /**
     *
     */
    function BaseFxDirective(_mediaMonitor, _elementRef, _renderer) {
        this._mediaMonitor = _mediaMonitor;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        /**
         *  Dictionary of input keys with associated values
         */
        this._inputMap = {};
        this._display = this._getDisplayStyle();
    }
    // *********************************************
    // Accessor Methods
    // *********************************************
    /**
     * Access the current value (if any) of the @Input property.
     */
    BaseFxDirective.prototype._queryInput = function (key) {
        return this._inputMap[key];
    };
    // *********************************************
    // Lifecycle Methods
    // *********************************************
    BaseFxDirective.prototype.ngOnDestroy = function () {
        if (this._mqActivation) {
            this._mqActivation.destroy();
        }
        this._mediaMonitor = null;
    };
    // *********************************************
    // Protected Methods
    // *********************************************
    /**
     * Was the directive's default selector used ?
     * If not, use the fallback value!
     */
    BaseFxDirective.prototype._getDefaultVal = function (key, fallbackVal) {
        var val = this._queryInput(key);
        var hasDefaultVal = (val !== undefined && val !== null);
        return (hasDefaultVal && val !== '') ? val : fallbackVal;
    };
    /**
     * Quick accessor to the current HTMLElement's `display` style
     * Note: this allows use to preserve the original style
     * and optional restore it when the mediaQueries deactivate
     */
    BaseFxDirective.prototype._getDisplayStyle = function (source) {
        var element = source || this._elementRef.nativeElement;
        var value = element.style['display'] || getComputedStyle(element)['display'];
        return value.trim();
    };
    /**
     * Applies styles given via string pair or object map to the directive element.
     */
    BaseFxDirective.prototype._applyStyleToElement = function (style, value, nativeElement) {
        var styles = {};
        var element = nativeElement || this._elementRef.nativeElement;
        if (typeof style === 'string') {
            styles[style] = value;
            style = styles;
        }
        styles = applyCssPrefixes(style);
        // Iterate all properties in hashMap and set styles
        for (var key in styles) {
            this._renderer.setElementStyle(element, key, styles[key]);
        }
    };
    /**
     * Applies styles given via string pair or object map to the directive element.
     */
    BaseFxDirective.prototype._applyStyleToElements = function (style, elements) {
        var _this = this;
        var styles = applyCssPrefixes(style);
        elements.forEach(function (el) {
            // Iterate all properties in hashMap and set styles
            for (var key in styles) {
                _this._renderer.setElementStyle(el, key, styles[key]);
            }
        });
    };
    /**
     *  Save the property value; which may be a complex object.
     *  Complex objects support property chains
     */
    BaseFxDirective.prototype._cacheInput = function (key, source) {
        if (typeof source === 'object') {
            for (var prop in source) {
                this._inputMap[prop] = source[prop];
            }
        }
        else {
            this._inputMap[key] = source;
        }
    };
    /**
     *  Build a ResponsiveActivation object used to manage subscriptions to mediaChange notifications
     *  and intelligent lookup of the directive's property value that corresponds to that mediaQuery
     *  (or closest match).
     */
    BaseFxDirective.prototype._listenForMediaQueryChanges = function (key, defaultValue, onMediaQueryChange) {
        var _this = this;
        var keyOptions = new KeyOptions(key, defaultValue, this._inputMap);
        return this._mqActivation = new ResponsiveActivation(keyOptions, this._mediaMonitor, function (change) { return onMediaQueryChange.call(_this, change); });
    };
    Object.defineProperty(BaseFxDirective.prototype, "childrenNodes", {
        /**
         * Special accessor to query for all child 'element' nodes regardless of type, class, etc.
         */
        get: function () {
            var obj = this._elementRef.nativeElement.childNodes;
            var buffer = [];
            // iterate backwards ensuring that length is an UInt32
            for (var i = obj.length; i--;) {
                buffer[i] = obj[i];
            }
            return buffer;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Fast validator for presence of attribute on the host element
     */
    BaseFxDirective.prototype.hasKeyValue = function (key) {
        return this._mqActivation.hasKeyValue(key);
    };
    return BaseFxDirective;
}());
//# sourceMappingURL=/usr/local/google/home/mmalerba/flex-layout/src/lib/flexbox/api/base.js.map