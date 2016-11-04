import { Directive, Injectable, NgZone } from "@angular/core";

import { Subscription } from "rxjs/Subscription";

import { MediaQueryActivation }                   from "./media-query-activation";
import { MediaQuerySubscriber, MediaQueryChanges} from "./media-query-changes";
import { BreakPoints }                            from "../../media-query/break-points";
import { MediaQueries, MediaQueryChange }         from "../../media-query/media-queries";

import { isDefined } from '../../utils/global';

export declare type SubscriptionList = Array<Subscription>;

const ON_DESTROY = 'ngOnDestroy';
const ON_MEDIA_CHANGES = 'onMediaQueryChanges';

/**
 *  Adapter between Layout API directives and the MediaQueries mdl service
 *
 *  Using this adapter encapsulates most of the complexity of mql subscriptions
 *  and insures lean integration-code in the Layout directives
 *
 */
@Injectable()
export class MediaQueryAdapter {
  private _mq : MediaQueries;

  /**
   *
   */
  constructor(private _breakpoints : BreakPoints, zone: NgZone) {
    this._mq = new MediaQueries( _breakpoints, zone );
  }

  /**
   * Create a custom MQ Activation instance for each directive instance; the activation object
   * tracks the current mq-activated input and manages the calls to the directive's `onMediaQueryChanges( )`
   */
  attach(directive : Directive,  property :string, defaultVal:string|number ) : MediaQueryActivation {
    let activation : MediaQueryActivation = new MediaQueryActivation(this._mq, directive, property, defaultVal );
    let list : SubscriptionList = this._linkOnMediaChanges( directive, property );

    this._listenOnDestroy( directive, list );

    return activation;
  }

  /**
   *
   */
  private _linkOnMediaChanges(directive : Directive,  property :string) {
    let list : SubscriptionList = [ ],
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
   * For each API property, register a callback to `onMediaQueryChanges( )`(e:MediaQueryEvent)
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
              subscription = this._mq.observe( it.alias )
                  .map( mergeWithLastEvent )
                  .subscribe( subscriber );

          subscriptions.push( subscription );
      }
    });

    return subscriptions;
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








