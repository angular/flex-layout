/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Renderer2, RendererStyleFlags2} from '@angular/core';

/**
 * Adapts the 'deprecated' Angular Renderer v1 API to use the new Renderer2 instance
 * This is required for older versions of NgStyle and NgClass that require
 * the v1 API (but should use the v2 instances)
 */
export class RendererAdapter {
  constructor(private _renderer: Renderer2) { }

  setElementClass(el: any, className: string, isAdd: boolean): void {
    if (isAdd) {
      this._renderer.addClass(el, className);
    } else {
      this._renderer.removeClass(el, className);
    }
  }

  setElementStyle(el: any, styleName: string, styleValue: string): void {
    if (styleValue) {
      this._renderer.setStyle(el, styleName, styleValue);
    } else {
      this._renderer.removeStyle(el, styleName);
    }
  }

  // new API is forwarded
  addClass(el: any, name: string): void {
    this._renderer.addClass(el, name);
  }

  removeClass(el: any, name: string): void {
    this._renderer.removeClass(el, name);
  }

  setStyle(el: any, style: string, value: any, flags?: RendererStyleFlags2): void {
    this._renderer.setStyle(el, style, value, flags);
  }

  removeStyle(el: any, style: string, flags?: RendererStyleFlags2): void {
    this._renderer.removeStyle(el, style, flags);
  }

  // ******************************************************************
  // !! Renderer is an abstract class with abstract methods
  //
  // These are implementation of those methods... and do NOTHING since
  // we only use setElementStyle() and setElementClass()
  // ******************************************************************

  /* tslint:disable */
  animate()             : any  { throw _notImplemented('animate'); }
  attachViewAfter()     : void { throw _notImplemented('attachViewAfter'); }
  detachView()          : void { throw _notImplemented('detachView'); }
  destroyView()         : void { throw _notImplemented('destroyView'); }
  createElement()       : any  { throw _notImplemented('createElement'); }
  createViewRoot()      : any  { throw _notImplemented('createViewRoot'); }
  createTemplateAnchor(): any  { throw _notImplemented('createTemplateAnchor'); }
  createText()          : any  { throw _notImplemented('createText'); }
  invokeElementMethod() : void { throw _notImplemented('invokeElementMethod'); }
  projectNodes()        : void { throw _notImplemented('projectNodes'); }
  selectRootElement()   : any  { throw _notImplemented('selectRootElement'); }
  setBindingDebugInfo() : void { throw _notImplemented('setBindingDebugInfo'); }
  setElementProperty()  : void { throw _notImplemented('setElementProperty'); }
  setElementAttribute() : void { throw _notImplemented('setElementAttribute'); }
  setText()             : void { throw _notImplemented('setText'); }
  listen()              : Function { throw _notImplemented('listen');  }
  listenGlobal()        : Function { throw _notImplemented('listenGlobal');  }
  /* tslint:enable */
}

function _notImplemented(methodName: string) {
  return new Error(`The method RendererAdapter::${methodName}() has not been implemented`);
}
