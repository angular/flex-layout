import {Renderer, ElementRef} from "@angular/core";
import { applyCssPrefixes } from '../../utils/auto-prefixer';

/**
 * Abstract base class for the Layout API styling directives
 */
export abstract class BaseStyleDirective {

  constructor(private _elRef: ElementRef, private _renderer: Renderer) {  }

  // *********************************************
  // Protected methods
  // *********************************************

  /**
   * Inject inline the flexbox styles specific to this renderer/domEl pair
   */
  protected _updateStyle(source:string|Object, value?:any) {
    let  styles = { }, domEl = this._elRef.nativeElement;
    if (typeof source === 'string') {
        styles[source] = value;
        source = styles;
    }

    styles = applyCssPrefixes(source);

    // Iterate all properties in hashMap and set styles
    for (let key in styles) {
      this._renderer.setElementStyle(domEl, key, styles[key]);
    }
  }

}
