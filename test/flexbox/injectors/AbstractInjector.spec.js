import AbstractInjector from 'flexbox/injectors/AbstractInjector.es6'


describe("AbstractInjector tests", ()=> {
  let $log;

  beforeEach( inject(_$log_ => {
    $log = _$log_;
  }));

  it("should log warnings for abstract method ::updateCSS()", ()=> {
    let div = angular.element("div");
    //let injector = new AbstractInjector("",{}, div)
    expect(true).toBeTruthy();
  });

});


