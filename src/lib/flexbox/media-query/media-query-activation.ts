import {Directive, OnDestroy} from '@angular/core';

import {BreakPoint} from '../../media-query/break-points';
import {MediaQueries, MediaQueryChange} from '../../media-query/media-queries';

import {MediaQueryChanges, OnMediaQueryChanges} from './media-query-changes';

const ON_DESTROY = 'ngOnDestroy';
const ON_MEDIA_CHANGES = 'onMediaQueryChanges';

/**
 * MediaQueryActivation acts as a proxy between the MediaQuery service (which emits mediaQuery changes)
 * and the fx API directives. The MQA proxies (head-hooks) both the `onMediaQueryChanges()` and
 * `ngOnDestroy()` methods of the directive instance.
 *
 * - The MQA also determines which directive property should be used to determine the
 *   current change 'value'... BEFORE the original `onMediaQueryChanges()` method is called.
 * - The `ngOnDestroy()` method is also head-hooked to enable auto-unsubscribe from the MediaQueryServices.
 *
 * NOTE: these interceptions enables the logic in the fx API directives to remain terse and clean.
 */
export class MediaQueryActivation implements OnMediaQueryChanges, OnDestroy {
  private _onDestroy: Function;
  private _onMediaQueryChanges: Function;
  private _activatedInputKey: string;

  /**
   * Determine which directive @Input() property is currently active (for the viewport size):
   * The key must be defined (in use) or fallback to the 'closest' overlapping property key
   * that is defined; otherwise the default property key will be used.
   * e.g.
   *      if `<div fx-hide fx-hide.gt-sm="false">` is used but the current activated mediaQuery alias
   *      key is `.md` then `.gt-sm` should be used instead
   */
  get activatedInputKey(): string {
    return this._activatedInputKey || this._baseKey;
  }

  /**
   * Get the currently activated @Input value or the fallback default @Input value
   */
  get activatedInput(): any {
    return this._directive[this.activatedInputKey] || this._defaultValue;
  }

  /**
   *
   */
  constructor(
      private _mq: MediaQueries,
      private _directive: Directive,
      private _baseKey: string,
      private _defaultValue: string|number|boolean)
  {
    this._interceptLifeCyclEvents();
  }


  /**
   * MediaQueryChanges interceptor that tracks the current mq-activated @Input and calculates the
   * mq-activated input value or the default value
   */
  onMediaQueryChanges(changes: MediaQueryChanges) {
    if ( changes.current.property == this._baseKey ) {
      changes = new MediaQueryChanges(null, changes.current);
      changes.current.value = this._calculateActivatedValue(changes.current);

      this._logMediaQueryChanges(changes);
      this._onMediaQueryChanges(changes);
    }
  }

  /**
   * Remove interceptors, restore original functions, and forward the onDestroy() call
   */
  ngOnDestroy() {
    this._directive[ON_DESTROY] = this._onDestroy || this._directive[ON_DESTROY];
    this._directive[ON_MEDIA_CHANGES] = this._onMediaQueryChanges;
    try {
      this._onDestroy();

    } finally {
      this._directive = undefined;
      this._onDestroy = undefined;
      this._onMediaQueryChanges = undefined;
    }
  }

  /**
   * Head-hook onDestroy and onMediaQueryChanges methods on the directive instance
   */
  private _interceptLifeCyclEvents() {
    if (this._directive[ON_DESTROY]) {
      this._onDestroy = this._directive[ON_DESTROY].bind(this._directive);
      this._directive[ON_DESTROY] = this.ngOnDestroy.bind(this);
    }

    this._onMediaQueryChanges = this._directive[ON_MEDIA_CHANGES].bind(this._directive);
    this._directive[ON_MEDIA_CHANGES] = this.onMediaQueryChanges.bind(this);
  }

  /**
   */
  private _logMediaQueryChanges(changes: MediaQueryChanges) {
    let current = changes.current, previous = changes.previous;

    if (current && current.mqAlias == '')
      current.mqAlias = 'all';
    if (previous && previous.mqAlias == '')
      previous.mqAlias = 'all';

    if (current.matches) {
      console.log(`mqChange: ${this._baseKey}.${current.mqAlias} = ${changes.current.value};`);
    }
  }

  /**
   *  Map input key associated with mediaQuery activation to closest defined input key
   *  then return the values associated with the targeted input property
   *
   *  !! change events may arrive out-of-order (activate before deactivate)
   *     so make sure the deactivate is used ONLY when the keys match
   *     (since a different activate may be in use)
   */
  private _calculateActivatedValue(current:MediaQueryChange): any  {
    const currentKey = this._baseKey + current.suffix;    // e.g. suffix == 'GtSm', _baseKey == 'hide'
    let   newKey = this._activatedInputKey;                     // e.g. newKey == hideGtSm

          newKey = current.matches ? currentKey : ((newKey == currentKey) ? null : newKey);

    this._activatedInputKey = this._validateInputKey(newKey);
    return this.activatedInput;
  }

  /**
   * For the specified input property key, validate it is defined (used in the markup)
   * If not see if a overlapping mediaQuery-related input key fallback has been defined
   *
   * NOTE: scans in the order defined by activeOverLaps (largest viewport ranges -> smallest ranges)
   */
  private _validateInputKey(inputKey) {
    let items: BreakPoint[] = this._mq.activeOverlaps;
    let isMissingKey = (key) => this._directive[key] === undefined;

    if ( isMissingKey( inputKey ) ) {
      items.some(bp => {
        let key = this._baseKey + bp.suffix;
        if ( !isMissingKey(key) ) {
          inputKey = key;
          return true;
        }
      });
    }
    return inputKey;
  }

}
