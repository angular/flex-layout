import {ElementRef, Renderer} from '@angular/core';
import {applyCssPrefixes} from '../../utils/auto-prefixer';
import {MediaMonitor} from '../../media-query/media-monitor';

/**
 * Definition of a css style. Either a property name (e.g. "flex-basis") or an object
 * map of property name and value (e.g. {display: 'none', flex-order: 5}).
 */
export type StyleDefinition = string|{[property: string]: string|number};

/** Abstract base class for the Layout API styling directives. */
export abstract class BaseFxDirective {
  constructor(private _mediaMonitor : MediaMonitor, private _elementRef: ElementRef, private _renderer: Renderer) {}

  /**
   * Accessor used by the ResponsiveActivation to subscribe to mediaQuery change notifications
   */
  get mediaMonitor() : MediaMonitor {
    return this._mediaMonitor;
  }
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
