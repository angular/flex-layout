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

This provider is used to return a list to *all* known BreakPoint(s) and, in turn, this list is used internally to 
register mediaQueries and announce mediaQuery activations.


### Custom BreakPoints

Using the **BREAKPOINT** (note: singular) `InjectionToken`, developers can add custom breakpoints or easily override 
existing breakpoints. 

For example to add mediaQueries that activate when printing:

##### `custom-breakpoints.ts`

```typescript
import {BREAKPOINT} from '@angular/flex-layout';

const PRINT_BREAKPOINTS = [{
  alias: 'xs.print',
  suffix: 'XsPrint',
  mediaQuery: 'screen and (max-width: 297px)',
  overlapping: false
}];

export const CustomBreakPointsProvider = { 
  provide: BREAKPOINT,
  useValue: PRINT_BREAKPOINTS,
  multi: true
};
```

##### `my-app-module.ts`

```typescript
import {CommonModule, NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CustomBreakPointsProvider} from './custom-breakpoints.ts';

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

With the above changes, when printing on mobile-sized viewports the **`xs.print`** mediaQuery will activate. Please note
that the provider is a **multi-provider**, meaning it can be provided multiple times and in a variety of
presentations. The type signature of `BREAKPOINT` is the following:

`BREAKPOINT = InjectionToken<BreakPoint|BreakPoint[]>`

Thus, you can use the token to segment which breakpoints you provide and in which order. For instance,
you can provide all print breakpoints in an array called `PRINT_BREAKPOINTS` and then all mobile breakpoints
in another array called `MOBILE_BREAKPOINTS`. You can also simply provide one additional breakpoint if that's
all you need.

### Disabling the default breakpoints

To disable the default breakpoints, you simply provide the new **DISABLE_DEFAULT_BREAKPOINTS** token as follows:

```typescript
import {DISABLE_DEFAULT_BREAKPOINTS} from '@angular/flex-layout';

{provide: DISABLE_DEFAULT_BREAKPOINTS, useValue: true}
```

The default value for this breakpoint is false

### Adding the orientation breakpoints

The orientation breakpoints are a set of breakpoints that detect when a device is in portrait or landscape mode. Flex
Layout has a set of these that conform to the Material Design spec built-in to the library. They can be found in the 
`ORIENTATION_BREAKPOINTS` `InjectionToken`. To have these added to the default breakpoints, you can provide the token
`ADD_ORIENTATION_BREAKPOINTS` to your app as follows:

```typescript
import {ADD_ORIENTATION_BREAKPOINTS} from '@angular/flex-layout';

{provide: ADD_ORIENTATION_BREAKPOINTS, useValue: true}
```

The default value for this breakpoint is false

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
