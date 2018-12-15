/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Directive,
  DoCheck,
  ElementRef,
  Input,
  IterableDiffers,
  KeyValueDiffers,
  Optional,
  Renderer2,
  Self,
} from '@angular/core';
import {NgClass} from '@angular/common';
import {BaseDirective2, StyleUtils, MediaMarshaller} from '@angular/flex-layout/core';

export class ClassDirective extends BaseDirective2 implements DoCheck {

  protected DIRECTIVE_KEY = 'ngClass';

  /**
   * Capture class assignments so we cache the default classes
   * which are merged with activated styles and used as fallbacks.
   */
  @Input('class')
  set klass(val: string) {
    this.ngClassInstance.klass = val;
    this.setValue(val, '');
  }

  constructor(protected elementRef: ElementRef,
              protected styler: StyleUtils,
              protected marshal: MediaMarshaller,
              protected iterableDiffers: IterableDiffers,
              protected keyValueDiffers: KeyValueDiffers,
              protected renderer: Renderer2,
              @Optional() @Self() protected readonly ngClassInstance: NgClass) {
    super(elementRef, null!, styler, marshal);
    if (!this.ngClassInstance) {
      // Create an instance NgClass Directive instance only if `ngClass=""` has NOT been defined on
      // the same host element; since the responsive variations may be defined...
      this.ngClassInstance = new NgClass(
        this.iterableDiffers, this.keyValueDiffers, this.elementRef, this.renderer
      );
    }
    this.init();
  }

  protected updateWithValue(value: any) {
    this.ngClassInstance.ngClass = value;
    this.ngClassInstance.ngDoCheck();
  }

  // ******************************************************************
  // Lifecycle Hooks
  // ******************************************************************

  /**
   * For ChangeDetectionStrategy.onPush and ngOnChanges() updates
   */
  ngDoCheck() {
    this.ngClassInstance.ngDoCheck();
  }
}

const inputs = [
  'ngClass', 'ngClass.xs', 'ngClass.sm', 'ngClass.md', 'ngClass.lg', 'ngClass.xl',
  'ngClass.lt-sm', 'ngClass.lt-md', 'ngClass.lt-lg', 'ngClass.lt-xl',
  'ngClass.gt-xs', 'ngClass.gt-sm', 'ngClass.gt-md', 'ngClass.gt-lg'
];

const selector = `
  [ngClass], [ngClass.xs], [ngClass.sm], [ngClass.md], [ngClass.lg], [ngClass.xl],
  [ngClass.lt-sm], [ngClass.lt-md], [ngClass.lt-lg], [ngClass.lt-xl],
  [ngClass.gt-xs], [ngClass.gt-sm], [ngClass.gt-md], [ngClass.gt-lg]
`;

/**
 * Directive to add responsive support for ngClass.
 * This maintains the core functionality of 'ngClass' and adds responsive API
 * Note: this class is a no-op when rendered on the server
 */
@Directive({selector, inputs})
export class DefaultClassDirective extends ClassDirective {
  protected inputs = inputs;
}
