import {
  Directive, OnDestroy
} from "@angular/core";

import { OnMediaQueryChanges, MediaQueryChanges } from "./media-query-changes";
import { BreakPoint }                             from "../../media-query/break-points";
import { MediaQueries }                           from "../../media-query/media-queries";

import { isDefined }                              from '../../utils/global';

const ON_DESTROY = 'ngOnDestroy';
const ON_MEDIA_CHANGES = 'onMediaQueryChanges';
/**
 *
 */
export class MediaQueryActivation implements OnMediaQueryChanges, OnDestroy {

  private _onDestroy           : Function;
  private _onMediaQueryChanges : Function;
  private _activatedInputKey   : string;

  get activatedInputKey():string {
        let items:Array<BreakPoint> = this._mq.activeOverlaps;
        items.forEach( bp => {
          if ( !isDefined(this._activatedInputKey) ) {
            let key = this._baseKey + bp.suffix;
            if ( isDefined(this._directive[ key ]) ) {
              this._activatedInputKey = key;
            }
          }
        });
    return this._activatedInputKey || this._baseKey;
  }

  /**
   * Get the currently activated @Input value or the fallback default @Input value
   */
  get activatedInput():any {
    return this._directive[ this.activatedInputKey ] || this._defaultValue;
  }

  /**
   *
   */
  constructor(private _mq:MediaQueries, private _directive:Directive, private _baseKey:string, private _defaultValue:string|number ){
      this._interceptLifeCyclEvents();
  }

  /**
   * MediaQueryChanges interceptor that tracks the current mq-activated @Input and calculates the
   * mq-activated input value or the default value
   */
  onMediaQueryChanges( changes:MediaQueryChanges ) {
    let currentKey = (this._baseKey + changes.current.suffix);

    // !! change events may arrive out-of-order (activate before deactivate)
    //    so make sure the deactivate is used ONLY when the keys match
    //    (since a different activate may be in use)
    this._activatedInputKey = changes.current.matches  ? currentKey :
                              (this._activatedInputKey !== currentKey ) ? this._activatedInputKey : undefined;

    let current = changes.current;
        current.value = this.activatedInput;    // calculated value

    changes = new MediaQueryChanges( changes.previous, current );

    this._logMediaQueryChanges( changes );
    this._onMediaQueryChanges( changes );

  }

  /**
   * Remove interceptors, restore original functions, and forward the onDestroy() call
   */
  ngOnDestroy() {
    this._directive[ ON_DESTROY ] = this._onDestroy || this._directive[ ON_DESTROY ];
    this._directive[ ON_MEDIA_CHANGES ] = this._onMediaQueryChanges;
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
    if (this._directive[ ON_DESTROY ]) {
      this._onDestroy               = this._directive[ ON_DESTROY ].bind(this._directive);
      this._directive[ ON_DESTROY ] = this.ngOnDestroy.bind(this);
    }

    this._onMediaQueryChanges = this._directive[ ON_MEDIA_CHANGES ].bind(this._directive);
    this._directive[ ON_MEDIA_CHANGES ] = this.onMediaQueryChanges.bind(this);
  }

  /**
   * Internal Logging mechanism
   */
  private _logMediaQueryChanges( changes:MediaQueryChanges ) {
    let current = changes.current, previous = changes.previous;

    if ( current && current.mqAlias == "" )  current.mqAlias = "all";
    if ( previous && previous.mqAlias == "" ) previous.mqAlias = "all";

    if ( current.matches ) {
      console.log( `mqChange: ${this._baseKey}.${current.mqAlias} = ${changes.current.value};` );
    }
  }
}
