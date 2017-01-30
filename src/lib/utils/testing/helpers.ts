/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Type, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {extendObject} from '../object-extend'; // tslint:disable-line:no-unused-variable

export type ComponentClazzFn = () => Type<any>;

/**
 *  Function generator that captures a Component Type accessor and enables
 *  `expectTemplate( )` to be reusable for *any* captured Component class.
 *
 *  NOTE: These Generators (aka Partial Functions) are used only in
 *        the Karma/Jasmine testing.
 */
export function makeExpectDOMFrom(getClass: ComponentClazzFn) {
  let createTestComponent;

  // Return actual `expectTemplate()` function
  return function expectTemplate(template: string, key?: string, value?: any): any {
    if (!createTestComponent) {
      createTestComponent = makeCreateTestComponent(getClass);
    }

    let fixture = createTestComponent(template);
    if (key) {
      let instance = fixture.componentInstance;
      instance[key] = value;
    }
    fixture.detectChanges();
    return expectNativeEl(fixture);
  };
}

/**
 * Function generator that captures a Component Type accessor and enables
 * `createTestComponent( )` to be reusable for *any* captured Component class.
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
 * With the specified Component Type and template,
 * create a component and perform a CSS query to find the nativeElement
 * associated with that query selector.
 */
export function makeExpectDOMForQuery(getClass: ComponentClazzFn) {
  let createTestComponent;

  // Return actual `expectTemplate()` function
  return function expectDomForQuery(template: string, selector: string, index = 0): any {
    if (!createTestComponent) {
      createTestComponent = makeCreateTestComponent(getClass);
    }

    let fixture = createTestComponent(template);
    fixture.detectChanges();

    let nodes = queryFor(fixture, selector);
    return nodes.length > index ? expect(nodes[index].nativeElement) : null;
  };
}


export function queryFor(fixture: ComponentFixture<any>, selector: string): DebugElement[] {
  return fixture.debugElement.queryAll(By.css(selector));
}


