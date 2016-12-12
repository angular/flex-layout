import {ElementRef, Renderer, OnDestroy} from '@angular/core';
import {applyCssPrefixes} from '../../utils/auto-prefixer';

import {ResponsiveActivation, KeyOptions} from '../responsive/responsive-activation';
import {MediaMonitor} from '../../media-query/media-monitor';
import {MediaQuerySubscriber} from '../../media-query/media-change';

/**
 * Definition of a css style. Either a property name (e.g. "flex-basis") or an object
 * map of property name and value (e.g. {display: 'none', flex-order: 5}).
 */
export type StyleDefinition = string|{[property: string]: string|number};

/** Abstract base class for the Layout API styling directives. */
export abstract class BaseFxDirective implements OnDestroy {
  /**
   * MediaQuery Activation Tracker
   */
  protected _mqActivation: ResponsiveActivation;

  /**
   *  Dictionary of input keys with associated values
   */
  protected _inputMap = { };

  /**
   *
   */
  constructor(private _mediaMonitor: MediaMonitor, private _elementRef: ElementRef, private _renderer: Renderer) { }

  // *********************************************
  // Accessor Methods
  // *********************************************

  /**
   * Accessor used by the ResponsiveActivation to subscribe to mediaQuery change notifications
   */
  get mediaMonitor(): MediaMonitor {
    return this._mediaMonitor;
  }

  /**
   * Access the current value (if any) of the @Input property.
   */
  protected _queryInput(key) {
    return this._inputMap[key];
  }


  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   *
   */
  ngOnDestroy() {
    this._mqActivation.destroy();
    this._mediaMonitor = null;
  }

  // *********************************************
  // Protected Methods
  // *********************************************

  /**
   * Applies styles given via string pair or object map to the directive element.
   */
  protected _applyStyleToElement(style: StyleDefinition, value?: string|number) {
    let styles = {};
    let element = this._elementRef.nativeElement;

    if (typeof style === 'string') {
      styles[style] = value;
      style = styles;
    }

    styles = applyCssPrefixes(style);

    // Iterate all properties in hashMap and set styles
    for (let key in styles) {
      this._renderer.setElementStyle(element, key, styles[key]);
    }
  }

  /**
   *  Save the property value; which may be a complex object.
   *  Complex objects support property chains
   */
  protected _cacheInput(key?:string, source?:any) {
    if (typeof source === 'object') {
      for (let prop in source) {
        this._inputMap[prop] = source[prop];
      }
    } else {
      this._inputMap[key] = source;
    }
  }

  /**
   *  Build a ResponsiveActivation object used to manage subscriptions to mediaChange notifications
   *  and intelligent lookup of the directive's property value that corresponds to that mediaQuery
   *  (or closest match).
   */
  protected _listenForMediaQueryChanges(key: string, defaultValue: any,
                                        onMediaQueryChange: MediaQuerySubscriber): ResponsiveActivation {
    //this._inputMap[key] = defaultValue;

    let keyOptions = new KeyOptions(key, defaultValue, this._inputMap);
    return this._mqActivation = new ResponsiveActivation(this, keyOptions, onMediaQueryChange);
  }
}
