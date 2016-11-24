// RxJS Operators used by the classes...

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { BreakPoint, BreakPoints } from './break-points';
import {MockMediaQueryActivator} from "./testing/mock-media-query-activator";
import {MediaQueries, MediaQueryChange} from "./media-queries";

describe('media-queries', () => {
  let breakPoints : BreakPoints;
  let mqActivator : MockMediaQueryActivator;
  let mqService : MediaQueries;

  beforeEach(()=> {
    debugger;
    breakPoints = new BreakPoints();
    mqActivator = new MockMediaQueryActivator().init(breakPoints);

    mqService = new MediaQueries(breakPoints);
  });
  afterEach(() => { mqActivator.destroy(); });


  it('can observe ALL media query changes', () =>{
    let current : MediaQueryChange;
    mqService.observe().subscribe((change:MediaQueryChange) =>{
      current = change;
    });

    breakPoints.registry.forEach( (bp:BreakPoint) =>{
      mqActivator.activate(bp.mediaQuery);
      expect( current ).not.toBeFalsy();
      expect( current.mediaQuery ).toEqual( bp.mediaQuery );
    });
  });

  it('can observe ALL media query changes', () =>{
    let current : MediaQueryChange,
        mqcGtSM : MediaQueryChange,
        bpGtSM = breakPoints.findByAlias('gt-sm'),
        bpLg = breakPoints.findByAlias('lg');

    mqService.observe().subscribe((change:MediaQueryChange) =>{
      current = change;
    });

    mqActivator.activate(bpGtSM.mediaQuery);
    expect( current ).not.toBeFalsy();
    expect( current.mediaQuery ).toEqual( bpGtSM.mediaQuery );
    expect( mqService.active.alias ).toEqual( 'gt-sm');

    mqcGtSM = current;

    mqActivator.activate(bpLg.mediaQuery);
    expect( current.mediaQuery ).not.toEqual( mqcGtSM.mediaQuery )
    expect( mqService.active.alias ).toEqual( 'lg');
  });

  it('can observe only a specific media query changes', () =>{
    let current : MediaQueryChange,
        bpGtSM = breakPoints.findByAlias('gt-sm'),
        bpLg = breakPoints.findByAlias('lg');

    mqService.observe('lg').subscribe((change:MediaQueryChange) =>{
      current = change;
    });

    mqActivator.activate(bpGtSM.mediaQuery);
    expect( current ).toBeFalsy();

    mqActivator.activate(bpLg.mediaQuery);
    expect( current ).toBeTruthy();
    expect( current.mqAlias ).toEqual( 'lg');
    expect( mqService.active.alias ).toEqual('lg');
  });


});

