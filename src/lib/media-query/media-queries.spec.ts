// RxJS Operators used by the classes...

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { TestBed, inject, async } from '@angular/core/testing';

import { BreakPoint, BreakPoints } from './break-points';
import {MockMediaQueryActivator} from "./testing/mock-media-query-activator";
import {MediaQueries, MediaQueryChange} from "./media-queries";

describe('media-queries', () => {
  let breakPoints : BreakPoints;
  let mockMQ : MockMediaQueryActivator;
  let mqService : MediaQueries;

  beforeEach(()=> {
    mockMQ = new MockMediaQueryActivator();

    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      providers: [BreakPoints, MediaQueries]
    });
  });
  beforeEach( async(inject([MediaQueries, BreakPoints], (_mqService_, _breakPoints_) => {
    // Single async inject to save references; which are used in all tests below
    mqService = _mqService_;
    breakPoints = _breakPoints_;
  })));
  afterEach(() => { mockMQ.destroy(); });

  it('can observe a media query change for each breakpoint', () => {
    let current : MediaQueryChange;
    mqService.observe().subscribe((change:MediaQueryChange) =>{
      current = change;
    });

    breakPoints.registry.forEach( (bp:BreakPoint) =>{
      mockMQ.activate(bp.mediaQuery);
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

    mockMQ.activate(bpGtSM.mediaQuery);
    expect( current ).not.toBeFalsy();
    expect( current.mediaQuery ).toEqual( bpGtSM.mediaQuery );
    expect( mqService.active.alias ).toEqual( 'gt-sm');

    mqcGtSM = current;

    mockMQ.activate(bpLg.mediaQuery);
    expect( current.mediaQuery ).not.toEqual( mqcGtSM.mediaQuery );
    expect( mqService.active.alias ).toEqual( 'lg');
  });

  it('can observe only a specific media query changes', () =>{
    let current : MediaQueryChange,
        bpGtSM = breakPoints.findByAlias('gt-sm'),
        bpLg = breakPoints.findByAlias('lg');

    mqService.observe('lg').subscribe((change:MediaQueryChange) =>{
      current = change;
    });

    mockMQ.activate(bpGtSM.mediaQuery);
    expect( current ).toBeFalsy();

    mockMQ.activate(bpLg.mediaQuery);
    expect( current ).toBeTruthy();
    expect( current.mqAlias ).toEqual( 'lg');
    expect( mqService.active.alias ).toEqual('lg');
  });

  it('can observe only activated changes for all mediaQueries', () =>{
    let activates = 0, deactivates = 0;
    let bpGtSM = breakPoints.findByAlias('gt-sm'),
        bpLg = breakPoints.findByAlias('lg');

    mqService.observe().subscribe((change:MediaQueryChange) =>{
      if ( change.matches ) ++activates;
      else                  ++deactivates;
    });

    expect( activates ).toEqual(1);   // from alias == '' == 'all'

    mockMQ.activate(bpGtSM.mediaQuery);
    expect( activates ).toEqual(2);
    expect( deactivates ).toEqual(0);

    mockMQ.activate(bpLg.mediaQuery);
    expect( activates ).toEqual(3);
    expect( deactivates ).toEqual(0);

    mockMQ.activate(bpGtSM.mediaQuery);
    expect( activates ).toEqual(4);
    expect( deactivates ).toEqual(0);

  });

  it('can observe both activated & deactivated changes for specific mediaQueries', () =>{
    let activates = 0, deactivates = 0;
    let bpGtSM = breakPoints.findByAlias('gt-sm'),
        bpLg = breakPoints.findByAlias('lg');

    mqService.observe('gt-sm').subscribe((change:MediaQueryChange) =>{
      if ( change.matches ) ++activates;
      else                  ++deactivates;
    });

    expect( activates ).toEqual(0);   // from alias == '' == 'all'

    mockMQ.activate(bpGtSM.mediaQuery);
    expect( activates ).toEqual(1);
    expect( deactivates ).toEqual(0);

    mockMQ.activate(bpLg.mediaQuery);
    expect( activates ).toEqual(1);
    expect( deactivates ).toEqual(1);

    mockMQ.activate(bpGtSM.mediaQuery);
    expect( activates ).toEqual(2);
    expect( deactivates ).toEqual(1);

  });

  it('can activate with either a mediaQuery or an alias', () =>{
      let activates = 0;
      let bpGtSM = breakPoints.findByAlias('gt-sm'),
          bpLg = breakPoints.findByAlias('lg');

      mqService.observe().subscribe((change:MediaQueryChange) =>{
        if ( change.matches ) ++activates;
      });

      expect( activates ).toEqual(1);   // from alias == '' == 'all'

      mockMQ.activate(bpGtSM.mediaQuery);
      expect( activates ).toEqual(2);

      mockMQ.activate(bpLg.mediaQuery);
      expect( activates ).toEqual(3);

      mockMQ.activate('gt-sm');
      expect( activates ).toEqual(4);

      mockMQ.activate('lg');
      expect( activates ).toEqual(5);
    });

  it('can check if a range is active', () =>{
     mqService.observe().subscribe(() =>{ });

     mockMQ.activate('gt-sm');
     expect( mqService.isActive('gt-sm') ).toBeTruthy();
     expect( mqService.isActive('lg') ).toBeFalsy();

     mockMQ.activate('lg');
     expect( mqService.isActive('gt-sm') ).toBeFalsy();
     expect( mqService.isActive('lg') ).toBeTruthy();

     mockMQ.activate('gt-sm');
     expect( mqService.isActive('xs') ).toBeFalsy();
     expect( mqService.isActive('gt-xs') ).toBeFalsy();
     expect( mqService.isActive('sm') ).toBeFalsy();
     expect( mqService.isActive('gt-sm') ).toBeTruthy();
     expect( mqService.isActive('md') ).toBeFalsy();
     expect( mqService.isActive('gt-md') ).toBeFalsy();
     expect( mqService.isActive('lg') ).toBeFalsy();

   });
});

