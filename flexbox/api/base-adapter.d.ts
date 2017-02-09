/**
 * Adapted BaseFxDirective abtract class version so it can be used via composition.
 *
 * @see BaseFxDirective
 */
import { BaseFxDirective } from './base';
import { ResponsiveActivation } from './../responsive/responsive-activation';
import { MediaQuerySubscriber } from '../../media-query/media-change';
export declare class BaseFxDirectiveAdapter extends BaseFxDirective {
    readonly inputMap: {};
    /**
     *  Save the property value.
     */
    cacheInput(key?: string, source?: any): void;
    _cacheInputRaw(key?: string, source?: any): void;
    /**
     *  Save the property value for Array values.
     */
    _cacheInputArray(key?: string, source?: boolean[]): void;
    /**
     *  Save the property value for key/value pair values.
     */
    _cacheInputObject(key?: string, source?: {
        [key: string]: boolean;
    }): void;
    /**
     *  Save the property value for string values.
     */
    _cacheInputString(key?: string, source?: string): void;
    /**
     * @see BaseFxDirective._listenForMediaQueryChanges
     */
    listenForMediaQueryChanges(key: string, defaultValue: any, onMediaQueryChange: MediaQuerySubscriber): ResponsiveActivation;
    /**
     * @see BaseFxDirective._queryInput
     */
    queryInput(key: any): any;
    /**
     * @see BaseFxDirective._mqActivation
     */
    readonly mqActivation: ResponsiveActivation;
}
