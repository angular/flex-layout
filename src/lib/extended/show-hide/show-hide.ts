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

export interface ShowHideParent {
  display: string;
}

@Injectable({providedIn: 'root'})
export class ShowHideStyleBuilder extends StyleBuilder {
  buildStyles(show: string, parent: ShowHideParent) {
    const shouldShow = show === 'true';
    return {'display': shouldShow ? parent.display || 'initial' : 'none'};
  }
}

@Directive()
export class ShowHideDirective extends BaseDirective2 implements AfterViewInit, OnChanges {
  protected DIRECTIVE_KEY = 'show-hide';

  /** Original dom Elements CSS display style */
  protected display: string = '';
  protected hasLayout = false;
  protected hasFlexChild = false;

  constructor(elementRef: ElementRef,
              styleBuilder: ShowHideStyleBuilder,
              styler: StyleUtils,
              marshal: MediaMarshaller,
              @Inject(LAYOUT_CONFIG) protected layoutConfig: LayoutConfigOptions,
              @Inject(PLATFORM_ID) protected platformId: Object,
              @Inject(SERVER_TOKEN) protected serverModuleLoaded: boolean) {
    super(elementRef, styleBuilder, styler, marshal);
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  ngAfterViewInit() {
    this.trackExtraTriggers();

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

    this.init();
    // set the default to show unless explicitly overridden
    const defaultValue = this.marshal.getValue(this.nativeElement, this.DIRECTIVE_KEY, '');
    if (defaultValue === undefined || defaultValue === '') {
      this.setValue(true, '');
    } else {
      this.triggerUpdate();
    }
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
        const bp = inputKey.slice(1).join('.');
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
   *  Watch for these extra triggers to update fxShow, fxHide stylings
   */
  protected trackExtraTriggers() {
    this.hasLayout = this.marshal.hasValue(this.nativeElement, 'layout');

    ['layout', 'layout-align'].forEach(key => {
      this.marshal
          .trackValue(this.nativeElement, key)
          .pipe(takeUntil(this.destroySubject))
          .subscribe(this.triggerUpdate.bind(this));
    });
  }

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
  protected updateWithValue(value: boolean | string = true) {
    if (value === '') {
      return;
    }
    this.addStyles(value ? 'true' : 'false', {display: this.display});
    if (isPlatformServer(this.platformId) && this.serverModuleLoaded) {
      this.nativeElement.style.setProperty('display', '');
    }
    this.marshal.triggerUpdate(this.parentElement!, 'layout-gap');
  }
}

const DISPLAY_MAP: WeakMap<HTMLElement, string> = new WeakMap();

const inputs = [
  'fxShow', 'fxShow.print',
  'fxShow.xs', 'fxShow.sm', 'fxShow.md', 'fxShow.lg', 'fxShow.xl',
  'fxShow.lt-sm', 'fxShow.lt-md', 'fxShow.lt-lg', 'fxShow.lt-xl',
  'fxShow.gt-xs', 'fxShow.gt-sm', 'fxShow.gt-md', 'fxShow.gt-lg',
  'fxHide', 'fxHide.print',
  'fxHide.xs', 'fxHide.sm', 'fxHide.md', 'fxHide.lg', 'fxHide.xl',
  'fxHide.lt-sm', 'fxHide.lt-md', 'fxHide.lt-lg', 'fxHide.lt-xl',
  'fxHide.gt-xs', 'fxHide.gt-sm', 'fxHide.gt-md', 'fxHide.gt-lg'
];

const selector = `
  [fxShow], [fxShow.print],
  [fxShow.xs], [fxShow.sm], [fxShow.md], [fxShow.lg], [fxShow.xl],
  [fxShow.lt-sm], [fxShow.lt-md], [fxShow.lt-lg], [fxShow.lt-xl],
  [fxShow.gt-xs], [fxShow.gt-sm], [fxShow.gt-md], [fxShow.gt-lg],
  [fxHide], [fxHide.print],
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
