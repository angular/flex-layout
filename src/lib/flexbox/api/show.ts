import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  Renderer,
  SimpleChanges,
  Self,
  Optional,
  Inject,
  forwardRef
} from '@angular/core';

import {Subscription} from 'rxjs/Subscription';

import {BaseFxDirective} from './base';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';

import {HideDirective} from "./hide";
import {LayoutDirective} from './layout';



const FALSY = ['false', false, 0];

/**
 * 'show' Layout API directive
 *
 */
@Directive({selector: `
  [fx-show],
  [fx-show.xs]
  [fx-show.gt-xs],
  [fx-show.sm],
  [fx-show.gt-sm]
  [fx-show.md],
  [fx-show.gt-md]
  [fx-show.lg],
  [fx-show.gt-lg],
  [fx-show.xl]
`})
export class ShowDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
  /**
   * Original dom Elements CSS display style
   */
  private _display = 'flex';

  /**
    * Subscription to the parent flex container's layout changes.
    * Stored so we can unsubscribe when this directive is destroyed.
    */
  private _layoutWatcher : Subscription;

  @Input('fx-show')       set show(val)     { this._cacheInput("show", val); }
  @Input('fx-show.xs')    set showXs(val)   { this._cacheInput('showXs', val); }
  @Input('fx-show.gt-xs') set showGtXs(val) { this._cacheInput('showGtXs', val); };
  @Input('fx-show.sm')    set showSm(val)   { this._cacheInput('showSm', val); };
  @Input('fx-show.gt-sm') set showGtSm(val) { this._cacheInput('showGtSm', val); };
  @Input('fx-show.md')    set showMd(val)   { this._cacheInput('showMd', val); };
  @Input('fx-show.gt-md') set showGtMd(val) { this._cacheInput('showGtMd', val); };
  @Input('fx-show.lg')    set showLg(val)   { this._cacheInput('showLg', val); };
  @Input('fx-show.gt-lg') set showGtLg(val) { this._cacheInput('showGtLg', val); };
  @Input('fx-show.xl')    set showXl(val)   { this._cacheInput('showXl', val); };
  /**
   *
   */
  constructor(
      monitor : MediaMonitor,
      @Optional() @Self() private _layout: LayoutDirective,
      @Inject(forwardRef(() => HideDirective)) @Optional() @Self() private _hideDirective,
      protected elRef: ElementRef,
      protected renderer: Renderer)
  {
    super(monitor, elRef, renderer);

    if (_layout) {
      /**
       * The Layout can set the display:flex (and incorrectly affect the Hide/Show directives.
       * Whenever Layout [on the same element] resets its CSS, then update the Hide/Show CSS
       */
      this._layoutWatcher = _layout.layout$.subscribe(() => this._updateWithValue());
    }
  }

  /**
    * Does the current element also use the fx-show API ?
    */
   protected get usesHideAPI() {
     return !!this._hideDirective;
   }


  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * On changes to any @Input properties...
   * Default to use the non-responsive Input value ('fx-show')
   * Then conditionally override with the mq-activated Input's current value
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['show'] != null || this._mqActivation) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    this._listenForMediaQueryChanges('show', true, (changes: MediaChange) =>{
      this._updateWithValue(changes.value);
    });
    this._updateWithValue();
  }

  ngOnDestroy() {
     super.ngOnDestroy();
     if (this._layoutWatcher) {
       this._layoutWatcher.unsubscribe();
     }
   }

  // *********************************************
  // Protected methods
  // *********************************************

  /** Validate the visibility value and then update the host's inline display style */
  private _updateWithValue(value?: string|number|boolean) {
    value = value || this._queryInput("show") || true;
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    let shouldShow = this._validateTruthy(value);
    if ( shouldShow || !this.usesHideAPI ) {
      this._applyStyleToElement(this._buildCSS(shouldShow));
    }
  }


  /** Build the CSS that should be assigned to the element instance */
  private _buildCSS(show) {
    return {'display': show ? this._display : 'none'};
  }

  /**  Validate the to be not FALSY */
  _validateTruthy(show) {
    return (FALSY.indexOf(show) == -1)
  }
}
