/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Directive,
  ElementRef,
  OnChanges,
  SimpleChanges,
  Optional,
  Inject,
  PLATFORM_ID,
  Injectable,
  AfterViewInit,
} from '@angular/core';
import {isPlatformServer} from '@angular/common';
import {
  BaseDirective2,
  LAYOUT_CONFIG,
  LayoutConfigOptions,
  MediaMarshaller,
  SERVER_TOKEN,
  StyleUtils,
  StyleBuilder,
} from '@angular/flex-layout/core';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {takeUntil} from 'rxjs/operators';

/**
 * For fxHide selectors, we invert the 'value'
 * and assign to the equivalent fxShow selector cache
 *  - When 'hide' === '' === true, do NOT show the element
 *  - When 'hide' === false or 0... we WILL show the element
 * @deprecated
 * @deletion-target v7.0.0-beta.21
 */
export function negativeOf(hide: any) {
  return (hide === '') ? false :
         ((hide === 'false') || (hide === 0)) ? true : !hide;
}

export interface ShowHideParent {
  display: string;
}

@Injectable({providedIn: 'root'})
export class ShowHideStyleBuilder extends StyleBuilder {
  buildStyles(show: string, parent: ShowHideParent) {
    const shouldShow = show === 'true';
    return {'display': shouldShow ? parent.display : 'none'};
  }
}

export class ShowHideDirective extends BaseDirective2 implements AfterViewInit, OnChanges {
  protected DIRECTIVE_KEY = 'show-hide';

  /** Original dom Elements CSS display style */
  protected display: string = '';
  protected hasLayout = false;
  protected hasFlexChild = false;

  constructor(protected elementRef: ElementRef,
              protected styleBuilder: ShowHideStyleBuilder,
              protected styler: StyleUtils,
              protected marshal: MediaMarshaller,
              @Inject(LAYOUT_CONFIG) protected layoutConfig: LayoutConfigOptions,
              @Inject(PLATFORM_ID) protected platformId: Object,
              @Optional() @Inject(SERVER_TOKEN) protected serverModuleLoaded: boolean) {
    super(elementRef, styleBuilder, styler, marshal);
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  ngAfterViewInit() {
    this.hasLayout = this.marshal.hasValue(this.nativeElement, 'layout');
    this.marshal.trackValue(this.nativeElement, 'layout')
      .pipe(takeUntil(this.destroySubject))
      .subscribe(this.updateWithValue.bind(this));

    const children = Array.from(this.nativeElement.children);
    for (let i = 0; i < children.length; i++) {
      if (this.marshal.hasValue(children[i] as HTMLElement, 'flex')) {
        this.hasFlexChild = true;
        break;
      }
    }

    if (DISPLAY_MAP.has(this.nativeElement)) {
      this.display = DISPLAY_MAP.get(this.nativeElement)!;
    } else {
      this.display = this.getDisplayStyle();
      DISPLAY_MAP.set(this.nativeElement, this.display);
    }

    this.marshal.init(this.elementRef.nativeElement, this.DIRECTIVE_KEY,
      this.updateWithValue.bind(this));
    // set the default to show unless explicitly overridden
    const defaultValue = this.marshal.getValue(this.nativeElement, this.DIRECTIVE_KEY, '');
    if (defaultValue === undefined || defaultValue === '') {
      this.setValue(true, '');
    }
    this.updateWithValue(this.marshal.getValue(this.nativeElement, this.DIRECTIVE_KEY));
  }

  /**
   * On changes to any @Input properties...
   * Default to use the non-responsive Input value ('fxShow')
   * Then conditionally override with the mq-activated Input's current value
   */
  ngOnChanges(changes: SimpleChanges) {
    Object.keys(changes).forEach(key => {
      if (this.inputs.indexOf(key) !== -1) {
        const inputKey = key.split('.');
        const bp = inputKey[1] || '';
        const inputValue = changes[key].currentValue;
        let shouldShow = inputValue !== '' ?
          inputValue !== 0 ? coerceBooleanProperty(inputValue) : false
          : true;
        if (inputKey[0] === 'fxHide') {
          shouldShow = !shouldShow;
        }
        this.setValue(shouldShow, bp);
      }
    });
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /**
   * Override accessor to the current HTMLElement's `display` style
   * Note: Show/Hide will not change the display to 'flex' but will set it to 'block'
   * unless it was already explicitly specified inline or in a CSS stylesheet.
   */
  protected getDisplayStyle(): string {
    return (this.hasLayout || (this.hasFlexChild && this.layoutConfig.addFlexToParent)) ?
      'flex' : this.styler.lookupStyle(this.nativeElement, 'display', true);
  }

  /** Validate the visibility value and then update the host's inline display style */
  protected updateWithValue(value: boolean|string = true) {
    if (value === '') {
      return;
    }
    this.addStyles(value ? 'true' : 'false', {display: this.display});
    if (isPlatformServer(this.platformId) && this.serverModuleLoaded) {
      this.nativeElement.style.setProperty('display', '');
    }
  }
}

const DISPLAY_MAP: WeakMap<HTMLElement, string> = new WeakMap();

const inputs = [
  'fxShow',
  'fxShow.xs', 'fxShow.sm', 'fxShow.md', 'fxShow.lg', 'fxShow.xl',
  'fxShow.lt-sm', 'fxShow.lt-md', 'fxShow.lt-lg', 'fxShow.lt-xl',
  'fxShow.gt-xs', 'fxShow.gt-sm', 'fxShow.gt-md', 'fxShow.gt-lg',
  'fxHide',
  'fxHide.xs', 'fxHide.sm', 'fxHide.md', 'fxHide.lg', 'fxHide.xl',
  'fxHide.lt-sm', 'fxHide.lt-md', 'fxHide.lt-lg', 'fxHide.lt-xl',
  'fxHide.gt-xs', 'fxHide.gt-sm', 'fxHide.gt-md', 'fxHide.gt-lg'
];

const selector = `
  [fxShow],
  [fxShow.xs], [fxShow.sm], [fxShow.md], [fxShow.lg], [fxShow.xl],
  [fxShow.lt-sm], [fxShow.lt-md], [fxShow.lt-lg], [fxShow.lt-xl],
  [fxShow.gt-xs], [fxShow.gt-sm], [fxShow.gt-md], [fxShow.gt-lg],
  [fxHide],
  [fxHide.xs], [fxHide.sm], [fxHide.md], [fxHide.lg], [fxHide.xl],
  [fxHide.lt-sm], [fxHide.lt-md], [fxHide.lt-lg], [fxHide.lt-xl],
  [fxHide.gt-xs], [fxHide.gt-sm], [fxHide.gt-md], [fxHide.gt-lg]
`;

/**
 * 'show' Layout API directive
 */
@Directive({selector, inputs})
export class DefaultShowHideDirective extends ShowHideDirective {
  protected inputs = inputs;
}
