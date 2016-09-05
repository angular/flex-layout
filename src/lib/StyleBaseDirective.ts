import {Renderer, ElementRef} from "@angular/core";

export type StyleUpdateFn = (key:string, value:string) => void;

export class StyleBaseDirective {
  // Initialize to no-op
  public updateStyle : StyleUpdateFn = (key:string, value:string) => { };

  constructor(elRef: ElementRef, renderer: Renderer) {
    // prepare style updater specific to this renderer/domEl pair
    this.updateStyle = this._buildUpdater(elRef, renderer);
  }

  private _buildUpdater(elRef: ElementRef, renderer: Renderer):StyleUpdateFn {
    let domEl = elRef.nativeElement;

    return function(key:string, value:any){
      renderer.setElementStyle(domEl, key, value);
    };
  }

}
