The token **BREAKPOINTS** is an injection token in **@angular/flex-layout** that is used to build a **Provider** for a 
raw list of breakpoints.

```typescript
import {InjectionToken, NgModule} from '@angular/core';
import {BREAKPOINTS, DEFAULT_BREAKPOINTS} from '@angular/flex-layout';

export const BreakPointsProvider = { 
  provide: BREAKPOINTS,
  useValue: DEFAULT_BREAKPOINTS
};

@NgModule({
  providers: [
    BreakPointsProvider,     // Supports developer overrides of list of known breakpoints
 // BreakPointRegistry,      // Registry of known/used BreakPoint(s)
 // MatchMedia,              // Low-level service to publish observables w/ window.matchMedia()
 // MediaMonitor,            // MediaQuery monitor service observes all known breakpoints
 // ObservableMediaProvider  // easy subscription injectable `media$` matchMedia observable
  ]
})
export class CoreModule {
}
```

This provider is used to return a list to *all* known BreakPoint(s)... and, in turn, this list is used internally to 
register mediaQueries and announce mediaQuery activations.


### Custom BreakPoints

Using the **BREAKPOINTS** InjectionToken, developers can add custom breakpoints or easily override existing breakpoints. 

For example to add mediaQueries that activate when printing:

##### `custom-breakpoints.ts`

```typescript
import {BREAKPOINTS, DEFAULT_BREAKPOINTS} from '@angular/flex-layout';

const PRINT_BREAKPOINTS = [{
  alias: 'xs.print',
  suffix: 'XsPrint',
  mediaQuery: 'print and (max-width: 297px)',
  overlapping: false
}];

export const CustomBreakPointsProvider = { 
  provide: BREAKPOINTS,
  useValue: [...DEFAULT_BREAKPOINTS, ...PRINT_BREAKPOINTS]
};
```

##### `my-app-module.ts`

```typescript
import {CommonModule, NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CustomBreakPointsProvider} from 'custom-breakpoints.ts';

@NgModule({
  imports : [
    CommonModule,
    FlexLayoutModule,
  ],
  providers: [
    CustomBreakPointsProvider,     // Adds breakpoints for 'print' mediaQueries
  ]
})
export class MyAppModule {
}
```

With the above changes, when printing on mobile-sized viewports the **`xs.print`** mediaQuery will activate.

### Custom Breakpoints and Directives

It must be noted that simply registering custom breakpoints will not automatically mean that Flex-Layout API will 
support those as selectors. 

In the above example the custom Breakpoint has been registered, but HTML selectors for **`xs.print`** will not work 
automatically.  Consider the scenario below where some content should be hidden while printing and other content has 
different layouts while printing:

```html
<section 
    class="main" 
    fxShow 
    fxHide.xs.print="true"> 
 ... 
</section>

<footer 
    fxLayout="row" 
    fxLayout.xs.print="column"> 
 ... 
</section>
```

> Notice the use of 'xs.print' alias in the selectors above

To enable these custom, **responsive selectors**, developers must **extend** the `ShowHideDirective` and the 
`LayoutDirective` as follows.

```typescript
import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {ShowHideDirective, MediaMonitor, negativeOf} from '@angular/flex-layout';

@Directive({
  selector: `[fxHide.xs.print]`
})
export class CustomShowHideDirective extends ShowHideDirective {
  constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer2) {
    super(monitor, elRef, renderer);
  }

  @Input('fxHide.xs.print')
  set hideXs(val) {
    this._cacheInput("showXsPrint", negativeOf(val));
  }
}
```