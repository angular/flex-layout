import {Type} from '@angular/core';
import {ComponentFixture, TestBed } from '@angular/core/testing';

export type ComponentClazzFn = () => Type<any>;

/**
 *  Function generator that captures a Component Type accessor and enables
 *  `expectTemplate( )` to be reusable for *any* captured Component class.
 *
 *  NOTE: These Generators (aka Partial Functions) are used only in
 *        the Karma/Jasmine testing.
 */
export function makeExpectDOMFrom(getClass:ComponentClazzFn){
  let createTestComponent;

  // Return actual `expectTemplate()` function
  return function expectTemplate(template: string, key?: string, value?: any): any {
    if ( !createTestComponent ) {
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
export function makeCreateTestComponent(getClass:ComponentClazzFn) {
  let ComponentAny : Type<any>;

  // Return actual `createTestComponent()` function
  return function createTestComponent(template: string): ComponentFixture<Type<any>> {
    if ( !ComponentAny ) {
      // Defer access to Component class to enable metadata to be configured properly...
      ComponentAny = getClass();
    }
    return TestBed
        .overrideComponent(ComponentAny, {set: {template: template}})
        .createComponent(ComponentAny);
  };
}

export function expectNativeEl(fixture: ComponentFixture<any>): any {
  return expect(fixture.debugElement.children[0].nativeElement);
}
