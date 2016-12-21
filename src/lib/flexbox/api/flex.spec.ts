import {Component, OnInit, DebugElement} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed, async } from '@angular/core/testing';

import {MockMatchMedia} from '../../media-query/mock/mock-match-media';
import {MatchMedia} from '../../media-query/match-media';
import {BreakPointsProvider} from '../../media-query/providers/break-points-provider';
import {BreakPointRegistry} from '../../media-query/breakpoints/break-point-registry';
import {FlexLayoutModule} from '../_module';

import {customMatchers, expect} from '../../utils/testing/custom-matchers';
import {makeCreateTestComponent, makeExpectDOMFrom, makeExpectDOMForQuery} from '../../utils/testing/helpers';

describe('flex directive', () => {
  let fixture: ComponentFixture<any>;
  let createTestComponent = makeCreateTestComponent(()=> TestLayoutComponent);
  let expectDOMFrom = makeExpectDOMFrom(()=> TestLayoutComponent);
  let expectDomForQuery = makeExpectDOMForQuery(()=> TestLayoutComponent);

  beforeEach(async(() => {
    jasmine.addMatchers(customMatchers);

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      imports: [CommonModule, FlexLayoutModule.forRoot()],
      declarations: [TestLayoutComponent],
      providers: [
        BreakPointRegistry, BreakPointsProvider,
        {provide: MatchMedia, useClass: MockMatchMedia}
      ]
    })
  }));
  afterEach(() => {
    fixture = null;
  });

  describe('with static features', () => {

    it('should add correct styles for default `fxFlex` usage', () => {
      expectDOMFrom(`<div fxFlex></div>`).toHaveCssStyle({
        'flex' : '1 1 0%',  // === flex : "1"
        'box-sizing': 'border-box',
      });
    });
    it('should add correct styles for `fxFlex="0%"` usage', () => {
      expectDOMFrom(`<div fxFlex="2%"></div>`).toHaveCssStyle({
        'max-width' : '2%',
        'flex'      : '1 1 100%',
        'box-sizing': 'border-box',
      });
    });

    it('should work with percentage values', () => {
      expectDOMFrom(`<div fxFlex="37%"></div>`).toHaveCssStyle({
        'flex' : '1 1 100%',
        'max-width' : '37%',
        'box-sizing': 'border-box',
      });
    });
    it('should work with pixel values', () => {
      expectDOMFrom(`<div fxFlex="37px"></div>`).toHaveCssStyle({
        'flex' : '1 1 37px',
        'box-sizing': 'border-box',
      });
    });
    it('should work with calc values', () => {
      expectDOMFrom(`<div fxFlex="calc(30vw - 10px)"></div>`).toHaveCssStyle({
        'box-sizing': 'border-box',
        'flex' : '1 1 calc(30vw - 10px)'
      });
    });
    it('should work with named values', () => {
      expectDOMFrom(`<div fxFlex="nogrow"></div>`).toHaveCssStyle({
        'flex' : '0 1 auto'
      });
    });

    it('should work with full-spec values', () => {
      expectDOMFrom(`<div fxFlex="1 2 0.9em"></div>`).toHaveCssStyle({
        'flex' : '1 2 0.9em'
      });
    });

    describe('', () => {

      it('should ignore fxLayout settings on same element', () => {
        expectDOMFrom(`
          <div fxLayout="column" fxFlex="37%">
          </div>
        `)
        .not.toHaveCssStyle({
          'max-height' : '37%',
        });
      });

      it('should set max-height for `fxFlex="<%val>"` with parent using fxLayout="column" ', () => {
        let template = `
          <div fxLayout="column">
            <div fxFlex="37%"></div>
          </div>
        `;

        expectDomForQuery( template,"[fxFlex]" )
          .toHaveCssStyle({
            'max-height' : '37%',
          });
      });

      it('should set max-width for `fxFlex="<%val>"`', () => {
        expectDOMFrom(`<div fxFlex="37%"></div>`).toHaveCssStyle({
          'max-width' : '37%',
        });
      });

      it('should set max-width for `fxFlex="2%"` usage', () => {
        expectDOMFrom(`<div fxFlex="2%"></div>`).toHaveCssStyle({
          'max-width' : '2%',
        });
      });

    });
  });


});


// *****************************************************************
// Template Component
// *****************************************************************

@Component({
  selector: 'test-layout',
  template: `<span>PlaceHolder Template HTML</span>`
})
export class TestLayoutComponent implements OnInit {
  public direction = "column";
  constructor() {  }
  ngOnInit() { }
}



