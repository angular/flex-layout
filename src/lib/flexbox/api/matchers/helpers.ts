import {Type} from '@angular/core';
import {ComponentFixture, TestBed } from '@angular/core/testing';

export type ComponentClazzFn = () => Type<any>;

export function makeExpectTemplate(getClass:ComponentClazzFn){
  let createTestComponent;

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

export function makeCreateTestComponent(getClass:ComponentClazzFn) {
  let ComponentAny : Type<any>;

  return function createTestComponent(template: string): ComponentFixture<Type<any>> {
    if ( !ComponentAny ) {
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
