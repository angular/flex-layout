// RxJS Operators used by the classes...

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

import { TestBed, inject, async } from '@angular/core/testing';

import {MediaChange} from './media-change';
import {BreakPoint} from './breakpoints/break-point';
import {MockMatchMedia} from './mock/mock-match-media';
import {BreakPointRegistry} from './breakpoints/break-point-registry';
import {BreakPointsProvider} from './providers/break-points-provider';
import {MatchMedia,MatchMediaObservable} from './match-media';
import {MatchMediaObservableProvider} from './providers/match-media-observable-provider';

describe('match-media', () => {
  let matchMedia : MockMatchMedia;

  beforeEach(()=> {
    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      providers: [ {provide: MatchMedia, useClass:MockMatchMedia }]
    });
  });

  // Single async inject to save references; which are used in all tests below
  beforeEach( async(inject( [MatchMedia], (_matchMedia_) => {
      matchMedia = _matchMedia_;      // inject only to manually activate mediaQuery ranges
  })));
  afterEach(() => { matchMedia.clearAll(); });

  it('can observe the initial, default activation for mediaQuery == "all". ', () => {
    let current : MediaChange;
    let subscription = matchMedia
      .observe()
      .subscribe((change:MediaChange) =>{
        current = change;
      });
    expect( current.mediaQuery ).toEqual("all");

    subscription.unsubscribe();
  });

  it('can observe all mediaQuery activations', () => {
      let current : MediaChange;
      let query1 = "screen and (min-width: 610px) and (max-width: 620px)";
      let query2 = "(min-width: 730px) and (max-width: 950px)";

      matchMedia.registerQuery(query1);
      matchMedia.registerQuery(query2);

      let media$ = matchMedia.observe();
      let subscription = media$.subscribe((change:MediaChange) =>{
            current = change;
          });

      expect( current.mediaQuery ).toEqual("all");    // default mediaQuery is active

      let activated = matchMedia.activate(query1);    // simulate mediaQuery change to Query1
      expect( activated ).toEqual(true);
      expect( current.mediaQuery ).toEqual(query1);
      expect( matchMedia.isActive(query1) ).toBeTruthy();

      activated = matchMedia.activate(query2);        // simulate mediaQuery change to Query2

      expect( activated ).toEqual(true);
      expect( current.mediaQuery ).toEqual(query2);   // confirm no notification
      expect( matchMedia.isActive(query2) ).toBeTruthy();

      subscription.unsubscribe();
    });


  it('can observe only a specific custom mediaQuery ranges', () => {
    let current : MediaChange, activated;
    let query1 = "screen and (min-width: 610px) and (max-width: 620px)";
    let query2 = "(min-width: 730px) and (max-width: 950px)";

    matchMedia.registerQuery(query1);
    matchMedia.registerQuery(query2);

    let subscription = matchMedia.observe(query1).subscribe((change:MediaChange) =>{
      current = change;
    });
    expect( current ).toBeUndefined();   // no notification for the default, active mediaQuery

    activated = matchMedia.activate(query1);   // simulate mediaQuery change

    expect( activated ).toEqual(true);
    expect( current.mediaQuery ).toEqual(query1);
    expect( matchMedia.isActive(query1) ).toBeTruthy();

    activated = matchMedia.activate(query2);   // simulate mediaQuery change

    expect( activated ).toEqual(true);
    expect( matchMedia.isActive(query2) ).toBeTruthy();

    expect( current.mediaQuery ).not.toEqual(query2);   // confirm no notification
    expect( current.mediaQuery ).toEqual(query1);

    subscription.unsubscribe();
  });

});


describe('match-media-observable', () => {
  let breakPoints : BreakPointRegistry;
  let matchMedia : MockMatchMedia;
  let media$ : Observable<MediaChange>;

  beforeEach(()=> {
    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      providers: [
        BreakPointsProvider,  // Supports developer overrides of list of known breakpoints
        BreakPointRegistry,   // Registry of known/used BreakPoint(s)
        {provide: MatchMedia, useClass:MockMatchMedia },
        MatchMediaObservableProvider  // Allows easy subscription to the injectable `media$` matchMedia observable
      ]
    });
  });

  // Single async inject to save references; which are used in all tests below
  beforeEach( async(inject(
    [MatchMediaObservable, MatchMedia, BreakPointRegistry],
    (_media$_, _matchMedia_, _breakPoints_) => {
      matchMedia = _matchMedia_;      // inject only to manually activate mediaQuery ranges
      breakPoints = _breakPoints_;
      media$ = _media$_;

      // Quick register all breakpoint mediaQueries
      breakPoints.items.forEach( (bp:BreakPoint) =>{
        matchMedia.observe(bp.mediaQuery);
      });
  })));
  afterEach(() => { matchMedia.clearAll(); });

  it('can observe an existing activation', () => {
    let current : MediaChange;
    let bp = breakPoints.findByAlias('md');
    matchMedia.activate(bp.mediaQuery);
    let subscription = media$.subscribe((change:MediaChange) =>{
      current = change;
    });

    expect( current.mediaQuery ).toEqual(bp.mediaQuery);

    subscription.unsubscribe();
  });

  it('can observe the initial, default activation for mediaQuery == "all". ', () => {
    let current : MediaChange;
    let subscription = media$.subscribe((change:MediaChange) =>{
      current = change;
    });
    expect( current.mediaQuery ).toEqual("all");

    subscription.unsubscribe();
  });

  it('can observe custom mediaQuery ranges', () => {
    let current : MediaChange;
    let customQuery = "screen and (min-width: 610px) and (max-width: 620px";
    let subscription = media$.subscribe((change:MediaChange) =>{
      current = change;
    });

    let activated = matchMedia.activate(customQuery);
    expect( activated ).toEqual(true);
    expect( current.mediaQuery ).toEqual(customQuery);

    subscription.unsubscribe();
  });

  it('can observe registered breakpoint activations', () => {
    let current : MediaChange;
    let bp = breakPoints.findByAlias('md');
    let subscription = media$.subscribe((change:MediaChange) =>{
      current = change;
    });

    let activated = matchMedia.activate(bp.mediaQuery);
    expect( activated ).toEqual(true);
    expect( current.mediaQuery ).toEqual(bp.mediaQuery);

    subscription.unsubscribe();
  });

  it('ignores mediaQuery de-activations', () => {
    let current : MediaChange;
    let activationCount = 0, deactivationCount = 0;

    matchMedia.activate(breakPoints.findByAlias('md').mediaQuery);
    let subscription = media$.subscribe((change:MediaChange) =>{
      if ( change.matches ) ++activationCount;
      else ++deactivationCount;
    });

    matchMedia.activate(breakPoints.findByAlias('md').mediaQuery);
    expect( activationCount ).toEqual(2);
    expect( deactivationCount ).toEqual(0);

    subscription.unsubscribe();
  });

});
