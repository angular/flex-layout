import {Type, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed } from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import any = jasmine.any;

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

/**
 *
 */
export function expectNativeEl(fixture: ComponentFixture<any>): any {
  return expect(fixture.debugElement.children[0].nativeElement);
}

/**
 * With the specified Component Type and template,
 * create a component and perform a CSS query to find the nativeElement
 * associated with that query selector.
 */
export function makeExpectDOMForQuery(getClass:ComponentClazzFn){
  let createTestComponent;

  // Return actual `expectTemplate()` function
  return function expectDomForQuery(template:string, selector:string) : any {
    if ( !createTestComponent ) {
      createTestComponent = makeCreateTestComponent(getClass);
    }

    let fixture = createTestComponent(template);
        fixture.detectChanges();

    return expect( queryFor(fixture,selector).nativeElement );
  };
}


export function  queryFor(fixture:ComponentFixture<any>, selector:string):any {
  return fixture.debugElement.query(By.css(selector))
}


