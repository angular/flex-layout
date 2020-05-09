/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Component, PLATFORM_ID} from '@angular/core';
import {CommonModule, isPlatformServer} from '@angular/common';
import {ComponentFixture, TestBed, fakeAsync, flush, inject} from '@angular/core/testing';
import {MatButtonModule} from '@angular/material/button';
import {
  ɵMatchMedia as MatchMedia,
  CoreModule,
  ɵMockMatchMedia as MockMatchMedia,
  ɵMockMatchMediaProvider as MockMatchMediaProvider,
} from '@angular/flex-layout/core';

import {customMatchers, expect} from '../../utils/testing/custom-matchers';
import {makeCreateTestComponent, expectNativeEl, queryFor} from '../../utils/testing/helpers';
import {DefaultClassDirective} from './class';


describe('class directive', () => {
  let fixture: ComponentFixture<any>;
  let mediaController: MockMatchMedia;
  let platformId: Object;
  let createTestComponent = (template: string) => {
    fixture = makeCreateTestComponent(() => TestClassComponent)(template);

    inject([MatchMedia, PLATFORM_ID], (_matchMedia: MockMatchMedia, _platformId: Object) => {
      mediaController = _matchMedia;
      platformId = _platformId;
    })();
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        CommonModule,
        CoreModule
      ],
      declarations: [TestClassComponent, DefaultClassDirective],
      providers: [MockMatchMediaProvider]
    });
  });

  ['xs', 'sm', 'md', 'lg'].forEach(mq => {
    const selector = `ngClass-${mq}`;

    it(`should apply '${selector}' with '${mq}' media query`, () => {
      createTestComponent(`<div ngClass.${mq}="${selector}"></div>`);
      mediaController.activate(mq);
      expectNativeEl(fixture).toHaveCssClass(selector);
    });
  });

  it('should merge `ngClass` values with any `class` values', () => {
    createTestComponent(`<div class="class0" ngClass="class1 class2"></div>`);

    expectNativeEl(fixture).toHaveCssClass('class0');
    expectNativeEl(fixture).toHaveCssClass('class1');
    expectNativeEl(fixture).toHaveCssClass('class2');
  });

  it('should override base `class` values with responsive ngClass string', () => {
      createTestComponent(`<div class="class0" ngClass.xs="what class2"></div>`);

      expectNativeEl(fixture).toHaveCssClass('class0');
      expectNativeEl(fixture).not.toHaveCssClass('what');
      expectNativeEl(fixture).not.toHaveCssClass('class2');

      // the CSS classes listed in the string (space delimited) are added,
      // See https://angular.io/api/common/NgClass
      mediaController.activate('xs');
      expectNativeEl(fixture).toHaveCssClass('class0');
      expectNativeEl(fixture).toHaveCssClass('what');
      expectNativeEl(fixture).toHaveCssClass('class2');

      mediaController.activate('lg');
      expectNativeEl(fixture).toHaveCssClass('class0');
      expectNativeEl(fixture).not.toHaveCssClass('what');
      expectNativeEl(fixture).not.toHaveCssClass('class2');
    });

  it('should use responsive ngClass string and remove without fallback', () => {
    createTestComponent(`<div [ngClass.xs]="'what class2'"></div>`);

    expectNativeEl(fixture).not.toHaveCssClass('what');
    expectNativeEl(fixture).not.toHaveCssClass('class2');

    // the CSS classes listed in the string (space delimited) are added,
    // See https://angular.io/api/common/NgClass
    mediaController.activate('xs');
    expectNativeEl(fixture).toHaveCssClass('what');
    expectNativeEl(fixture).toHaveCssClass('class2');

    mediaController.activate('lg');
    expectNativeEl(fixture).not.toHaveCssClass('what');
    expectNativeEl(fixture).not.toHaveCssClass('class2');
  });

  it('should override base `class` values with responsive ngClass map', () => {
      createTestComponent(`
        <div class="class0" [ngClass.xs]="{'what':true, 'class2':true, 'class0':false}"></div>
      `);

      expectNativeEl(fixture).toHaveCssClass('class0');
      expectNativeEl(fixture).not.toHaveCssClass('what');
      expectNativeEl(fixture).not.toHaveCssClass('class2');

      // Object keys are CSS classes that get added when the expression given in
      // the value evaluates to a truthy value, otherwise they are removed.
      mediaController.activate('xs');
      expectNativeEl(fixture).not.toHaveCssClass('class0');
      expectNativeEl(fixture).toHaveCssClass('what');
      expectNativeEl(fixture).toHaveCssClass('class2');

      mediaController.activate('lg');
      expectNativeEl(fixture).toHaveCssClass('class0');
      expectNativeEl(fixture).not.toHaveCssClass('what');
      expectNativeEl(fixture).not.toHaveCssClass('class2');
    });

  it('should keep the raw existing `class` with responsive updates', () => {
    createTestComponent(`
        <div class="existing-class" ngClass="class1" ngClass.xs="xs-class">
        </div>
    `);

    expectNativeEl(fixture).toHaveCssClass('existing-class');
    expectNativeEl(fixture).toHaveCssClass('class1');

    mediaController.activate('xs');
    expectNativeEl(fixture).toHaveCssClass('xs-class');
    expectNativeEl(fixture).toHaveCssClass('existing-class');
    expectNativeEl(fixture).not.toHaveCssClass('class1');

    mediaController.activate('lg');
    expectNativeEl(fixture).not.toHaveCssClass('xs-class');
    expectNativeEl(fixture).toHaveCssClass('existing-class');
    expectNativeEl(fixture).toHaveCssClass('class1');
  });


  it('should keep allow removal of class selector', () => {
    createTestComponent(`
      <div
          class="existing-class"
          [ngClass.xs]="{'xs-class':true, 'existing-class':false}">
      </div>
    `);

    expectNativeEl(fixture).toHaveCssClass('existing-class');
    mediaController.activate('xs');
    expectNativeEl(fixture).not.toHaveCssClass('existing-class');
    expectNativeEl(fixture).toHaveCssClass('xs-class');

    mediaController.activate('lg');
    expectNativeEl(fixture).not.toHaveCssClass('xs-class');
    expectNativeEl(fixture).toHaveCssClass('existing-class');
  });

  it('should keep existing ngClass selector', () => {
    // @see documentation for @angular/core ngClass =http://bit.ly/2mz0LAa
    createTestComponent(`
        <div class="always"
             ngClass="existing-class"
             ngClass.xs="existing-class xs-class">
        </div>
      `);

    expectNativeEl(fixture).toHaveCssClass('always');
    expectNativeEl(fixture).toHaveCssClass('existing-class');

    mediaController.activate('xs');
    expectNativeEl(fixture).toHaveCssClass('always');
    expectNativeEl(fixture).toHaveCssClass('existing-class');
    expectNativeEl(fixture).toHaveCssClass('xs-class');

    mediaController.activate('lg');
    expectNativeEl(fixture).toHaveCssClass('always');
    expectNativeEl(fixture).toHaveCssClass('existing-class');
    expectNativeEl(fixture).not.toHaveCssClass('xs-class');
  });

  it('should support more than one responsive breakpoint on one element', () => {
    createTestComponent(`<div ngClass.xs="xs-class" ngClass.md="mat-class"></div>`);
    mediaController.activate('xs');
    expectNativeEl(fixture).toHaveCssClass('xs-class');
    expectNativeEl(fixture).not.toHaveCssClass('mat-class');
    mediaController.activate('md');
    expectNativeEl(fixture).not.toHaveCssClass('xs-class');
    expectNativeEl(fixture).toHaveCssClass('mat-class');
  });

  it('should support more than one responsive breakpoint on one element with undefined', () => {
    createTestComponent(`<div ngClass.lt-lg="mat-class" [ngClass.md]="undefined"></div>`);
    mediaController.activate('md', true);
    expectNativeEl(fixture).toHaveCssClass('mat-class');
  });

  it('should work with ngClass object notation', () => {
    createTestComponent(`
      <div [ngClass]="{'x1': hasX1, 'x3': hasX3}"
           [ngClass.xs]="{'x1': hasX1, 'x2': hasX2}">
      </div>
    `);
    expectNativeEl(fixture, {hasX1: true, hasX2: true, hasX3: true}).toHaveCssClass('x1');
    expectNativeEl(fixture, {hasX1: true, hasX2: true, hasX3: true}).not.toHaveCssClass('x2');
    expectNativeEl(fixture, {hasX1: true, hasX2: true, hasX3: true}).toHaveCssClass('x3');

    mediaController.activate('X');
    expectNativeEl(fixture, {hasX1: true, hasX2: false, hasX3: false}).toHaveCssClass('x1');
    expectNativeEl(fixture, {hasX1: true, hasX2: false, hasX3: false}).not.toHaveCssClass('x2');
    expectNativeEl(fixture, {hasX1: true, hasX2: false, hasX3: false}).not.toHaveCssClass('x3');

    mediaController.activate('md');
    expectNativeEl(fixture, {hasX1: true, hasX2: false, hasX3: true}).toHaveCssClass('x1');
    expectNativeEl(fixture, {hasX1: true, hasX2: false, hasX3: true}).not.toHaveCssClass('x2');
    expectNativeEl(fixture, {hasX1: true, hasX2: false, hasX3: true}).toHaveCssClass('x3');
  });

  it('should work with ngClass array notation', () => {
    createTestComponent(`<div [ngClass.xs]="['xs-1', 'xs-2']"></div>`);
    mediaController.activate('xs');
    expectNativeEl(fixture).toHaveCssClass('xs-1');
    expectNativeEl(fixture).toHaveCssClass('xs-2');
  });


  it('should work with changing overlapping breakpoint activations', () => {
    createTestComponent('<div class="white" ngClass.lt-sm="green" ngClass.lt-md="blue"></div>');

    expectNativeEl(fixture).toHaveCssClass('white');

    mediaController.activate('xs', true);
    expectNativeEl(fixture).toHaveCssClass('green');

    mediaController.activate('sm', true);
    expectNativeEl(fixture).toHaveCssClass('blue');

    mediaController.activate('xs', true);
    expectNativeEl(fixture).toHaveCssClass('green');
  });

  it('should work with material buttons', () => {
    createTestComponent(`
          <button mat-raised-button
                  color="primary"
                  type="submit"
                  [ngClass]="{'btn-xs':formButtonXs}">
              Save
          </button>
      `);

    fixture.detectChanges();
    let button = queryFor(fixture, '[mat-raised-button]')[0].nativeElement;

    if (!isPlatformServer(platformId)) {
      expect(button).toHaveCssClass('mat-raised-button');
    }
    expect(button).toHaveCssClass('btn-xs');
    expect(button).toHaveCssClass('mat-primary');

    fixture.componentInstance.formButtonXs = false;
    fixture.detectChanges();
    button = queryFor(fixture, '[mat-raised-button]')[0].nativeElement;

    if (!isPlatformServer(platformId)) {
      expect(button).toHaveCssClass('mat-raised-button');
    }
    expect(button).not.toHaveCssClass('btn-xs');
    expect(button).toHaveCssClass('mat-primary');
  });
});

// *****************************************************************
// Template Components
// *****************************************************************

@Component({
  selector: 'test-class-api',
  template: `<span>PlaceHolder Template HTML</span>`
})
class TestClassComponent {
  hasXs1: boolean = false;
  hasXs2: boolean = false;
  hasXs3: boolean = false;
  formButtonXs = true;
}


// *******************************************************************************
// Standard tests from `angular/packages/common/test/directives/ng_class_spec.ts`
// *******************************************************************************

describe('binding to CSS class list', () => {
   let createTestComponent = makeCreateTestComponent(() => TestComponent);
   let fixture: ComponentFixture<any>;

   function normalizeClassNames(classes: string) {
     return classes.trim().split(' ').sort().join(' ');
   }

   function detectChangesAndExpectClassName(classes: string): void {
     flush();
     fixture.detectChanges();
     let nonNormalizedClassName = fixture.debugElement.children[0].nativeElement.className;
     expect(normalizeClassNames(nonNormalizedClassName)).toEqual(normalizeClassNames(classes));
   }

   function getComponent(): TestComponent { return fixture.debugElement.componentInstance; }

   beforeEach(() => {
     TestBed.configureTestingModule({
       declarations: [TestComponent],
     });
   });

   it('should clean up when the directive is destroyed', fakeAsync(() => {
        fixture = createTestComponent('<div *ngFor="let item of items" [ngClass]="item"></div>');

        getComponent().items = [['0']];

        flush();
        fixture.detectChanges();

        getComponent().items = [['1']];
        detectChangesAndExpectClassName('1');
      }));

   describe('expressions evaluating to objects', () => {

     it('should add classes specified in an object literal', fakeAsync(() => {
          fixture = createTestComponent('<div [ngClass]="{foo: true, bar: false}"></div>');

          detectChangesAndExpectClassName('foo');
        }));

     it('should add classes specified in an object literal without change in class names',
        fakeAsync(() => {
          fixture =
              createTestComponent(`<div [ngClass]="{'foo-bar': true, 'fooBar': true}"></div>`);

          detectChangesAndExpectClassName('foo-bar fooBar');
        }));

     it('should add and remove classes based on changes in object literal values', fakeAsync(() => {
          fixture =
              createTestComponent('<div [ngClass]="{foo: condition, bar: !condition}"></div>');

          detectChangesAndExpectClassName('foo');

          getComponent().condition = false;
          detectChangesAndExpectClassName('bar');
        }));

     it('should add and remove classes based on changes to the expression object', fakeAsync(() => {
          fixture = createTestComponent('<div [ngClass]="objExpr"></div>');
          const objExpr = getComponent().objExpr;

          detectChangesAndExpectClassName('foo');

          objExpr['bar'] = true;
          detectChangesAndExpectClassName('foo bar');

          objExpr['baz'] = true;
          detectChangesAndExpectClassName('foo bar baz');

          delete (objExpr['bar']);
          detectChangesAndExpectClassName('foo baz');
        }));

     it('should add and remove classes based on reference changes to the expression object',
        fakeAsync(() => {
          fixture = createTestComponent('<div [ngClass]="objExpr"></div>');

          detectChangesAndExpectClassName('foo');

          getComponent().objExpr = {foo: true, bar: true};
          detectChangesAndExpectClassName('foo bar');

          getComponent().objExpr = {baz: true};
          detectChangesAndExpectClassName('baz');
        }));

     it('should remove active classes when expression evaluates to null', fakeAsync(() => {
          fixture = createTestComponent('<div [ngClass]="objExpr"></div>');

          detectChangesAndExpectClassName('foo');

          delete getComponent().objExpr;
          detectChangesAndExpectClassName('');

          getComponent().objExpr = {'foo': false, 'bar': true};
          detectChangesAndExpectClassName('bar');
        }));


     it('should allow multiple classes per expression', fakeAsync(() => {
          fixture = createTestComponent('<div [ngClass]="objExpr"></div>');

          getComponent().objExpr = {'bar baz': true, 'bar1 baz1': true};
          detectChangesAndExpectClassName('bar baz bar1 baz1');

          getComponent().objExpr = {'bar baz': false, 'bar1 baz1': true};
          detectChangesAndExpectClassName('bar1 baz1');
        }));

     it('should split by one or more spaces between classes', fakeAsync(() => {
          fixture = createTestComponent('<div [ngClass]="objExpr"></div>');

          getComponent().objExpr = {'foo bar     baz': true};
          detectChangesAndExpectClassName('foo bar baz');
        }));
   });

   describe('expressions evaluating to lists', () => {

     it('should add classes specified in a list literal', fakeAsync(() => {
          fixture =
              createTestComponent(`<div [ngClass]="['foo', 'bar', 'foo-bar', 'fooBar']"></div>`);

          detectChangesAndExpectClassName('foo bar foo-bar fooBar');
        }));

     it('should add and remove classes based on changes to the expression', fakeAsync(() => {
          fixture = createTestComponent('<div [ngClass]="arrExpr"></div>');
          const arrExpr = getComponent().arrExpr;
          detectChangesAndExpectClassName('foo');

          arrExpr.push('bar');
          detectChangesAndExpectClassName('foo bar');

          arrExpr[1] = 'baz';
          detectChangesAndExpectClassName('foo baz');

          getComponent().arrExpr = arrExpr.filter((v: string) => v !== 'baz');
          detectChangesAndExpectClassName('foo');
        }));

     it('should add and remove classes when a reference changes', fakeAsync(() => {
          fixture = createTestComponent('<div [ngClass]="arrExpr"></div>');
          detectChangesAndExpectClassName('foo');

          getComponent().arrExpr = ['bar'];
          detectChangesAndExpectClassName('bar');
        }));

     it('should take initial classes into account when a reference changes', fakeAsync(() => {
          fixture = createTestComponent('<div class="foo" [ngClass]="arrExpr"></div>');
          detectChangesAndExpectClassName('foo');

          getComponent().arrExpr = ['bar'];
          detectChangesAndExpectClassName('foo bar');
        }));

     it('should ignore empty or blank class names', fakeAsync(() => {
          fixture = createTestComponent('<div class="foo" [ngClass]="arrExpr"></div>');
          getComponent().arrExpr = ['', '  '];
          detectChangesAndExpectClassName('foo');
        }));

     it('should trim blanks from class names', fakeAsync(() => {
          fixture = createTestComponent('<div class="foo" [ngClass]="arrExpr"></div>');

          getComponent().arrExpr = [' bar  '];
          detectChangesAndExpectClassName('foo bar');
        }));


     it('should allow multiple classes per item in arrays', fakeAsync(() => {
          fixture = createTestComponent('<div [ngClass]="arrExpr"></div>');

          getComponent().arrExpr = ['foo bar baz', 'foo1 bar1   baz1'];
          detectChangesAndExpectClassName('foo bar baz foo1 bar1 baz1');

          getComponent().arrExpr = ['foo bar   baz foobar'];
          detectChangesAndExpectClassName('foo bar baz foobar');
        }));

     it('should throw with descriptive error message when CSS class is not a string', () => {
       fixture = createTestComponent(`<div [ngClass]="['foo', {}]"></div>`);
       expect(() => fixture.detectChanges())
           .toThrowError(
               /NgClass can only toggle CSS classes expressed as strings, got \[object Object\]/);
     });
   });

   describe('expressions evaluating to sets', () => {

     it('should add and remove classes if the set instance changed', fakeAsync(() => {
          fixture = createTestComponent('<div [ngClass]="setExpr"></div>');
          let setExpr = new Set<string>();
          setExpr.add('bar');
          getComponent().setExpr = setExpr;
          detectChangesAndExpectClassName('bar');

          setExpr = new Set<string>();
          setExpr.add('baz');
          getComponent().setExpr = setExpr;
          detectChangesAndExpectClassName('baz');
        }));
   });

   describe('expressions evaluating to string', () => {

     it('should add classes specified in a string literal', fakeAsync(() => {
          fixture = createTestComponent(`<div [ngClass]="'foo bar foo-bar fooBar'"></div>`);
          detectChangesAndExpectClassName('foo bar foo-bar fooBar');
        }));

     it('should add and remove classes based on changes to the expression', fakeAsync(() => {
          fixture = createTestComponent('<div [ngClass]="strExpr"></div>');
          detectChangesAndExpectClassName('foo');

          getComponent().strExpr = 'foo bar';
          detectChangesAndExpectClassName('foo bar');


          getComponent().strExpr = 'baz';
          detectChangesAndExpectClassName('baz');
        }));

     it('should remove active classes when switching from string to null', fakeAsync(() => {
          fixture = createTestComponent(`<div [ngClass]="strExpr"></div>`);
          detectChangesAndExpectClassName('foo');

          delete getComponent().strExpr;
          detectChangesAndExpectClassName('');
        }));

     it('should take initial classes into account when switching from string to null',
        fakeAsync(() => {
          fixture = createTestComponent(`<div class="foo" [ngClass]="strExpr"></div>`);
          detectChangesAndExpectClassName('foo');

          delete getComponent().strExpr;
          detectChangesAndExpectClassName('foo');
        }));

     it('should ignore empty and blank strings', fakeAsync(() => {
          fixture = createTestComponent(`<div class="foo" [ngClass]="strExpr"></div>`);
          getComponent().strExpr = '';
          detectChangesAndExpectClassName('foo');
        }));

   });

   describe('cooperation with other class-changing constructs', () => {

     it('should co-operate with the class attribute', fakeAsync(() => {
          fixture = createTestComponent('<div [ngClass]="objExpr" class="init foo"></div>');
          const objExpr = getComponent().objExpr;

          objExpr['bar'] = true;
          detectChangesAndExpectClassName('init foo bar');

          objExpr['foo'] = false;
          detectChangesAndExpectClassName('init bar');

          delete getComponent().objExpr;
          detectChangesAndExpectClassName('init foo');
        }));

     it('should co-operate with the interpolated class attribute', fakeAsync(() => {
          fixture = createTestComponent(`<div [ngClass]="objExpr" class="{{'init foo'}}"></div>`);
          const objExpr = getComponent().objExpr;

          objExpr['bar'] = true;
          detectChangesAndExpectClassName(`init foo bar`);

          objExpr['foo'] = false;
          detectChangesAndExpectClassName(`init bar`);

          delete getComponent().objExpr;
          detectChangesAndExpectClassName(`init foo`);
        }));

     it('should co-operate with the class attribute and binding to it', fakeAsync(() => {
          fixture =
              createTestComponent(`<div [ngClass]="objExpr" class="init" [class]="'foo'"></div>`);
          const objExpr = getComponent().objExpr;

          objExpr['bar'] = true;
          detectChangesAndExpectClassName(`init foo bar`);

          objExpr['foo'] = false;
          detectChangesAndExpectClassName(`init bar`);

          delete getComponent().objExpr;
          detectChangesAndExpectClassName(`init foo`);
        }));

     it('should co-operate with the class attribute and ngClass.name binding', fakeAsync(() => {
          const template =
              '<div class="init foo" [ngClass]="objExpr" [class.baz]="condition"></div>';
          fixture = createTestComponent(template);
          const objExpr = getComponent().objExpr;

          detectChangesAndExpectClassName('init foo baz');

          objExpr['bar'] = true;
          detectChangesAndExpectClassName('init foo baz bar');

          objExpr['foo'] = false;
          detectChangesAndExpectClassName('init baz bar');

          getComponent().condition = false;
          detectChangesAndExpectClassName('init bar');
        }));

     it('should co-operate with initial class and class attribute binding when binding changes',
        fakeAsync(() => {
          const template = '<div class="init" [ngClass]="objExpr" [class]="strExpr"></div>';
          fixture = createTestComponent(template);
          const cmp = getComponent();

          detectChangesAndExpectClassName('init foo');

          cmp.objExpr['bar'] = true;
          detectChangesAndExpectClassName('init foo bar');

          cmp.strExpr = 'baz';
          detectChangesAndExpectClassName('init bar baz foo');

          delete cmp.objExpr;
          detectChangesAndExpectClassName('init baz');
        }));
   });
 });

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  condition = true;
  items: any[] = [];
  arrExpr: string[] = ['foo'];
  setExpr: Set<string> = new Set<string>();
  objExpr: {[klass: string]: any} = {'foo': true, 'bar': false};
  strExpr = 'foo';

  constructor() { this.setExpr.add('foo'); }
}


