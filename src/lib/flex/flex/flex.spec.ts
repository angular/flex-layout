/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Component, PLATFORM_ID, ViewChild} from '@angular/core';
import {CommonModule, isPlatformServer} from '@angular/common';
import {ComponentFixture, TestBed, async, inject} from '@angular/core/testing';
import {Platform, PlatformModule} from '@angular/cdk/platform';
import {
  MatchMedia,
  MockMatchMedia,
  MockMatchMediaProvider,
  SERVER_TOKEN,
  StyleUtils,
} from '@angular/flex-layout/core';

import {FlexLayoutModule} from '../../module';
import {FlexDirective} from './flex';
import {LayoutDirective} from '../layout/layout';
import {customMatchers, expect} from '../../utils/testing/custom-matchers';
import {
  makeCreateTestComponent,
  expectNativeEl,
  queryFor,
  expectEl,
} from '../../utils/testing/helpers';


describe('flex directive', () => {
  let fixture: ComponentFixture<any>;
  let matchMedia: MockMatchMedia;
  let styler: StyleUtils;
  let platform: Platform;
  let platformId: Object;
  let componentWithTemplate = (template: string) => {
    fixture = makeCreateTestComponent(() => TestFlexComponent)(template);

    inject([MatchMedia, StyleUtils, Platform, PLATFORM_ID],
      (_matchMedia: MockMatchMedia, _styler: StyleUtils, _platform: Platform,
       _platformId: Object) => {
      matchMedia = _matchMedia;
      styler = _styler;
      platform = _platform;
      platformId = _platformId;
    })();
  };

  beforeEach(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, FlexLayoutModule, PlatformModule],
      declarations: [TestFlexComponent, TestQueryWithFlexComponent],
      providers: [
        MockMatchMediaProvider,
        {provide: SERVER_TOKEN, useValue: true}
      ]
    });
  });

  describe('with static features', () => {

    it('should add correct styles for default `fxFlex` usage', () => {
      componentWithTemplate(`<div fxFlex></div>`);
      fixture.detectChanges();

      let dom = fixture.debugElement.children[0];
      expectEl(dom).toHaveStyle({'box-sizing': 'border-box'}, styler);

      if (platform.BLINK) {
        expectEl(dom).toHaveStyle({'flex': '1 1 1e-09px'}, styler);
      } else if (platform.FIREFOX) {
        expectEl(dom).toHaveStyle({'flex': '1 1 1e-9px'}, styler);
      } else if (platform.EDGE || platform.TRIDENT) {
        expectEl(dom).toHaveStyle({'flex': '1 1 0px'}, styler);
      } else {
        expectEl(dom).toHaveStyle({'flex': '1 1 0.000000001px'}, styler);
      }
    });

    it('should apply `fxGrow` value to flex-grow when used default `fxFlex`', () => {
      componentWithTemplate(`<div fxFlex fxGrow="10"></div>`);
      fixture.detectChanges();

      let dom = fixture.debugElement.children[0];

      expectEl(dom).toHaveStyle({'box-sizing': 'border-box'}, styler);

      if (platform.BLINK) {
        expectEl(dom).toHaveStyle({'flex': '10 1 1e-09px'}, styler);
      } else if (platform.FIREFOX) {
        expectEl(dom).toHaveStyle({'flex': '10 1 1e-9px'}, styler);
      } else if (platform.EDGE || platform.TRIDENT) {
        expectEl(dom).toHaveStyle({'flex': '10 1 0px'}, styler);
      } else {
        expectEl(dom).toHaveStyle({'flex': '10 1 0.000000001px'}, styler);
      }
    });

    it('should apply `fxShrink` value to flex-shrink when used default `fxFlex`', () => {
      componentWithTemplate(`<div fxFlex fxShrink="10"></div>`);
      fixture.detectChanges();

      let dom = fixture.debugElement.children[0];

      expectEl(dom).toHaveStyle({'box-sizing': 'border-box'}, styler);

      if (platform.BLINK) {
        expectEl(dom).toHaveStyle({'flex': '1 10 1e-09px'}, styler);
      } else if (platform.FIREFOX) {
        expectEl(dom).toHaveStyle({'flex': '1 10 1e-9px'}, styler);
      } else if (platform.EDGE || platform.TRIDENT) {
        expectEl(dom).toHaveStyle({'flex': '1 10 0px'}, styler);
      } else {
        expectEl(dom).toHaveStyle({'flex': '1 10 0.000000001px'}, styler);
      }
    });

    it('should apply both `fxGrow` and `fxShrink` when used with default fxFlex', () => {
      componentWithTemplate(`<div fxFlex fxGrow="4" fxShrink="5"></div>`);
      fixture.detectChanges();

      let dom = fixture.debugElement.children[0];
      expectEl(dom).toHaveStyle({'box-sizing': 'border-box'}, styler);

      if (platform.BLINK) {
        expectEl(dom).toHaveStyle({'flex': '4 5 1e-09px'}, styler);
      } else if (platform.FIREFOX) {
        expectEl(dom).toHaveStyle({'flex': '4 5 1e-9px'}, styler);
      } else if (platform.EDGE || platform.TRIDENT) {
        expectEl(dom).toHaveStyle({'flex': '4 5 0px'}, styler);
      } else {
        expectEl(dom).toHaveStyle({'flex': '4 5 0.000000001px'}, styler);
      }
    });

    it('should add correct styles for `fxFlex="0%"` usage', () => {
      componentWithTemplate(`<div fxFlex='2%'></div>`);

      fixture.detectChanges();
      expectNativeEl(fixture).toHaveStyle({
        'max-width': '2%',
        'flex': '1 1 100%',
        'box-sizing': 'border-box',
      }, styler);
    });

    it('should work with percentage values', () => {
      componentWithTemplate(`<div fxFlex='37%'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 100%',
        'max-width': '37%',
        'box-sizing': 'border-box',
      }, styler);
    });
    it('should work with pixel values', () => {
      componentWithTemplate(`<div fxFlex='37px'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 37px',
        'box-sizing': 'border-box',
      }, styler);
    });
    it('should work with "1 0 auto" values', () => {
      componentWithTemplate(`<div fxFlex='1 0 auto'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 0 auto',
        'box-sizing': 'border-box',
      }, styler);
    });

    it('should work fxLayout parents', () => {
      componentWithTemplate(`
        <div fxLayout='column' class='test'>
          <div fxFlex='30px' fxFlex.gt-sm='50'  >  </div>
        </div>
      `);
      fixture.detectChanges();
      let parent = queryFor(fixture, '.test')[0];
      let element = queryFor(fixture, '[fxFlex]')[0];

      // parent flex-direction found with 'column' with child height styles
      expectEl(parent).toHaveStyle({'flex-direction': 'column', 'display': 'flex'}, styler);
      expectEl(element).toHaveStyle({'min-height': '30px'}, styler);
      expectEl(element).not.toHaveStyle({'min-width': '30px'}, styler);
    });

    it('should CSS stylesheet and not inject flex-direction on parent', () => {
      componentWithTemplate(`
        <style>
          .test { flex-direction:column; display: flex; }
        </style>
        <div class='test'>
          <div fxFlex='30px' fxFlex.gt-sm='50'></div>
        </div>
      `);

      fixture.detectChanges();
      let parent = queryFor(fixture, '.test')[0];
      let element = queryFor(fixture, '[fxFlex]')[0];

      // TODO(CaerusKaru): Domino is unable to detect this style
      if (!isPlatformServer(platformId)) {
        // parent flex-direction found with 'column' with child height styles
        expectEl(parent).toHaveStyle({'flex-direction': 'column', 'display': 'flex'}, styler);
        expectEl(element).toHaveStyle({'min-height': '30px'}, styler);
        expectEl(element).not.toHaveStyle({'min-width': '30px'}, styler);
      }
    });

    it('should not work with non-direct-parent fxLayouts', async(() => {
      componentWithTemplate(`
        <div fxLayout='column'>
          <div class='test'>
            <div fxFlex='40px' fxFlex.gt-sm='50'></div>
          </div>
        </div>
      `);
      fixture.detectChanges();
      let element = queryFor(fixture, '[fxFlex]')[0];
      let parent = queryFor(fixture, '.test')[0];

      setTimeout(() => {
        // The parent flex-direction not found;
        // A flex-direction should have been auto-injected to the parent...
        // fallback to 'row' and set child width styles accordingly
        expectEl(parent).toHaveStyle({'flex-direction': 'row'}, styler);
        expectEl(element).toHaveStyle({'min-width': '40px'}, styler);
        expectEl(element).not.toHaveStyle({'min-height': '40px'}, styler);
      });

    }));

    it('should work with styled-parent flex directions', () => {
      componentWithTemplate(`
        <div fxLayout='row'>
          <div style='flex-direction: column' class='parent'>
            <div fxFlex='60px'></div>
          </div>
        </div>
      `);
      fixture.detectChanges();
      let element = queryFor(fixture, '[fxFlex]')[0];
      let parent = queryFor(fixture, '.parent')[0];

      // parent flex-direction found with 'column'; set child with height styles
      expectEl(element).toHaveStyle({'min-height': '60px'}, styler);
      expectEl(parent).toHaveStyle({'flex-direction': 'column'}, styler);
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
      expectEl(nodes[1]).not.toHaveStyle({'max-height': '*', 'min-height': '*'}, styler);
      expectEl(nodes[1]).toHaveStyle({
        'flex': '1 1 auto',
        'box-sizing': 'border-box'
      }, styler);
    });

    // Note: firefox is disabled due to a current bug with Firefox 57
    it('should work with calc values', () => {
      // @see http://caniuse.com/#feat=calc for IE issues with calc()
      componentWithTemplate(`<div fxFlex='calc(30vw - 10px)'></div>`);
      if (!(platform.FIREFOX || platform.TRIDENT)) {
        expectNativeEl(fixture).toHaveStyle({
          'box-sizing': 'border-box',
          'flex': '1 1 calc(30vw - 10px)'
        }, styler);
      }
    });

    it('should work with calc without internal whitespaces', async(() => {
      // @see http://caniuse.com/#feat=calc for IE issues with calc()
      componentWithTemplate('<div fxFlex="calc(75%-10px)"></div>');
      if (!(platform.FIREFOX || platform.TRIDENT)) {
        fixture.detectChanges();
        setTimeout(() => {
          expectNativeEl(fixture).toHaveStyle({
            'box-sizing': 'border-box',
            'flex': '1 1 calc(75% - 10px)' // correct version has whitespace
          }, styler);
        });
      }
    }));

    it('should work with "auto" values', () => {
      componentWithTemplate(`<div fxFlex='auto'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 auto'
      }, styler);
    });
    it('should work with "nogrow" values', () => {
      componentWithTemplate(`<div fxFlex='nogrow'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '0 1 auto'
      }, styler);
    });
    it('should work with "grow" values', () => {
      componentWithTemplate(`<div fxFlex='grow'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 100%'
      }, styler);
    });
    it('should work with "initial" values', () => {
      componentWithTemplate(`<div fxFlex='initial'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '0 1 auto'
      }, styler);
    });
    it('should work with "noshrink" values', () => {
      componentWithTemplate(`<div fxFlex='noshrink'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 0 auto'
      }, styler);
    });
    it('should work with "none" values', () => {
      componentWithTemplate(`<div fxFlex='none'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '0 0 auto'
      }, styler);
    });

    it('should work with full-spec values', () => {
      componentWithTemplate(`<div fxFlex='1 2 0.9em'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 2 0.9em'
      }, styler);
    });
    it('should set a min-width when the shrink == 0', () => {
      componentWithTemplate(`<div fxFlex='1 0 37px'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 0 37px',
        'min-width': '37px',
        'box-sizing': 'border-box',
      }, styler);
    });
    it('should set a min-width and max-width when the grow == 0 and shrink == 0', () => {
      componentWithTemplate(`<div fxFlex='0 0 375px'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '0 0 375px',
        'max-width': '375px',
        'min-width': '375px',
        'box-sizing': 'border-box',
      }, styler);
    });


    it('should not set max-width to 69px when fxFlex="1 0 69px"', () => {
      componentWithTemplate(`<div fxFlex='1 0 69px'></div>`);
      expectNativeEl(fixture).not.toHaveStyle({
        'max-width': '69px',
      }, styler);
    });

    it('should not set a max-width when the shrink == 0', () => {
      componentWithTemplate(`<div fxFlex='1 0 303px'></div>`);
      fixture.detectChanges();
      let dom = fixture.debugElement.children[0];
      expectEl(dom).not.toHaveStyle({'max-width': '*'}, styler);
    });

    it('should not set min-width to 96px when fxFlex="0 1 96px"', () => {
      componentWithTemplate(`<div fxFlex='0 1 96px'></div>`);
      expectNativeEl(fixture).not.toHaveStyle({
        'min-width': '96px',
      }, styler);
    });

    it('should not set a min-width when the grow == 0', () => {
      componentWithTemplate(`<div fxFlex='0 1 313px'></div>`);
      fixture.detectChanges();
      let dom = fixture.debugElement.children[0];
      expectEl(dom).not.toHaveStyle({'min-width': '*'}, styler);
    });

    it('should set a min-width when basis is a Px value', () => {
      componentWithTemplate(`<div fxFlex='312px'></div>`);
      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 312px',
        'max-width': '312px',
        'min-width': '312px'
      }, styler);
    });

    describe('', () => {

      it('should ignore fxLayout settings on same element', () => {
        componentWithTemplate(`
          <div fxLayout='column' fxFlex='37%'>
          </div>
        `);
        expectNativeEl(fixture)
            .not.toHaveStyle({
          'flex-direction': 'row',
          'flex': '1 1 100%',
          'max-height': '37%',
        }, styler);
      });

      it('should set max-height for `fxFlex="<%val>"` with parent using fxLayout="column" ', () => {
        let template = `
          <div fxLayout='column'>
            <div fxFlex='37%'></div>
          </div>
        `;

        componentWithTemplate(template);
        fixture.detectChanges();
        expectEl(queryFor(fixture, '[fxFlex]')[0])
          .toHaveStyle({
            'flex': '1 1 100%',
            'max-height': '37%',
          }, styler);
      });

      it('should set max-width for `fxFlex="<%val>"`', () => {
        componentWithTemplate(`<div fxFlex='37%'></div>`);
        expectNativeEl(fixture).toHaveStyle({
          'flex': '1 1 100%',
          'max-width': '37%',
        }, styler);
      });

      it('should set max-width for `fxFlex="2%"` usage', () => {
        componentWithTemplate(`<div fxFlex='2%'></div>`);
        expectNativeEl(fixture).toHaveStyle({
          'flex': '1 1 100%',
          'max-width': '2%',
        }, styler);
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
      }, styler);

      matchMedia.activate('sm', true);
      fixture.detectChanges();

      expectNativeEl(fixture).toHaveStyle({
        'flex': '1 1 100%',
        'max-width': '33%'
      }, styler);
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
      expectEl(nodes[0]).toHaveStyle({'flex': '1 1 auto'}, styler);
      expectEl(nodes[1]).toHaveStyle({'flex': '1 1 auto'}, styler);
      expectEl(nodes[2]).toHaveStyle({'flex': '1 1 auto'}, styler);

      matchMedia.activate('xl');
      fixture.detectChanges();

      nodes = queryFor(fixture, '[fxFlex]');
      expectEl(nodes[0]).toHaveStyle({'flex': '1 1 100%', 'max-height': '50%'}, styler);
      expectEl(nodes[1]).toHaveStyle({'flex': '1 1 100%', 'max-height': '24.4%'}, styler);
      expectEl(nodes[2]).toHaveStyle({'flex': '1 1 100%', 'max-height': '25.6%'}, styler);

      matchMedia.activate('sm');
      fixture.detectChanges();

      nodes = queryFor(fixture, '[fxFlex]');
      expect(nodes.length).toEqual(3);
      expectEl(nodes[0]).toHaveStyle({'flex': '1 1 auto'}, styler);
      expectEl(nodes[1]).toHaveStyle({'flex': '1 1 auto'}, styler);
      expectEl(nodes[2]).toHaveStyle({'flex': '1 1 auto'}, styler);

      expectEl(nodes[0]).not.toHaveStyle({'max-height': '50%'}, styler);
      expectEl(nodes[1]).not.toHaveStyle({'max-height': '24.4%'}, styler);
      expectEl(nodes[2]).not.toHaveStyle({'max-height': '25.6%'}, styler);
      expectEl(nodes[0]).not.toHaveStyle({'max-height': '*'}, styler);
      expectEl(nodes[1]).not.toHaveStyle({'max-height': '*'}, styler);
      expectEl(nodes[2]).not.toHaveStyle({'max-height': '*'}, styler);
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
      expectEl(nodes[0]).toHaveStyle({'flex': '1 1 auto'}, styler);
      expectEl(nodes[1]).toHaveStyle({'flex': '1 1 auto'}, styler);
      expectEl(nodes[2]).toHaveStyle({'flex': '1 1 auto'}, styler);

      matchMedia.activate('sm');
      fixture.detectChanges();
      nodes = queryFor(fixture, '[fxFlex]');

      expectEl(nodes[0]).toHaveStyle({'flex': '1 1 auto'}, styler);
      expectEl(nodes[1]).toHaveStyle({'flex': '1 1 auto'}, styler);
      expectEl(nodes[2]).toHaveStyle({'flex': '1 1 auto'}, styler);

      matchMedia.activate('lg', true);
      fixture.detectChanges();
      nodes = queryFor(fixture, '[fxFlex]');

      expectEl(nodes[0]).toHaveStyle({'flex': '1 1 100%', 'max-height': '50%'}, styler);
      expectEl(nodes[1]).toHaveStyle({'flex': '1 1 100%', 'max-height': '24.4%'}, styler);
      expectEl(nodes[2]).toHaveStyle({'flex': '1 1 100%', 'max-height': '25.6%'}, styler);
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
      expectEl(nodes[0]).toHaveStyle({'flex': '1 1 auto'}, styler);

      matchMedia.activate('sm', true);
      fixture.detectChanges();
      nodes = queryFor(fixture, '[fxFlex]');

      expectEl(nodes[0]).toHaveStyle({
        'flex': '1 1 100%',
        'max-height': '50%'
      }, styler);

      matchMedia.activate('lg', true);
      fixture.detectChanges();
      nodes = queryFor(fixture, '[fxFlex]');

      expectEl(nodes[0]).toHaveStyle({'flex': '1 1 auto'}, styler);
    });
  });

  describe('with API directive queries', () => {
    it('should query the ViewChild `fxLayout` directive properly', inject([StyleUtils],
      (_styler: StyleUtils) => {
        fixture = TestBed.createComponent(TestQueryWithFlexComponent);
        fixture.detectChanges();

        const layout: LayoutDirective = fixture.debugElement.componentInstance.layout;

        expect(layout).toBeDefined();
        expect(layout.activatedValue).toBe('');
        expectNativeEl(fixture).toHaveStyle({
          'flex-direction': 'row'
        }, _styler);

        layout.activatedValue = 'column';
        expect(layout.activatedValue).toBe('column');
        expectNativeEl(fixture).toHaveStyle({
          'flex-direction': 'column'
        }, _styler);
      })
    );

    it('should query the ViewChild `fxFlex` directive properly', inject([StyleUtils],
      (_styler: StyleUtils) => {
        fixture = TestBed.createComponent(TestQueryWithFlexComponent);
        fixture.detectChanges();

        const flex: FlexDirective = fixture.debugElement.componentInstance.flex;

        // Test for percentage value assignments
        expect(flex).toBeDefined();
        expect(flex.activatedValue).toBe('50%');

        let nodes = queryFor(fixture, '[fxFlex]');
        expect(nodes.length).toEqual(1);
        expectEl(nodes[0]).toHaveStyle({'max-width': '50%'}, _styler);

        // Test for raw value assignments that are converted to percentages
        flex.activatedValue = '35';
        expect(flex.activatedValue).toBe('35');

        nodes = queryFor(fixture, '[fxFlex]');
        expect(nodes.length).toEqual(1);
        expectEl(nodes[0]).toHaveStyle({'max-width': '35%'}, _styler);

        // Test for pixel value assignments
        flex.activatedValue = '27.5px';
        expect(flex.activatedValue).toBe('27.5px');

        nodes = queryFor(fixture, '[fxFlex]');
        expect(nodes.length).toEqual(1);
        expectEl(nodes[0]).toHaveStyle({'max-width': '27.5px'}, _styler);
      })
    );

    it('should restore `fxFlex` value after breakpoint activations',
      inject([MatchMedia, StyleUtils],
        (_matchMedia: MockMatchMedia, _styler: StyleUtils) => {
          fixture = TestBed.createComponent(TestQueryWithFlexComponent);
          fixture.detectChanges();

          const flex: FlexDirective = fixture.debugElement.componentInstance.flex;

          // Test for raw value assignments that are converted to percentages
          expect(flex).toBeDefined();
          flex.activatedValue = '35';
          expect(flex.activatedValue).toBe('35');

          let nodes = queryFor(fixture, '[fxFlex]');
          expect(nodes.length).toEqual(1);
          expectEl(nodes[0]).toHaveStyle({'max-width': '35%'}, _styler);

          _matchMedia.activate('sm');
          fixture.detectChanges();

          // Test for breakpoint value changes
          expect(flex.activatedValue).toBe('71%');
          nodes = queryFor(fixture, '[fxFlex]');
          expectEl(nodes[0]).toHaveStyle({'max-width': '71%'}, _styler);

          _matchMedia.activate('lg');
          fixture.detectChanges();

          // Confirm activatedValue was restored properly when `sm` deactivated
          expect(flex.activatedValue).toBe('35');
          nodes = queryFor(fixture, '[fxFlex]');
          expectEl(nodes[0]).toHaveStyle({'max-width': '35%'}, _styler);
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
class TestFlexComponent {
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
class TestQueryWithFlexComponent {
  @ViewChild(FlexDirective) flex: FlexDirective;
  @ViewChild(LayoutDirective) layout: LayoutDirective;
}
