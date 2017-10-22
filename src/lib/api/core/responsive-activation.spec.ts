/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// RxJS Operators used by the classes...

import {TestBed, inject} from '@angular/core/testing';

import {DEFAULT_BREAKPOINTS_PROVIDER} from '../../media-query/breakpoints/break-points-provider';
import {BreakPointRegistry} from '../../media-query/breakpoints/break-point-registry';

import {MockMatchMedia} from '../../media-query/mock/mock-match-media';
import {MatchMedia} from '../../media-query/match-media';
import {MediaMonitor} from '../../media-query/media-monitor';
import {ResponsiveActivation, KeyOptions} from './responsive-activation';
import {MediaQuerySubscriber, MediaChange} from '../../media-query/media-change';

describe('responsive-activation', () => {
  let monitor: MediaMonitor;
  let matchMedia: MockMatchMedia;
  let breakPoints: BreakPointRegistry;

  /**
   * MediaQuery Change responder used to determine the activated input
   * value that should be used for the currently activate mediaQuery
   */
  function buildResponder(baseKey: string, defaultVal: any,
                          onMediaChanges: MediaQuerySubscriber, inputs?: {[key: string]: any}) {
    if (!inputs) { inputs = {}; }
    inputs[baseKey] = defaultVal;

    let options = new KeyOptions(baseKey, defaultVal, inputs);
    return new ResponsiveActivation(options, monitor, onMediaChanges);
  }


  beforeEach(() => {
    // Configure testbed to prepare services
    TestBed.configureTestingModule({
      providers: [
        MediaMonitor,
        BreakPointRegistry,           // Registry of known/used BreakPoint(s)
        DEFAULT_BREAKPOINTS_PROVIDER, // Supports developer overrides of list of known breakpoints
        {provide: MatchMedia, useClass: MockMatchMedia}
      ]
    });
  });

  // Single async inject to save references; which are used in all tests below
  beforeEach(inject(
      [BreakPointRegistry, MatchMedia, MediaMonitor],
      (_breakPoints, _matchMedia, _mediaMonitor) => {
        breakPoints = _breakPoints;    // Only used to look up mediaQuery by aliases
        matchMedia = _matchMedia;      // Only used to manual/simulate activate a mediaQuery
        monitor = _mediaMonitor;
      }
  ));

  it('does not report mediaQuery changes for static usages', () => {
    let value;
    let onMediaChange = (changes: MediaChange) => value = changes.value;
    let responder = buildResponder('layout', 'row', onMediaChange);
    try {
      // Confirm static values are returned as expected

      expect(value).toBeUndefined();
      expect(responder.activatedInputKey).toEqual('layout');
      expect(responder.activatedInput).toEqual('row');

      // No responsive inputs were defined, so any mediaQuery
      // activations should not affect anything and the change handler
      // should NOT have been called.

      matchMedia.activate('xs');

      expect(value).toBeUndefined();
      expect(responder.activatedInputKey).toEqual('layout');
      expect(responder.activatedInput).toEqual('row');

      matchMedia.activate('gt-md');

      expect(value).toBeUndefined();
      expect(responder.activatedInputKey).toEqual('layout');
      expect(responder.activatedInput).toEqual('row');

    } finally {
      responder.destroy();
    }
  });

  it('reports mediaQuery changes for responsive usages', () => {
    let value;
    let onMediaChange = (changes: MediaChange) => value = changes.value;
    let responder = buildResponder('layout', 'row', onMediaChange, {
          'layout': 'row',
          'layoutXs': 'column',          // define trigger to 'xs' mediaQuery
          'layoutMd': 'column-reverse',  // define trigger to 'md' mediaQuery
          'layoutGtLg': 'row-reverse'    // define trigger to 'md' mediaQuery
        }
    );

    try {
      expect(value).toBeUndefined();

      matchMedia.activate('xs');
      expect(value).toEqual('column');

      matchMedia.activate('md');
      expect(value).toEqual('column-reverse');

      matchMedia.activate('gt-lg');
      expect(value).toEqual('row-reverse');

    } finally {
      responder.destroy();
    }
  });

  it('uses fallback to default input if the activated mediaQuery should be ignored', () => {
    let value;
    let onMediaChange = (changes: MediaChange) => value = changes.value;
    let responder = buildResponder('layout', 'row', onMediaChange, {
          'layout': 'row',
          'layoutXs': 'column',          // define input value link to 'xs' mediaQuery
        }
    );

    try {
      expect(value).toBeUndefined();

      matchMedia.activate('xs');
      expect(value).toEqual('column');

      // No input 'layoutMd' has been defined, so the fallback
      // to 'layout' input value should be used...

      matchMedia.activate('md');
      expect(value).toEqual('row');

    } finally {
      responder.destroy();
    }
  });

  it('uses closest responsive input value if the activated mediaQuery is not linked', () => {
    let value, enableOverlaps = false;
    let onMediaChange = (changes: MediaChange) => value = changes.value;
    let responder = buildResponder('layout', 'row', onMediaChange, {
          'layout': 'row',
          'layoutXs': 'column',          // define link to 'xs' mediaQuery
          'layoutGtSm': 'row-reverse'      // define link to 'gt-sm' mediaQuery
        }
    );

    try {
      expect(value).toBeUndefined();

      matchMedia.activate('xs');
      expect(value).toEqual('column');

      // No input 'layoutMd' has been defined, so the fallback
      // to 'layoutGtSm' input value should be used...

      matchMedia.activate('md', enableOverlaps = true);
      expect(value).toEqual('row-reverse');

    } finally {
      responder.destroy();
    }
  });

});
