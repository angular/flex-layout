import {ElementRef, Renderer} from '@angular/core';
import {applyCssPrefixes} from '../../utils/auto-prefixer';


/**
 * Definition of a css style. Either a property name (e.g. "flex-basis") or an object
 * map of property name and value (e.g. {display: 'none', flex-order: 5}).
 */
export type StyleDefinition = string|{[property: string]: string|number};

/** Abstract base class for the Layout API styling directives. */
export abstract class BaseFlexLayoutDirective {
  constructor(private _elementRef: ElementRef, private _renderer: Renderer) {}

  /** Applies styles given via string pair or object map to the directive element. */
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
}
