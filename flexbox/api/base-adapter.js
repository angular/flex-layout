var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { BaseFxDirective } from './base';
export var BaseFxDirectiveAdapter = (function (_super) {
    __extends(BaseFxDirectiveAdapter, _super);
    function BaseFxDirectiveAdapter() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(BaseFxDirectiveAdapter.prototype, "inputMap", {
        get: function () {
            return this._inputMap;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *  Save the property value.
     */
    BaseFxDirectiveAdapter.prototype.cacheInput = function (key, source) {
        if (Array.isArray(source)) {
            this._cacheInputArray(key, source);
        }
        else if (typeof source === 'object') {
            this._cacheInputObject(key, source);
        }
        else if (typeof source === 'string') {
            this._cacheInputString(key, source);
        }
        else {
            throw new Error('Invalid class value provided');
        }
    };
    BaseFxDirectiveAdapter.prototype._cacheInputRaw = function (key, source) {
        this._inputMap[key] = source;
    };
    /**
     *  Save the property value for Array values.
     */
    BaseFxDirectiveAdapter.prototype._cacheInputArray = function (key, source) {
        this._inputMap[key] = source.join(' ');
    };
    /**
     *  Save the property value for key/value pair values.
     */
    BaseFxDirectiveAdapter.prototype._cacheInputObject = function (key, source) {
        var classes = [];
        for (var prop in source) {
            if (!!source[prop]) {
                classes.push(prop);
            }
        }
        this._inputMap[key] = classes.join(' ');
    };
    /**
     *  Save the property value for string values.
     */
    BaseFxDirectiveAdapter.prototype._cacheInputString = function (key, source) {
        this._inputMap[key] = source;
    };
    /**
     * @see BaseFxDirective._listenForMediaQueryChanges
     */
    BaseFxDirectiveAdapter.prototype.listenForMediaQueryChanges = function (key, defaultValue, onMediaQueryChange) {
        return this._listenForMediaQueryChanges(key, defaultValue, onMediaQueryChange);
    };
    /**
     * @see BaseFxDirective._queryInput
     */
    BaseFxDirectiveAdapter.prototype.queryInput = function (key) {
        return this._queryInput(key);
    };
    Object.defineProperty(BaseFxDirectiveAdapter.prototype, "mqActivation", {
        /**
         * @see BaseFxDirective._mqActivation
         */
        get: function () {
            return this._mqActivation;
        },
        enumerable: true,
        configurable: true
    });
    return BaseFxDirectiveAdapter;
}(BaseFxDirective));
//# sourceMappingURL=/home/travis/build/angular/flex-layout/src/lib/flexbox/api/base-adapter.js.map