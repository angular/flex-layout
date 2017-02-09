import { BaseFxDirective } from './base';
import { ResponsiveActivation } from './../responsive/responsive-activation';
import { MediaQuerySubscriber } from '../../media-query/media-change';
/**
 * Adapter to the BaseFxDirective abstract class so it can be used via composition.
 * @see BaseFxDirective
 */
export declare class BaseFxDirectiveAdapter extends BaseFxDirective {
    readonly inputMap: {};
    /**
     * @see BaseFxDirective._mqActivation
     */
    readonly mqActivation: ResponsiveActivation;
    /**
     * @see BaseFxDirective._queryInput
     */
    queryInput(key: any): any;
    /**
     *  Save the property value.
     */
    cacheInput(key?: string, source?: any, cacheRaw?: boolean): void;
    /**
     * @see BaseFxDirective._listenForMediaQueryChanges
     */
    listenForMediaQueryChanges(key: string, defaultValue: any, onMediaQueryChange: MediaQuerySubscriber): ResponsiveActivation;
    /**
     * No implicit transforms of the source.
     * Required when caching values expected later for KeyValueDiffers
     */
    protected _cacheInputRaw(key?: string, source?: any): void;
    /**
     *  Save the property value for Array values.
     */
    protected _cacheInputArray(key?: string, source?: boolean[]): void;
    /**
     *  Save the property value for key/value pair values.
     */
    protected _cacheInputObject(key?: string, source?: {
        [key: string]: boolean;
    }): void;
    /**
     *  Save the property value for string values.
     */
    protected _cacheInputString(key?: string, source?: string): void;
}
