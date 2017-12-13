/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Component, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed, async, inject} from '@angular/core/testing';

import {DEFAULT_BREAKPOINTS_PROVIDER} from '../../media-query/breakpoints/break-points-provider';
import {BreakPointRegistry} from '../../media-query/breakpoints/break-point-registry';
import {MockMatchMedia} from '../../media-query/mock/mock-match-media';
import {MatchMedia} from '../../media-query/match-media';
import {FlexLayoutModule} from '../../module';
import {FlexDirective} from '../../api/flexbox/flex';
import {LayoutDirective} from '../../api/flexbox/layout';

import {customMatchers, expect} from '../../utils/testing/custom-matchers';
import {_dom as _} from '../../utils/testing/dom-tools';

import {
  makeExpectDOMFrom,
  makeExpectDOMForQuery,
  makeCreateTestComponent,
  expectNativeEl,
  queryFor
} from '../../utils/testing/helpers';



describe('flex directive', () => {
  let fixture: ComponentFixture<any>;
  let matchMedia: MockMatchMedia;
  let expectDOMFrom = makeExpectDOMFrom(() => TestFlexComponent);
  let expectDomForQuery = makeExpectDOMForQuery(() => TestFlexComponent);
  let componentWithTemplate = (template: string) => {
    fixture = makeCreateTestComponent(() => TestFlexComponent)(template);

    inject([MatchMedia], (_matchMedia: MockMatchMedia) => {
      matchMedia = _matchMedia;
    })();
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, FlexLayoutModule],
      declarations: [TestFlexComponent, TestQueryWithFlexComponent],
      providers: [
        BreakPointRegistry, DEFAULT_BREAKPOINTS_PROVIDER,
        {provide: MatchMedia, useClass: MockMatchMedia}
      ]
    });
  });

  describe('with static features', () => {

    it('should add correct styles for default `fxFlex` usage', () => {
      componentWithTemplate(`<div fxFlex></div>`);
      fixture.detectChanges();

      let dom = fixture.debugElement.children[0].nativeElement;
      let isBox = _.hasStyle(dom, 'box-sizing', 'border-box');
      let hasFlex = _.hasStyle(dom, 'flex', '1 1 1e-09px') ||         // IE
          _.hasStyle(dom, 'flex', '1 1 1e-9px') ||          // Chrome
          _.hasStyle(dom, 'flex', '1 1 0.000000001px') ||   // Safari
          _.hasStyle(dom, 'flex', '1 1 0px');

      expect(isBox).toBeTruthy();
      expect(hasFlex).toBeTruthy();
    });

    it('should apply `fxGrow` value to flex-grow when used default `fxFlex`', () => {
      componentWithTemplate(`<div fxFlex fxGrow="10"></div>`);
      fixture.detectChanges();

      let dom = fixture.debugElement.children[0].nativeElement;
      let isBox = _.hasStyle(dom, 'box-sizing', 'border-box');
      let hasFlex = _.hasStyle(dom, 'flex', '10 1 1e-09px') ||         // IE
          _.hasStyle(dom, 'flex', '10 1 1e-9px') ||          // Chrome
          _.hasStyle(dom, 'flex', '10 1 0.000000001px') ||   // Safari
          _.hasStyle(dom, 'flex', '10 1 0px');

      expect(isBox).toBeTruthy();
      expect(hasFlex).toBeTruthy();
    });

    it('should apply `fxShrink` value to flex-shrink when used default `fxFlex`', () => {
      componentWithTemplate(`<div fxFlex fxShrink="10"></div>`);
      fixture.detectChanges();

      let dom = fixture.debugElement.children[0].nativeElement;
      let isBox = _.hasStyle(dom, 'box-sizing', 'border-box');
      let hasFlex = _.hasStyle(dom, 'flex', '1 10 1e-09px') ||         // IE
          _.hasStyle(dom, 'flex', '1 10 1e-9px') ||          // Chrome
          _.hasStyle(dom, 'flex', '1 10 0.000000001px') ||   // Safari
          _.hasStyle(dom, 'flex', '1 10 0px');

      expect(isBox).toBeTruthy();
      expect(hasFlex).toBeTruthy();
    });

    it('should apply both `fxGrow` and `fxShrink` when used with default fxFlex', () => {
      componentWithTemplate(`<div fxFlex fxGrow="4" fxShrink="5"></div>`);
      fixture.detectChanges();

      let dom = fixture.debugElement.children[0].nativeElement;
      let isBox = _.hasStyle(dom, 'box-sizing', 'border-box');
      let hasFlex = _.hasStyle(dom, 'flex', '4 5 1e-09px') ||         // IE
          _.hasStyle(dom, 'flex', '4 5 1e-9px') ||          // Chrome
          _.hasStyle(dom, 'flex', '4 5 0.000000001px') ||   // Safari
          _.hasStyle(dom, 'flex', '4 5 0px');

      expect(isBox).toBeTruthy();
      expect(hasFlex).toBeTruthy();
    });

    it('should add correct styles for `fxFlex="0%"` usage', () => {
      expectDOMFrom(`<div fxFlex='2%'></div>`).toHaveStyle({
        'max-width': '2%',
        'flex': '1 1 100%',
        'box-sizing': 'border-box',
      });
    });

    it('should work with percentage values', () => {
      expectDOMFrom(`<div fxFlex='37%'></div>`).toHaveStyle({
        'flex': '1 1 100%',
        'max-width': '37%',
        'box-sizing': 'border-box',
      });
    });
    it('should work with pixel values', () => {
      expectDOMFrom(`<div fxFlex='37px'></div>`).toHaveStyle({
        'flex': '1 1 37px',
        'box-sizing': 'border-box',
      });
    });
    it('should work with "1 0 auto" values', () => {
      expectDOMFrom(`<div fxFlex='1 0 auto'></div>`).toHaveStyle({
        'flex': '1 0 auto',
        'box-sizing': 'border-box',
      });
    });

    it('should work fxLayout parents', () => {
      componentWithTemplate(`
        <div fxLayout='column' class='test'>
          <div fxFlex='30px' fxFlex.gt-sm='50'  >  </div>
        </div>
      `);
      fixture.detectChanges();
      let parent = queryFor(fixture, '.test')[0].nativeElement;
      let element = queryFor(fixture, '[fxFlex]')[0].nativeElement;

      // parent flex-direction found with 'column' with child height styles
      expect(parent).toHaveStyle({'flex-direction': 'column', 'display': 'flex'});
      expect(element).toHaveStyle({'min-height': '30px'});
      expect(element).not.toHaveStyle({'min-width': '30px'});
    });

    it('should CSS stylesheet and not inject flex-direction on parent', () => {
      componentWithTemplate(`
        <style>
          .test { flex-direction:column; display: flex; }
        </style>
        <div class='test'>
          <div fxFlex='30px' fxFlex.gt-sm='50'  >  </div>
        </div>
      `);

      fixture.detectChanges();
      let parent = queryFor(fixture, '.test')[0].nativeElement;
      let element = queryFor(fixture, '[fxFlex]')[0].nativeElement;

      // parent flex-direction found with 'column' with child height styles
      expect(parent).toHaveStyle({'flex-direction': 'column', 'display': 'flex'});
      expect(element).toHaveStyle({'min-height': '30px'});
      expect(element).not.toHaveStyle({'min-width': '30px'});
    });

    it('should not work with non-direct-parent fxLayouts', async(() => {
      componentWithTemplate(`
        <div fxLayout='column'>
          <div class='test'>
            <div fxFlex='40px' fxFlex.gt-sm='50'  >  </div>
          </div>
        </div>
      `);
      fixture.detectChanges();
      let element = queryFor(fixture, '[fxFlex]')[0].nativeElement;
      let parent = queryFor(fixture, '.test')[0].nativeElement;

      setTimeout(() => {
        // The parent flex-direction not found;
        // A flex-direction should have been auto-injected to the parent...
        // fallback to 'row' and set child width styles accordingly
        expect(parent).toHaveStyle({'flex-direction': 'row'});
        expect(element).toHaveStyle({'min-width': '40px'});
        expect(element).not.toHaveStyle({'min-height': '40px'});
      });

    }));

    it('should work with styled-parent flex directions', () => {
      componentWithTemplate(`
        <div fxLayout='row'>
          <div style='flex-direction:column' class='parent'>
            <div fxFlex='60px' >  </div>
          </div>
        </div>
      `);
      fixture.detectChanges();
      let element = queryFor(fixture, '[fxFlex]')[0].nativeElement;
      let parent = queryFor(fixture, '.parent')[0].nativeElement;

      // parent flex-direction found with 'column'; set child with height styles
      expect(element).toHaveStyle({'min-height': '60px'});
      expect(parent).toHaveStyle({'flex-direction': 'column'});
    });

    it('should work with "1 1 auto" values', () => {
      componentWithTemplate(`
        <div fxLayout='column'>
          <div fxFlex='auto' fxFlex.gt-sm='50'  >  </div>
          <div fxFlex='auto' fxFlex.gt-sm='24.4'>  </div>
          <div fxFlex='auto' fxFlex.gt-sm='25.6'>  </div>
        </div>
      `);
      fixture.detectChanges();

      let nodes = queryFor(fixture, '[fxFlex]');

      expect(nodes.length).toEqual(3);
      expect(nodes[1].nativeElement).not.toHaveStyle({'max-height': '*', 'min-height': '*'});
      expect(nodes[1].nativeElement).toHaveStyle({
        'flex': '1 1 auto',
        'box-sizing': 'border-box'
      });
    });

    // const isIE = !!document['documentMode'];
    //
    // it('should work with calc values', () => {
    //   // @see http://caniuse.com/#feat=calc for IE issues with calc()
    //   if (!isIE ) {
    //     expectDOMFrom(`<div fxFlex='calc(30vw - 10px)'></div>`).toHaveStyle({
    //       'box-sizing': 'border-box',
    //       'flex': '1 1 calc(30vw - 10px)'
    //     });
    //   }
    // });
    //
    // it('should work with calc without internal whitespaces', async(() => {
    //   // @see http://caniuse.com/#feat=calc for IE issues with calc()
    //   if (!isIE) {
    //     componentWithTemplate('<div fxFlex="calc(75%-10px)"></div>');
    //     fixture.detectChanges();
    //
    //     setTimeout(() => {
    //       expectNativeEl(fixture).toHaveStyle({
    //         'box-sizing': 'border-box',
    //         'flex': '1 1 calc(75% - 10px)' // correct version has whitespace
    //       });
    //     });
    //   }
    // }));

    it('should work with "auto" values', () => {
      expectDOMFrom(`<div fxFlex='auto'></div>`).toHaveStyle({
        'flex': '1 1 auto'
      });
    });
    it('should work with "nogrow" values', () => {
      expectDOMFrom(`<div fxFlex='nogrow'></div>`).toHaveStyle({
        'flex': '0 1 auto'
      });
    });
    it('should work with "grow" values', () => {
      expectDOMFrom(`<div fxFlex='grow'></div>`).toHaveStyle({
        'flex': '1 1 100%'
      });
    });
    it('should work with "initial" values', () => {
      expectDOMFrom(`<div fxFlex='initial'></div>`).toHaveStyle({
        'flex': '0 1 auto'
      });
    });
    it('should work with "noshrink" values', () => {
      expectDOMFrom(`<div fxFlex='noshrink'></div>`).toHaveStyle({
        'flex': '1 0 auto'
      });
    });
    it('should work with "none" values', () => {
      expectDOMFrom(`<div fxFlex='none'></div>`).toHaveStyle({
        'flex': '0 0 auto'
      });
    });

    it('should work with full-spec values', () => {
      expectDOMFrom(`<div fxFlex='1 2 0.9em'></div>`).toHaveStyle({
        'flex': '1 2 0.9em'
      });
    });
    it('should set a min-width when the shrink == 0', () => {
      expectDOMFrom(`<div fxFlex='1 0 37px'></div>`).toHaveStyle({
        'flex': '1 0 37px',
        'min-width': '37px',
        'box-sizing': 'border-box',
      });
    });
    it('should set a min-width and max-width when the grow == 0 and shrink == 0', () => {
      expectDOMFrom(`<div fxFlex='0 0 375px'></div>`).toHaveStyle({
        'flex': '0 0 375px',
        'max-width': '375px',
        'min-width': '375px',
        'box-sizing': 'border-box',
      });
    });


    it('should not set max-width to 69px when fxFlex="1 0 69px"', () => {
      expectDOMFrom(`<div fxFlex='1 0 69px'></div>`).not.toHaveStyle({
        'max-width': '69px',
      });
    });

    it('should not set a max-width when the shrink == 0', () => {
      componentWithTemplate(`<div fxFlex='1 0 303px'></div>`);
      fixture.detectChanges();

      let dom = fixture.debugElement.children[0].nativeElement;
      let maxWidthStyle = _.getStyle(dom, 'max-width');

      expect(maxWidthStyle).toBeFalsy();
    });

    it('should not set min-width to 96px when fxFlex="0 1 96px"', () => {
      expectDOMFrom(`<div fxFlex='0 1 96px'></div>`).not.toHaveStyle({
        'min-width': '96px',
      });
    });

    it('should not set a min-width when the grow == 0', () => {
      componentWithTemplate(`<div fxFlex='0 1 313px'></div>`);
      fixture.detectChanges();

      let dom = fixture.debugElement.children[0].nativeElement;
      let minWidthStyle = _.getStyle(dom, 'min-width');

      expect(minWidthStyle).toBeFalsy();
    });

    it('should set a min-width when basis is a Px value', () => {
      expectDOMFrom(`<div fxFlex='312px'></div>`).toHaveStyle({
        'flex': '1 1 312px',
        'max-width': '312px',
        'min-width': '312px'
      });
    });

    describe('', () => {

      it('should ignore fxLayout settings on same element', () => {
        expectDOMFrom(`
          <div fxLayout='column' fxFlex='37%'>
          </div>
        `)
            .not.toHaveStyle({
          'flex-direction': 'row',
          'flex': '1 1 100%',
          'max-height': '37%',
        });
      });

      it('should set max-height for `fxFlex="<%val>"` with parent using fxLayout="column" ', () => {
        let template = `
          <div fxLayout='column'>
            <div fxFlex='37%'></div>
          </div>
        `;

        expectDomForQuery(template, '[fxFlex]')
            .toHaveStyle({
              'flex': '1 1 100%',
              'max-height': '37%',
            });
      });

      it('should set max-width for `fxFlex="<%val>"`', () => {
        expectDOMFrom(`<div fxFlex='37%'></div>`).toHaveStyle({
          'flex': '1 1 100%',
          'max-width': '37%',
        });
      });

      it('should set max-width for `fxFlex="2%"` usage', () => {
        expectDOMFrom(`<div fxFlex='2%'></div>`).toHaveStyle({
          'flex': '1 1 100%',
          'max-width': '2%',
        });
      });

    });
  });

  describe('with responsive features', () => {

    it('should initialize the component with the largest matching breakpoint', () => {
      componentWithTemplate(`
        <div  fxFlex='auto'
              fxFlex.gt-xs='33%'
              fxFlex.gt-sm='50%' >
        </div>
      `);

      matchMedia.activate('xl', true);
      fixture.detectChanges();

      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 100%',
        'max-width': '50%'
      });

      matchMedia.activate('sm', true);
      fixture.detectChanges();

      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 100%',
        'max-width': '33%'
      });
    });

    it('should fallback properly to default flex values', () => {
      componentWithTemplate(`
        <div fxLayout='column'>
          <div fxFlex='auto' fxFlex.gt-sm='50'  >  </div>
          <div fxFlex='auto' fxFlex.gt-sm='24.4'>  </div>
          <div fxFlex='auto' fxFlex.gt-sm='25.6'>  </div>
        </div>
      `);

      matchMedia.useOverlaps = true;
      matchMedia.activate('sm');
      fixture.detectChanges();

      let nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes.length).toEqual(3);
      expect(nodes[0].nativeElement).toHaveStyle({'flex': '1 1 auto'});
      expect(nodes[1].nativeElement).toHaveStyle({'flex': '1 1 auto'});
      expect(nodes[2].nativeElement).toHaveStyle({'flex': '1 1 auto'});

      matchMedia.activate('xl');
      fixture.detectChanges();

      nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes[0].nativeElement).toHaveStyle({'flex': '1 1 100%', 'max-height': '50%'});
      expect(nodes[1].nativeElement).toHaveStyle({'flex': '1 1 100%', 'max-height': '24.4%'});
      expect(nodes[2].nativeElement).toHaveStyle({'flex': '1 1 100%', 'max-height': '25.6%'});

      matchMedia.activate('sm');
      fixture.detectChanges();

      nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes.length).toEqual(3);
      expect(nodes[0].nativeElement).toHaveStyle({'flex': '1 1 auto'});
      expect(nodes[1].nativeElement).toHaveStyle({'flex': '1 1 auto'});
      expect(nodes[2].nativeElement).toHaveStyle({'flex': '1 1 auto'});

      expect(nodes[0].nativeElement).not.toHaveStyle({'max-height': '50%'});
      expect(nodes[1].nativeElement).not.toHaveStyle({'max-height': '24.4%'});
      expect(nodes[2].nativeElement).not.toHaveStyle({'max-height': '25.6%'});
      expect(nodes[0].nativeElement).not.toHaveStyle({'max-height': '*'});
      expect(nodes[1].nativeElement).not.toHaveStyle({'max-height': '*'});
      expect(nodes[2].nativeElement).not.toHaveStyle({'max-height': '*'});
    });

    it('should fallback to the default layout from gt-md selectors', () => {
      componentWithTemplate(`
        <div fxLayout='column'>
          <div fxFlex='auto' fxFlex.gt-md='50'  >  </div>
          <div fxFlex='auto' fxFlex.gt-md='24.4'>  </div>
          <div fxFlex='auto' fxFlex.gt-md='25.6'>  </div>
        </div>
      `);

      matchMedia.activate('md');
      fixture.detectChanges();
      let nodes = queryFor(fixture, '[fxFlex]');

      expect(nodes.length).toEqual(3);
      expect(nodes[0].nativeElement).toHaveStyle({'flex': '1 1 auto'});
      expect(nodes[1].nativeElement).toHaveStyle({'flex': '1 1 auto'});
      expect(nodes[2].nativeElement).toHaveStyle({'flex': '1 1 auto'});

      matchMedia.activate('sm');
      fixture.detectChanges();
      nodes = queryFor(fixture, '[fxFlex]');

      expect(nodes[0].nativeElement).toHaveStyle({'flex': '1 1 auto'});
      expect(nodes[1].nativeElement).toHaveStyle({'flex': '1 1 auto'});
      expect(nodes[2].nativeElement).toHaveStyle({'flex': '1 1 auto'});

      matchMedia.activate('lg', true);
      fixture.detectChanges();
      nodes = queryFor(fixture, '[fxFlex]');

      expect(nodes[0].nativeElement).toHaveStyle({'flex': '1 1 100%', 'max-height': '50%'});
      expect(nodes[1].nativeElement).toHaveStyle({'flex': '1 1 100%', 'max-height': '24.4%'});
      expect(nodes[2].nativeElement).toHaveStyle({'flex': '1 1 100%', 'max-height': '25.6%'});
    });

    it('should fallback to the default layout from lt-md selectors', () => {
      componentWithTemplate(`
        <div fxLayout='column'>
          <div fxFlex='auto' fxFlex.lt-md='50'  >  </div>
        </div>
      `);

      matchMedia.activate('md', true);
      fixture.detectChanges();
      let nodes = queryFor(fixture, '[fxFlex]');

      expect(nodes.length).toEqual(1);
      expect(nodes[0].nativeElement).toHaveStyle({'flex': '1 1 auto'});

      matchMedia.activate('sm', true);
      fixture.detectChanges();
      nodes = queryFor(fixture, '[fxFlex]');

      expect(nodes[0].nativeElement).toHaveStyle({
        'flex': '1 1 100%',
        'max-height': '50%'
      });

      matchMedia.activate('lg', true);
      fixture.detectChanges();
      nodes = queryFor(fixture, '[fxFlex]');

      expect(nodes[0].nativeElement).toHaveStyle({'flex': '1 1 auto'});

    });
  });

  describe('with API directive queries', () => {
    it('should query the ViewChild `fxLayout` directive properly', () => {
      fixture = TestBed.createComponent(TestQueryWithFlexComponent);
      fixture.detectChanges();

      const layout: LayoutDirective = fixture.debugElement.componentInstance.layout;

      expect(layout).toBeDefined();
      expect(layout.activatedValue).toBe('');
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'row'
      });

      layout.activatedValue = 'column';
      expect(layout.activatedValue).toBe('column');
      expectNativeEl(fixture).toHaveStyle({
        'flex-direction': 'column'
      });
    });

    it('should query the ViewChild `fxFlex` directive properly', () => {
      fixture = TestBed.createComponent(TestQueryWithFlexComponent);
      fixture.detectChanges();

      const flex: FlexDirective = fixture.debugElement.componentInstance.flex;

      // Test for percentage value assignments
      expect(flex).toBeDefined();
      expect(flex.activatedValue).toBe('50%');

      let nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes.length).toEqual(1);
      expect(nodes[0].nativeElement).toHaveStyle({'max-width': '50%'});

      // Test for raw value assignments that are converted to percentages
      flex.activatedValue = '35';
      expect(flex.activatedValue).toBe('35');

      nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes.length).toEqual(1);
      expect(nodes[0].nativeElement).toHaveStyle({'max-width': '35%'});

      // Test for pixel value assignments
      flex.activatedValue = '27.5px';
      expect(flex.activatedValue).toBe('27.5px');

      nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes.length).toEqual(1);
      expect(nodes[0].nativeElement).toHaveStyle({'max-width': '27.5px'});

    });

    it('should restore `fxFlex` value after breakpoint activations', inject([MatchMedia],
        (_matchMedia: MockMatchMedia) => {
          fixture = TestBed.createComponent(TestQueryWithFlexComponent);
          fixture.detectChanges();

          const flex: FlexDirective = fixture.debugElement.componentInstance.flex;

          // Test for raw value assignments that are converted to percentages
          expect(flex).toBeDefined();
          flex.activatedValue = '35';
          expect(flex.activatedValue).toBe('35');

          let nodes = queryFor(fixture, '[fxFlex]');
          expect(nodes.length).toEqual(1);
          expect(nodes[0].nativeElement).toHaveStyle({'max-width': '35%'});

          _matchMedia.activate('sm');
          fixture.detectChanges();

          // Test for breakpoint value changes
          expect(flex.activatedValue).toBe('71%');
          nodes = queryFor(fixture, '[fxFlex]');
          expect(nodes[0].nativeElement).toHaveStyle({'max-width': '71%'});

          _matchMedia.activate('lg');
          fixture.detectChanges();

          // Confirm activatedValue was restored properly when `sm` deactivated
          expect(flex.activatedValue).toBe('35');
          nodes = queryFor(fixture, '[fxFlex]');
          expect(nodes[0].nativeElement).toHaveStyle({'max-width': '35%'});

        })
    );
  });

});


// *****************************************************************
// Template Component
// *****************************************************************

@Component({
  selector: 'test-layout',
  template: `<span>PlaceHolder Template HTML</span>`
})
export class TestFlexComponent {
  direction = 'column';
}

@Component({
  selector: 'test-query-with-flex',
  template: `
    <div fxLayout>
      <div fxFlex='50%' fxFlex.sm='71%'></div>
    </div>
  `
})
export class TestQueryWithFlexComponent {
  @ViewChild(FlexDirective) flex: FlexDirective;
  @ViewChild(LayoutDirective) layout: LayoutDirective;
}
