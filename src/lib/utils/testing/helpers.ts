/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Type, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {extendObject} from '../object-extend';

export type ComponentClazzFn = () => Type<any>;

/**
 * Function generator that captures a Component Type accessor and enables
 * `createTestComponent()` to be reusable for *any* captured Component class.
 */
export function makeCreateTestComponent(getClass: ComponentClazzFn) {
  let componentAny: Type<any>;

  // Return actual `createTestComponent()` function
  return function createTestComponent(template: string, styles?: any): ComponentFixture<Type<any>> {
    if (!componentAny) {
      // Defer access to Component class to enable metadata to be configured properly...
      componentAny = getClass();
    }
    return TestBed
        .overrideComponent(componentAny, {
          set: {
            template: template,
            styles: styles || [],
          }
        })
        .createComponent(componentAny);
  };
}

/**
 *
 */
export function expectNativeEl(fixture: ComponentFixture<any>, instanceOptions ?: any): any {
  extendObject(fixture.componentInstance, instanceOptions || {});
  fixture.detectChanges();
  return expect(fixture.debugElement.children[0].nativeElement);
}

/**
 *
 */
export function expectEl(debugEl: DebugElement): any {
  return expect(debugEl.nativeElement);
}


export function queryFor(fixture: ComponentFixture<any>, selector: string): DebugElement[] {
  return fixture.debugElement.queryAll(By.css(selector));
}


