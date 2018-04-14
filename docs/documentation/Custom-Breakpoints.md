Developers can easily override the default breakpoints used within Flex-Layout.

### Default Breakpoints

The default breakpoints are defined in 
[break-points.ts](https://github.com/angular/flex-layout/blob/master/src/lib/core/breakpoints/data/break-points.ts#L14) 
and are registered as a provider using the 
[`BREAKPOINTS`](https://github.com/angular/flex-layout/blob/master/src/lib/core/breakpoints/break-points-token.ts#L16)
InjectionToken.

```typescript
import {DEFAULT_BREAKPOINTS, BREAKPOINTS, validateSuffixes} from '@angular/flex-layout';

/**
 *  Ensure that only a single global BreakPoint list is instantiated...
 */
export function DEFAULT_BREAKPOINTS_PROVIDER_FACTORY() {
  return validateSuffixes(DEFAULT_BREAKPOINTS);
}
/**
 * Default Provider that does not support external customization nor provide
 * the extra extended breakpoints:   "handset", "tablet", and "web"
 *
 *  NOTE: breakpoints are considered to have unique 'alias' properties,
 *        custom breakpoints matching existing breakpoints will override the properties
 *        of the existing (and not be added as an extra breakpoint entry).
 *        [xs, gt-xs, sm, gt-sm, md, gt-md, lg, gt-lg, xl]
 */
export const DEFAULT_BREAKPOINTS_PROVIDER = { // tslint:disable-line:variable-name
  provide: BREAKPOINTS,
  useFactory: DEFAULT_BREAKPOINTS_PROVIDER_FACTORY
};
```

Please review the wiki [Responsive API](https://github.com/angular/flex-layout/wiki/Responsive-API) to review the 
specific, default breakpoint range values and the alias suffices used.

### Customizing with your own @media query ranges

Developers should build custom providers to override the default **BreakPointRegistry** provider.

```typescript
import {NgModule} from '@angular/core';
import {DEFAULT_BREAKPOINTS, BreakPoint, BREAKPOINTS, validateSuffixes} from '@angular/flex-layout';

/**
 * For mobile and tablet, reset ranges
 */
function updateBreakpoints(bp: BreakPoint) {
  switch(bp.alias) {
    case 'xs' : bp.mediaQuery =  '(max-width: 470px)';   break;
    case 'sm' : bp.mediaQuery =  '(min-width: 471px) and (max-width: 820px)'; break;
  }
  return bp;
}

@NgModule({
  providers: [
    // register a Custom BREAKPOINT Provider
    {
      provide: BREAKPOINTS,
      useFactory: function customizeBreakPoints() {
        return validateSuffixes(DEFAULT_BREAKPOINTS.map(updateBreakpoints));
      }
    }
  ]
})
export class MyBreakPointsModule {}
```

---- 

### Constraints to customization

Developers have, however, **one** (1) significant constraint to the customization processes. 

Developers should note that each directive selectors are **hard-coded** to use specific **alias**es. 

Consider, for example, the 
**[`LayoutDirective`](https://github.com/angular/flex-layout/blob/master/src/lib/flex/layout/layout.ts#L30-L36)**:

```typescript
import {Directive} from '@angular/core';
import {BaseDirective} from '@angular/flex-layout';

@Directive({selector: `
  [fxLayout],
  [fxLayout.xs],
  [fxLayout.gt-xs],
  [fxLayout.sm],
  [fxLayout.gt-sm],
  [fxLayout.md],
  [fxLayout.gt-md],
  [fxLayout.lg],
  [fxLayout.gt-lg],
  [fxLayout.xl]
`})
export class LayoutDirective extends BaseDirective { 
 ... 
}
```

> This restriction will be removed in the future; with the resolution of 
[Issue @angular/#13355](https://github.com/angular/angular/issues/13355).


For the present, these **hard-coded** responsive selectors present two (2) requirements:

#### 1. Required Aliases

To support the directive selectors, the custom breakpoints list MUST contain the following aliases & suffixes: 


| alias (suffix)      | fxLayout (selector)      | fxFlex (selector)       |
| ---------- | -------------- | ------------- |
|  **xs**    | fxLayout.xs    | fxFlex.xs     |
|  **gt-xs** | fxLayout.gt-xs | fxFlex.gt-xs  |
|  **sm**    | fxLayout.sm    | fxFlex.sm     |
|  **gt-sm** | fxLayout.gt-sm | fxFlex.gt-sm  |
|  **md**    | fxLayout.md    | fxFlex.md     |
|  **gt-md** | fxLayout.gt-md | fxFlex.gt-md  |
|  **lg**    | fxLayout.lg    | fxFlex.lg     |
|  **gt-lg** | fxLayout.gt-lg | fxFlex.gt-lg  |
|  **xl**    | fxLayout.xl    | fxFlex.xl     |


#### 2. Extra Aliases

If project features have requirements to support additional aliases/mediaQueries for orientation 
(e.g. landscape, portrait), or specific devices (Kindle tablets, iPads, iPhones, Apple Watch, etc.)... then 
developers may need to either:

* modify the `mediaQuery` ranges (as shown above), or
* add additional aliases and selectors (as shown below)

Note that any extra **custom aliases** will not be available as selectors UNLESS the Flex-Layout Directives classes are 
modified or **extended** with those additional custom selectors. 

> This is a known issue and the @angular core team is considering how to appropriately address such dynamic selector 
features

##### Directive Subclassing

Consider the **`LayoutExtDirective`** class below which provides support for the *print* and *tablet* selectors:

```typescript
import {Directive, Input, ElementRef, Renderer2} from '@angular/core';
import {LayoutDirective, MediaMonitor} from '@angular/flex-layout';

@Directive({selector: `
  [fxLayout.print],
  [fxLayout.tablet.landscape],
  [fxLayout.tablet.portrait]
`})
export class LayoutExtDirective extends LayoutDirective {

  constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer2) {
    super(monitor, elRef, renderer);
  }

  @Input('fxLayout.print')            
  set layoutPrint(val){ this._cacheInput('layoutPrint', val); };
  
  @Input('fxLayout.tablet.landscape') 
  set layoutHTab(val) { this._cacheInput('layoutHTab', val); };
  
  @Input('fxLayout.tablet.portrait')  
  set layoutVTab(val) { this._cacheInput('layoutVTab', val); };

}
```

---- 

### Resources

* [CSS Media Queries](http://cssmediaqueries.com/)
* [Media Queries for Standard Devices](https://css-tricks.com/snippets/css/media-queries-for-standard-devices/)
* [Why you don't need device-specific Breakpoints](https://responsivedesign.is/articles/why-you-dont-need-device-specific-breakpoints)
