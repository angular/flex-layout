import {
  Directive, Injectable, OnDestroy, NgZone
} from "@angular/core";

import { isDefined } from '../../utils/global';
import { MediaQueries, MediaQueryChange } from "../../media-query/media-queries";
import { BreakPoints, BreakPoint } from "../../media-query/break-points";

import { Subscription } from "rxjs/Subscription";

const ON_MEDIA_CHANGES = 'ngOnMediaQueryChanges';
const ON_DESTROY = 'ngOnDestroy';

// ****************************************************************
// Exported Types and Interfaces
// ****************************************************************

export type MediaQuerySubscriber = (e:MediaQueryChanges) => { };


/**
 * @whatItDoes Lifecycle hook that is called when any mediaQuery breakpoint changes.
 * @howToUse
 *
 * @description
 * `ngOnMediaQueryChanges` is called right after the a MediaQueryChange has occurred.
 */
export declare abstract class OnMediaQueryChanges {
    abstract ngOnMediaQueryChanges(changes: MediaQueryChanges): void;
}

export declare type SubscriptionList = Array<Subscription>;

// ****************************************************************
// ****************************************************************


/**
 * MQ Notification data emitted to external observers
 *
 */
export class MediaQueryChanges {

  constructor(public previous : MediaQueryChange, public current : MediaQueryChange) { }

}


/**
 *  Adapter between Layout API directives and the MediaQueries mdl service
 *
 *  Using this adapter encapsulates most of the complexity of mql subscriptions
 *  and insures lean integration-code in the Layout directives
 *
 */
@Injectable()
export class MediaQueryAdapter {

  private _breakpoints : BreakPoints;
  private _$mq : MediaQueries;

  /**
   *
   */
  constructor(breakpoints : BreakPoints, zone: NgZone) {
    this._breakpoints = breakpoints;
    this._$mq = new MediaQueries( breakpoints, zone );
  }

  /**
   * Create a custom MQ Activation instance for each directive instance; the activation object
   * tracks the current mq-activated input and manages the calls to the directive's ngOnMediaQueryChanges
   */
  attach(directive : Directive,  property :string, defaultVal:string|number ) : MediaQueryActivation {
    let activation : MediaQueryActivation = new MediaQueryActivation(this._$mq, directive, property, defaultVal );
    let list : SubscriptionList = this._linkOnMediaChanges( directive, property );

    this._listenOnDestroy( directive, list );

    return activation;
  }

  /**
   *
   */
  private _linkOnMediaChanges(directive : Directive,  property :string) {
    let list : SubscriptionList,
        handler : MediaQuerySubscriber = directive[ ON_MEDIA_CHANGES ];

    if ( handler  ) {
      let keys = this._buildRegistryMap(directive, property);
      list = this._configureChangeObservers(directive, keys, handler );
    }
    return list;
  }


  /**
   *
   */
  private _listenOnDestroy ( directive : Directive, subscribers:SubscriptionList ) {
    let onDestroyFn = directive[ ON_DESTROY ];
    if ( onDestroyFn ){
      directive[ ON_DESTROY ] = function () {
        // Unsubscribe all for this directive
        subscribers.forEach( (s:Subscription) => {
          s.unsubscribe();
        });
        onDestroyFn();

        // release array and restore original fn
        subscribers.length = 0;
        directive[ ON_DESTROY ] = onDestroyFn
      };
    }
  }

  /**
   * For each API property, register a callback to ngOnMediaQueryChanges(e:MediaQueryEvent)
   * Cache 1..n subscriptions for internal auto-unsubscribes during the directive ngOnDestory() notification
   */
  private _configureChangeObservers(directive : Directive, keys : any, subscriber : MediaQuerySubscriber ) : SubscriptionList {
    let subscriptions = [ ];

    keys.forEach(it => {
      // Only subscribe if the directive API is defined (in use)
      if (isDefined( directive[it.key] )) {
          let lastEvent : MediaQueryChange,
              mergeWithLastEvent = (current:MediaQueryChange) : MediaQueryChanges => {
                let previous = lastEvent;
                if ( this._isDifferentChange(previous, current) ) lastEvent = current;

                return new MediaQueryChanges(previous, current);
              },
              // Create subscription for mq changes for each alias (e.g. gt-sm, md, etc)
              subscription = this._$mq.observe( it.alias )
                  .map( mergeWithLastEvent )
                  .subscribe( subscriber );

          subscriptions.push( subscription );
      }
    });

    return subscriptions;
  }

  /**
   * Build mediaQuery key-hashmap; only for the directive properties that are actually defined
   */
  private _buildRegistryMap(directive : Directive, key:string) {
    return this._breakpoints.registry
      .map(it => {
        return {
          alias : it.alias,           // e.g.  gt-sm, md, gt-lg
          key   : key + it.suffix     // e.g.  layoutGtSm, layoutMd, layoutGtLg
        }
      }).filter( it => isDefined(directive[ it.key ]) );
  }

  /**
   * Is the current activation event different from the last activation event ?
   *
   * !! change events may arrive out-of-order (activate before deactivate)
   *    so make sure the deactivate is used ONLY when the keys match
   *    (since a different activate may be in use)
   *
   */
  private _isDifferentChange(previous:MediaQueryChange, current:MediaQueryChange):boolean {
    let prevAlias = (previous ? previous.mqAlias : "");
    return current.matches || (!current.matches && current.mqAlias !== prevAlias);
  }
}



/**
 *
 */
export class MediaQueryActivation implements OnMediaQueryChanges, OnDestroy {

  private _onDestroy           : Function;
  private _onMediaQueryChanges : Function;
  private _activatedInputKey   : string;

  get activatedInputKey():string {
        let items:Array<BreakPoint> = this._$mq.activeOverlaps;
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
  constructor(private _$mq:MediaQueries, private _directive:Directive, private _baseKey:string, private _defaultValue:string|number ){
      this._interceptLifeCyclEvents();
  }

  /**
   * MediaQueryChanges interceptor that tracks the current mq-activated @Input and calculates the
   * mq-activated input value or the default value
   */
  ngOnMediaQueryChanges( changes:MediaQueryChanges ) {
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
    this._directive[ ON_DESTROY ] = this._onDestroy;
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
    this._onDestroy           = this._directive[ ON_DESTROY ].bind(this._directive);
    this._onMediaQueryChanges = this._directive[ ON_MEDIA_CHANGES ].bind(this._directive);

    this._directive[ ON_DESTROY ]       = this.ngOnDestroy.bind(this);
    this._directive[ ON_MEDIA_CHANGES ] = this.ngOnMediaQueryChanges.bind(this);
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


