import MockAttrs from 'test/utils/MockAttrs.es6'
import LayoutWrap from 'flexbox/injectors/LayoutWrap.es6'


describe("LayoutWrap uncompiled, raw injector tests", ()=> {
  const FLEX_WRAP = "flex-wrap";

  let $log, $rootScope, injector;
  beforeEach( inject((_$log_, _$rootScope_) => {
    $log = _$log_;
    $rootScope = _$rootScope_;
  }));
  afterEach(()=>{
    if ( injector ) {
      injector.deactivate();
      injector = null;
    }
  });

  it("should not modify the CSS until activated", ()=> {
    let template = '<div layout-wrap="invalid"></div>';
    let [ element, ] = buildInjector(template, {'layout-wrap': 'invalid'});

    expect(element.css(FLEX_WRAP)).toBe('invalid');
    injector.activate();
    expect(element.css(FLEX_WRAP)).toBe('wrap');
  });

  it("should restore the CSS after deactivation", ()=> {
    let template = '<div layout-wrap="invalid"></div>';
    let [ element, ] = buildInjector(template, {'layout-wrap': 'invalid'});

    injector.activate();
    expect(element.css(FLEX_WRAP)).toBe('wrap');
    injector.deactivate();

    expect(element.css(FLEX_WRAP)).toBe('invalid');
  });

  describe("with defaults and fallbacks", ()=>{

    it("should use default CSS layout-align='' ", ()=> {
      let template = '<div layout-wrap=""></div>';
      let [ element, ] = buildInjector(template, {'layout-wrap': ''});

      injector.activate();
      expect(element.css(FLEX_WRAP)).toBe('wrap');
    });

    it("should use fallback layout-align='wrap' ", ()=> {
      let template = '<div layout-wrap="wrap"></div>';
      let [ element, ] = buildInjector(template, {'layout-wrap': 'wrap'});

      injector.activate();
      expect(element.css(FLEX_WRAP)).toBe('wrap');
    });

  });

  describe("with nowrap options", function () {

    it("should accept layout-align='nowrap' option ", ()=> {
      let template = '<div layout-wrap="nowrap"></div>';
      let [ element, ] = buildInjector(template, {'layout-wrap': 'nowrap'});

      injector.activate();
      expect(element.css(FLEX_WRAP)).toBe('nowrap');
    });

    it("should accept layout-align='none' option ", ()=> {
      let template = '<div layout-wrap="none"></div>';
      let [ element, ] = buildInjector(template, {'layout-wrap': 'none'});

      injector.activate();
      expect(element.css(FLEX_WRAP)).toBe('nowrap');
    });

    it("should accept layout-align='no' option ", ()=> {
      let template = '<div layout-wrap="no"></div>';
      let [ element, ] = buildInjector(template, {'layout-wrap': 'no'});

      injector.activate();
      expect(element.css(FLEX_WRAP)).toBe('nowrap');
    });

  });


  describe("with 'reverse' options", function () {

    it("should accept layout-align='reverse' option ", ()=> {
      let template = '<div layout-wrap="reverse"></div>';
      let [ element, ] = buildInjector(template, {'layout-wrap': 'reverseno'});

      injector.activate();
      expect(element.css(FLEX_WRAP)).toBe('wrap-reverse');
    });

  });


  // ************************************
  // Internal utility functions
  // ************************************

  function buildInjector(template, attrs) {
    let utils  = { '$log' : $log };
    let attrs  = new MockAttrs(attrs || { });
    let element = angular.element(template);

    return [ element,
      injector = new LayoutWrap("layout-wrap", $rootScope.$new(), element, attrs, utils)
    ];
  }
});



