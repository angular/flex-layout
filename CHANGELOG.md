<a name="2.0.0-beta.9"></a>
# [2.0.0-beta.9](https://github.com/angular/flex-layout/compare/v2.0.0-beta.8...2.0.0-beta.9) (2017-08-22)

This **@angular/flex-layout** release provides full support for Angular 4.x; along with a long list of improvements:

* support for AOT and universal builds,
* more online demos and samples,
* improved performance,
* and more...

> Note that Angular 2.x is no longer supported.

### Features

* **api, ngClass, ngStyle:** add responsive support for ngClass and ngStyle ([#170](https://github.com/angular/flex-layout/issues/170)) ([f57a63d](https://github.com/angular/flex-layout/commit/f57a63d))
* **breakpoints:** support custom breakpoints and enhanced selectors ([#204](https://github.com/angular/flex-layout/issues/204)) ([ecc6e51](https://github.com/angular/flex-layout/commit/ecc6e51))
* **flexbox:** use protected access to allow API directives to be easily extended ([#163](https://github.com/angular/flex-layout/issues/163)) ([e6bc451](https://github.com/angular/flex-layout/commit/e6bc451))
* **fxFlex:** compute immediate parent flex-direction ([#220](https://github.com/angular/flex-layout/issues/220)) ([ba0d85d](https://github.com/angular/flex-layout/commit/ba0d85d))
* **fxLayout:** add wrap options support to fxLayout ([#207](https://github.com/angular/flex-layout/issues/207)) ([2340a19](https://github.com/angular/flex-layout/commit/2340a19))
* **ObservableMedia:** use ObservableMedia class as provider token ([#158](https://github.com/angular/flex-layout/issues/158)) ([dad69fe](https://github.com/angular/flex-layout/commit/dad69fe))

### BREAKING CHANGES

* revised source package structure for API: @see
  * `/src/lib/api/flexbox`,
  * `/src/lib/api/ext`,
  * `/src/lib/api/core`
* **ngStyle, ngClass:** * `[style.<alias>]` selectors are deprecated in favor of `[ngStyle.<alias>]` selectors
* `[class.<alias>]` selectors are deprecated in favor of `[ngClass.<alias>]` selectors
* default styles are merged with activated styles

```html
<div  fxLayout
  [class.xs]="['xs-1', 'xs-2']"
  [style]="{'font-size': '10px', 'margin-left' : '13px'}"
  [style.xs]="{'font-size': '16px'}"
  [style.md]="{'font-size': '12px'}">
</div>
```

```html
<div  fxLayout
  [ngClass.xs]="['xs-1', 'xs-2']"
  [ngStyle]="{'font-size': '10px', 'margin-left' : '13px'}"
  [ngStyle.xs]="{'font-size': '16px'}"
  [ngStyle.md]="{'font-size': '12px'}">
</div>
```
* **api:** Previously releases used FlexLayoutModule.forRoot(). This has been deprecated and removed.

```js
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  imports: [
    BrowserModule,
    FlexLayoutModule
  ]
})
export class DemoAppModule { }
```

* **ObservableMedia:** Deprecated use of `ObservableMediaService` opaque token. Developers now simply use the ObservableMedia class to inject the service.
* use `MediaService::asObservable()` to get instance of observable

*before*

```js
constructor( @Inject(ObserverableMediaService) private media:any ) { ... }
```

**after**
```js
constructor(private media:ObservableMedia) { ... }
```

##### Example

```js
import {ObservableMedia, MediaChange} from '@angular/flex-layout';

@Component({ ... })
export class MyComponent {
  
  constructor( @Inject(ObservableMedia) media) {
    
    media.asObservable()
      .map( (change:MediaChange) => change.mqAlias == 'md' )
      .subscribe((change:MediaChange) => {
        let state = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : ""
        console.log( state );
      });
    
  }
}
```

### Bug Fixes

* **api:** defer getComputedStyle() calls until ngOnInit phase ([#374](https://github.com/angular/flex-layout/issues/374)) ([3611003](https://github.com/angular/flex-layout/commit/3611003)), closes [#310](https://github.com/angular/flex-layout/issues/310)
* **api:** layout with layoutAlign was not responding to reverse directions ([dde6e87](https://github.com/angular/flex-layout/commit/dde6e87)), closes [#82](https://github.com/angular/flex-layout/issues/82)
* **api:** remove circular dependencies ([7bff29e](https://github.com/angular/flex-layout/commit/7bff29e)), closes [#88](https://github.com/angular/flex-layout/issues/88)
* **api:** remove use of static ngModule.forRoot() ([#167](https://github.com/angular/flex-layout/issues/167)) ([86010bf](https://github.com/angular/flex-layout/commit/86010bf))
* **api:** restore orig display mode and more... ([#143](https://github.com/angular/flex-layout/issues/143)) ([d269d73](https://github.com/angular/flex-layout/commit/d269d73)), closes [#140](https://github.com/angular/flex-layout/issues/140) [#141](https://github.com/angular/flex-layout/issues/141)
* **api:** support query children on API directives ([#290](https://github.com/angular/flex-layout/issues/290)) ([f5558de](https://github.com/angular/flex-layout/commit/f5558de))
* **api, flexbox:** add default display property to getDisplayStyle() ([#301](https://github.com/angular/flex-layout/issues/301)) ([771f2c9](https://github.com/angular/flex-layout/commit/771f2c9))
* **api, flexbox:** resolve 'renderer.setStyle()' error ([#298](https://github.com/angular/flex-layout/issues/298)) ([3e1fcbd](https://github.com/angular/flex-layout/commit/3e1fcbd)), closes [#270](https://github.com/angular/flex-layout/issues/270)
* **api, flexbox:** scan flex-direction in css stylesheet ([#365](https://github.com/angular/flex-layout/issues/365)) ([635c4f5](https://github.com/angular/flex-layout/commit/635c4f5)), closes [#272](https://github.com/angular/flex-layout/issues/272) [#364](https://github.com/angular/flex-layout/issues/364)
* **api, breakpoints:** resolve 1px hole between lg -> xl breakpoints ([#159](https://github.com/angular/flex-layout/issues/159)) ([d78527c](https://github.com/angular/flex-layout/commit/d78527c)), closes [#149](https://github.com/angular/flex-layout/issues/149)
* **api, breakpoints:** support print media ([#367](https://github.com/angular/flex-layout/issues/367)) ([37a0b85](https://github.com/angular/flex-layout/commit/37a0b85)), closes [#361](https://github.com/angular/flex-layout/issues/361)
* **fxFlex:** add min-width to elements with flex basis using px values ([3fe5ea3](https://github.com/angular/flex-layout/commit/3fe5ea3)), closes [#68](https://github.com/angular/flex-layout/issues/68)
* **fxFlex:** fix use of values with 'auto' ([#122](https://github.com/angular/flex-layout/issues/122)) ([04d24d5](https://github.com/angular/flex-layout/commit/04d24d5)), closes [#120](https://github.com/angular/flex-layout/issues/120)
* **FlexLayoutModule:** remove console.warn() conflicts with ngc+AOT ([#179](https://github.com/angular/flex-layout/issues/179)) ([0797c85](https://github.com/angular/flex-layout/commit/0797c85)), closes [#174](https://github.com/angular/flex-layout/issues/174) [#175](https://github.com/angular/flex-layout/issues/175) [#176](https://github.com/angular/flex-layout/issues/176) [#178](https://github.com/angular/flex-layout/issues/178)
* **fxFlex:** fxFlex=auto with overlapping breakpoints activated ([#183](https://github.com/angular/flex-layout/issues/183)) ([cb614ed](https://github.com/angular/flex-layout/commit/cb614ed)), closes [#135](https://github.com/angular/flex-layout/issues/135)
* **fxFlex:** improve support for 'auto' and flex-basis variations ([#212](https://github.com/angular/flex-layout/issues/212)) ([c28dfc7](https://github.com/angular/flex-layout/commit/c28dfc7))
* **fxFlex:** prevent setting min/max-size when grow/shrink is zero ([#160](https://github.com/angular/flex-layout/issues/160)) ([942939e](https://github.com/angular/flex-layout/commit/942939e)), closes [#153](https://github.com/angular/flex-layout/issues/153)
* **fxFlexFill, fxFlexAlign:** update selectors and wiki ([8f591c5](https://github.com/angular/flex-layout/commit/8f591c5)), closes [#93](https://github.com/angular/flex-layout/issues/93)
* **fxFlexOffset:** use parent flow direction for margin property ([#369](https://github.com/angular/flex-layout/issues/369)) ([f0473e9](https://github.com/angular/flex-layout/commit/f0473e9)), closes [#328](https://github.com/angular/flex-layout/issues/328)
* **fxHide,fxShow:** fix standalone breakpoint selectors ([#121](https://github.com/angular/flex-layout/issues/121)) ([0ca7d07](https://github.com/angular/flex-layout/commit/0ca7d07)), closes [#62](https://github.com/angular/flex-layout/issues/62) [#59](https://github.com/angular/flex-layout/issues/59) [#105](https://github.com/angular/flex-layout/issues/105)
* **fxLayoutAlign:** support flex-start and flex-end options ([#239](https://github.com/angular/flex-layout/issues/239)) ([eb5cb9f](https://github.com/angular/flex-layout/commit/eb5cb9f)), closes [#232](https://github.com/angular/flex-layout/issues/232)
* **fxLayoutGap:** add gaps to dynamic content ([#124](https://github.com/angular/flex-layout/issues/124)) ([6482c12](https://github.com/angular/flex-layout/commit/6482c12)), closes [#95](https://github.com/angular/flex-layout/issues/95)
* **fxLayoutGap:** fxLayoutWrap to apply gap logic for reverse directions ([#148](https://github.com/angular/flex-layout/issues/148)) ([9f7137e](https://github.com/angular/flex-layout/commit/9f7137e)), closes [#108](https://github.com/angular/flex-layout/issues/108)
* **fxLayoutGap:** mutation observer should run outside the ngZone ([#370](https://github.com/angular/flex-layout/issues/370)) ([9fb0877](https://github.com/angular/flex-layout/commit/9fb0877)), closes [#329](https://github.com/angular/flex-layout/issues/329)
* **fxLayoutGap:** skip hidden element nodes ([#145](https://github.com/angular/flex-layout/issues/145)) ([6c45b35](https://github.com/angular/flex-layout/commit/6c45b35)), closes [#136](https://github.com/angular/flex-layout/issues/136)
* **fxShow, fxHide:** support fxHide+fxShow usages on same element ([#190](https://github.com/angular/flex-layout/issues/190)) ([eee20b2](https://github.com/angular/flex-layout/commit/eee20b2))
* **fxStyle:** enable raw input caching ([#173](https://github.com/angular/flex-layout/issues/173)) ([d5b283c](https://github.com/angular/flex-layout/commit/d5b283c))
* **matchMediaObservable:** expose observable for rxjs operators ([#133](https://github.com/angular/flex-layout/issues/133)) ([6e46561](https://github.com/angular/flex-layout/commit/6e46561)), closes [#125](https://github.com/angular/flex-layout/issues/125)
* **MatchMediaObservable:** register breakpoints so observable announces properly ([3555e14](https://github.com/angular/flex-layout/commit/3555e14)), closes [#65](https://github.com/angular/flex-layout/issues/65) [#64](https://github.com/angular/flex-layout/issues/64)
* **ngClass:** add ngClass selector support ([#223](https://github.com/angular/flex-layout/issues/223)) ([980d412](https://github.com/angular/flex-layout/commit/980d412)), closes [#206](https://github.com/angular/flex-layout/issues/206)
* **ngClass,ngStyle:** support proper API usages and ChangeDetectionStrategy.OnPush strategies ([#228](https://github.com/angular/flex-layout/issues/228)) ([5db01e7](https://github.com/angular/flex-layout/commit/5db01e7)), closes [#206](https://github.com/angular/flex-layout/issues/206) [#215](https://github.com/angular/flex-layout/issues/215)
* **ngStyle, ngClass:** StyleDirective security fixes &  merge activated styles ([#198](https://github.com/angular/flex-layout/issues/198)) ([eb22fe5](https://github.com/angular/flex-layout/commit/eb22fe5)), closes [#197](https://github.com/angular/flex-layout/issues/197)
* **ObservableMedia:** provide consistent reporting of active breakpoint ([#186](https://github.com/angular/flex-layout/issues/186)) ([aa0dab4](https://github.com/angular/flex-layout/commit/aa0dab4)), closes [#185](https://github.com/angular/flex-layout/issues/185)
* **ObservableMedia:** startup should propagate lastReplay value properly ([#313](https://github.com/angular/flex-layout/issues/313)) ([00ac57a](https://github.com/angular/flex-layout/commit/00ac57a)), closes [#245](https://github.com/angular/flex-layout/issues/245) [#275](https://github.com/angular/flex-layout/issues/275) [#303](https://github.com/angular/flex-layout/issues/303)
* **lib:** remove all uses of [@internal](https://github.com/internal) ([ca64760](https://github.com/angular/flex-layout/commit/ca64760))
* **lib, auto-prefixer:** resolve perf impacts as reported by LightHouse ([#283](https://github.com/angular/flex-layout/issues/283)) ([bc0c900](https://github.com/angular/flex-layout/commit/bc0c900)), closes [#282](https://github.com/angular/flex-layout/issues/282)
* **lib, media-query:** support angular/universal ([#353](https://github.com/angular/flex-layout/issues/353)) ([0f13b14](https://github.com/angular/flex-layout/commit/0f13b14)), closes [#187](https://github.com/angular/flex-layout/issues/187) [#354](https://github.com/angular/flex-layout/issues/354) [#346](https://github.com/angular/flex-layout/issues/346)
* **lib, rxjs:** import specific symbols from rxjs insted of using prototype-mutating operators ([#99](https://github.com/angular/flex-layout/issues/99)) ([88d1b0f](https://github.com/angular/flex-layout/commit/88d1b0f))
* **lib, prefixer:** improve flex css prefixes ([#276](https://github.com/angular/flex-layout/issues/276)) ([beb5ed0](https://github.com/angular/flex-layout/commit/beb5ed0))
* **build:** add observable-media-service to exported barrel ([#139](https://github.com/angular/flex-layout/issues/139)) ([b7dffaa](https://github.com/angular/flex-layout/commit/b7dffaa))
* **build:** remove use of Angular private API ([#195](https://github.com/angular/flex-layout/issues/195)) ([d95cb09](https://github.com/angular/flex-layout/commit/d95cb09)), closes [#193](https://github.com/angular/flex-layout/issues/193)
* **build:** support Angular 4 and AOT ([#255](https://github.com/angular/flex-layout/issues/255)) ([fed87fa](https://github.com/angular/flex-layout/commit/fed87fa)), closes [#254](https://github.com/angular/flex-layout/issues/254) [#236](https://github.com/angular/flex-layout/issues/236) [#227](https://github.com/angular/flex-layout/issues/227)
* **demo:** correctly use template instead of templateUrl ([#100](https://github.com/angular/flex-layout/issues/100)) ([c436824](https://github.com/angular/flex-layout/commit/c436824))
* **demo:** fix bindings for fxLayout with AoT ([#101](https://github.com/angular/flex-layout/issues/101)) ([51ea29e](https://github.com/angular/flex-layout/commit/51ea29e))
* **demo:** improve use of ObservableMedia service ([#214](https://github.com/angular/flex-layout/issues/214)) ([64b122a](https://github.com/angular/flex-layout/commit/64b122a))
* **demo:** add ngxSplitter demo showing how splitters can be used with Flex-Layout ([ngxSplitter Demo](https://tburleson-layouts-demos.firebaseapp.com/#/issues))


<a name="2.0.0-beta.8"></a>
# [2.0.0-beta.8](https://github.com/angular/flex-layout/compare/v2.0.0-beta.7...v2.0.0-beta.8) (2017-04-18)


### BREAKING CHANGES

These changes to **@angular/flex-layout** will require Angular v4.x and will **not** be compatible with Angular v2.x.

### Bug Fixes

* **build:** support Angular 4 and AOT ([#255](https://github.com/angular/flex-layout/issues/255)) ([fed87fa](https://github.com/angular/flex-layout/commit/fed87fa)), closes [#254](https://github.com/angular/flex-layout/issues/254) [#236](https://github.com/angular/flex-layout/issues/236) [#227](https://github.com/angular/flex-layout/issues/227)



<a name="2.0.0-beta.7"></a>
# [2.0.0-beta.7](https://github.com/angular/flex-layout/compare/v2.0.0-beta.6...v2.0.0-beta.7) (2017-03-17)

> ##### Note: Previous Release
> We prematurely labeled the previously release **@angular/flex-layout v2.0.0-rc.1**.  
It should have been a beta release and is therefore renamed to @angular/flex-layout v2.0.0-beta.6.

### Bug Fixes

* **demo:** improve use of ObservableMedia service ([#214](https://github.com/angular/flex-layout/issues/214)) ([64b122a](https://github.com/angular/flex-layout/commit/64b122a))
* **fxFlex:** improve support for 'auto' and flex-basis variations ([#212](https://github.com/angular/flex-layout/issues/212)) ([c28dfc7](https://github.com/angular/flex-layout/commit/c28dfc7))
* **fxLayoutAlign:** support flex-start and flex-end options ([#239](https://github.com/angular/flex-layout/issues/239)) ([eb5cb9f](https://github.com/angular/flex-layout/commit/eb5cb9f)), closes [#232](https://github.com/angular/flex-layout/issues/232)
* **ngClass:** add ngClass selector support ([#223](https://github.com/angular/flex-layout/issues/223)) ([980d412](https://github.com/angular/flex-layout/commit/980d412)), closes [#206](https://github.com/angular/flex-layout/issues/206)
* **ngClass,ngStyle:** support proper API usages and ChangeDetectionStrategy.OnPush strategies ([#228](https://github.com/angular/flex-layout/issues/228)) ([5db01e7](https://github.com/angular/flex-layout/commit/5db01e7)), closes [#206](https://github.com/angular/flex-layout/issues/206) [#215](https://github.com/angular/flex-layout/issues/215)
* **ngStyle, ngClass:** StyleDirective security fixes &  merge activated styles ([#198](https://github.com/angular/flex-layout/issues/198)) ([eb22fe5](https://github.com/angular/flex-layout/commit/eb22fe5)), closes [#197](https://github.com/angular/flex-layout/issues/197)

### Features

* **breakpoints:** support custom breakpoints and enhanced selectors ([#204](https://github.com/angular/flex-layout/issues/204)) ([ecc6e51](https://github.com/angular/flex-layout/commit/ecc6e51))
* **fxFlex:** compute immediate parent flex-direction ([#220](https://github.com/angular/flex-layout/issues/220)) ([ba0d85d](https://github.com/angular/flex-layout/commit/ba0d85d))
* **fxLayout:** add wrap options support to fxLayout ([#207](https://github.com/angular/flex-layout/issues/207)) ([2340a19](https://github.com/angular/flex-layout/commit/2340a19))


### BREAKING CHANGES

* `FlexLayoutModule.forRoot()` was deprecated in *beta.6* and is now removed.

##### - before -

```js
imports : [  FlexLayoutModule.forRoot() ]
```

##### - after -

```js
imports : [  FlexLayoutModule ]
```

* **ngStyle, ngClass:** 
  * `[style.<alias>]` selectors are deprecated in favor of `[ngStyle.<alias>]` selectors
  * `[class.<alias>]` selectors are [destructive replacements](https://github.com/angular/flex-layout/wiki/ngClass-API#standard-class-features) (no merging)
  * `[ngClass.<alias>]` selectors will [merge](https://github.com/angular/flex-layout/wiki/ngClass-API#standard-ngclass-features) (add or remove classnames)
  * default styles are merged with activated styles
    *  see [ngClass API](http://bit.ly/ngClassAPI), [ngStyle API](http://bit.ly/ngStyleAPI) docs(s) for details.

##### - before -

```html
<div fxLayout
  [class.xs]="['xs-1', 'xs-2']"
  [style]="{'font-size': '10px', 'margin-left' : '13px'}"
  [style.xs]="{'font-size': '16px'}"
  [style.md]="{'font-size': '12px'}">
</div>
```
##### - after -

```html
<div fxLayout
  [ngClass.xs]="['xs-1', 'xs-2']"
  [ngStyle]="{'font-size': '10px', 'margin-left' : '13px'}"
  [ngStyle.xs]="{'font-size': '16px'}"
  [ngStyle.md]="{'font-size': '12px'}">
</div>
```



<a name="2.0.0-beta.6"></a>
# [2.0.0-beta.6](https://github.com/angular/flex-layout/compare/v2.0.0-beta.5...v2.0.0-beta.6) (2017-02-23)

### Bug Fixes

* **build:** remove use of Angular private API ([#195](https://github.com/angular/flex-layout/issues/195)) ([d95cb09](https://github.com/angular/flex-layout/commit/d95cb09)), closes [#193](https://github.com/angular/flex-layout/issues/193)
* **FlexLayoutModule:** remove console.warn() conflicts with ngc+AOT ([#179](https://github.com/angular/flex-layout/issues/179)) ([0797c85](https://github.com/angular/flex-layout/commit/0797c85)), closes [#174](https://github.com/angular/flex-layout/issues/174) [#175](https://github.com/angular/flex-layout/issues/175) [#176](https://github.com/angular/flex-layout/issues/176) [#178](https://github.com/angular/flex-layout/issues/178)
* **fxFlex:** fxFlex=auto with overlapping breakpoints activated ([#183](https://github.com/angular/flex-layout/issues/183)) ([cb614ed](https://github.com/angular/flex-layout/commit/cb614ed)), closes [#135](https://github.com/angular/flex-layout/issues/135)
* **fxShow, fxHide:** support fxHide+fxShow usages on same element ([#190](https://github.com/angular/flex-layout/issues/190)) ([eee20b2](https://github.com/angular/flex-layout/commit/eee20b2))
* **ObservableMedia:** provide consistent reporting of active breakpoint ([#186](https://github.com/angular/flex-layout/issues/186)) ([aa0dab4](https://github.com/angular/flex-layout/commit/aa0dab4)), closes [#185](https://github.com/angular/flex-layout/issues/185)
* **release:** fix checkout CHANGELOG.md from origin/master ([e17cdc1](https://github.com/angular/flex-layout/commit/e17cdc1))

<a name="2.0.0-beta.5"></a>
# [2.0.0-beta.5](https://github.com/angular/flex-layout/compare/v2.0.0-beta.4...v2.0.0-beta.5) (2017-02-09)

### Bug Fixes

* **breakpoints:** resolve 1px hole between lg -> xl breakpoints ([#159](https://github.com/angular/flex-layout/issues/159)) ([d78527c](https://github.com/angular/flex-layout/commit/d78527c)), closes [#149](https://github.com/angular/flex-layout/issues/149)
* **FlexLayoutModule:** remove use of static ngModule.forRoot() ([#167](https://github.com/angular/flex-layout/issues/167)) ([86010bf](https://github.com/angular/flex-layout/commit/86010bf))
* **FlexLayoutModule:** add observable-media-service to exported barrel ([#139](https://github.com/angular/flex-layout/issues/139)) ([b7dffaa](https://github.com/angular/flex-layout/commit/b7dffaa))
* **fxFlex:** fix use of values with 'auto' ([#122](https://github.com/angular/flex-layout/issues/122)) ([04d24d5](https://github.com/angular/flex-layout/commit/04d24d5)), closes [#120](https://github.com/angular/flex-layout/issues/120)
* **fxFlex:** prevent setting min/max-size when grow/shrink is zero ([#160](https://github.com/angular/flex-layout/issues/160)) ([942939e](https://github.com/angular/flex-layout/commit/942939e)), closes [#153](https://github.com/angular/flex-layout/issues/153)
* **fxHide,fxShow:** restore orig display mode and more... ([#143](https://github.com/angular/flex-layout/issues/143)) ([d269d73](https://github.com/angular/flex-layout/commit/d269d73)), closes [#140](https://github.com/angular/flex-layout/issues/140) [#141](https://github.com/angular/flex-layout/issues/141)
* **fxHide,fxShow:** fix standalone breakpoint selectors ([#121](https://github.com/angular/flex-layout/issues/121)) ([0ca7d07](https://github.com/angular/flex-layout/commit/0ca7d07)), closes [#62](https://github.com/angular/flex-layout/issues/62) [#59](https://github.com/angular/flex-layout/issues/59) [#105](https://github.com/angular/flex-layout/issues/105)
* **fxLayoutGap:** add gaps to dynamic content ([#124](https://github.com/angular/flex-layout/issues/124)) ([6482c12](https://github.com/angular/flex-layout/commit/6482c12)), closes [#95](https://github.com/angular/flex-layout/issues/95)
* **fxLayoutGap:** fxLayoutWrap to apply gap logic for reverse directions ([#148](https://github.com/angular/flex-layout/issues/148)) ([9f7137e](https://github.com/angular/flex-layout/commit/9f7137e)), closes [#108](https://github.com/angular/flex-layout/issues/108)
* **fxLayoutGap:** skip hidden element nodes ([#145](https://github.com/angular/flex-layout/issues/145)) ([6c45b35](https://github.com/angular/flex-layout/commit/6c45b35)), closes [#136](https://github.com/angular/flex-layout/issues/136)
* **fxClass,fxStyle:** enable raw input caching ([#173](https://github.com/angular/flex-layout/issues/173)) ([d5b283c](https://github.com/angular/flex-layout/commit/d5b283c))
* **ObservableMedia:** expose `asObservable()` for rxjs operators ([#133](https://github.com/angular/flex-layout/issues/133)) ([6e46561](https://github.com/angular/flex-layout/commit/6e46561)), closes [#125](https://github.com/angular/flex-layout/issues/125)

### Features

* **API:** use protected access to allow API directives to be easily extended ([#163](https://github.com/angular/flex-layout/issues/163)) ([e6bc451](https://github.com/angular/flex-layout/commit/e6bc451))
* **fxClass,fxStyle:** add responsive support for ngClass and ngStyle ([#170](https://github.com/angular/flex-layout/issues/170)) ([f57a63d](https://github.com/angular/flex-layout/commit/f57a63d))
* **ObservableMedia:** use ObservableMedia class as provider token ([#158](https://github.com/angular/flex-layout/issues/158)) ([dad69fe](https://github.com/angular/flex-layout/commit/dad69fe))

### BREAKING CHANGES

* ObservableMedia: Deprecated use of `ObservableMediaService` opaque token. Developers now simply use the ObservableMedia class to inject the service.
* FlexLayoutModule: Previously releases used FlexLayoutModule.forRoot(); This has been deprecated.

*before*

```js
constructor( @Inject(ObserverableMediaService) media:any ) { ... }
```

**after**
```js
constructor(private media:ObservableMedia) { ... }
```
* ObservableMedia: use class `ObservableMedia` to inject instance of service
* use `MediaService::asObservable()` to get instance of observable

```js
// RxJS
import 'rxjs/add/operator/map';
import {ObservableMedia} from '@angular/flex-layout';

@Component({ ... })
export class MyComponent {
  constructor( media:ObservableMedia ) {
    media.asObservable()
      .map( (change:MediaChange) => change.mqAlias == 'md' )
      .subscribe((change:MediaChange) => {
        let state = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : "";
        console.log( state );
      });
  }
}
```

Previously releases used FlexLayoutModule.forRoot().
This has been deprecated and will output a `console.warn()` if used.

-*before*-

```js
@NgModule({
  declarations : [...],
  imports : [
    CommonModule,
    FlexLayoutModule.forRoot()
  ]
})
export class DemosResponsiveLayoutsModule { }
```

-*after*-

```js
@NgModule({
  declarations : [...],
  imports : [ CommonModule, FlexLayoutModule ]
})
export class DemosResponsiveLayoutsModule { }
```

<a name="2.0.0-beta.4"></a>
# [2.0.0-beta.4](https://github.com/angular/flex-layout/compare/v2.0.0-beta.3...v2.0.0-beta.4) (2017-01-27)


### Bug Fixes

* **flex:** fix use of values with 'auto' ([#122](https://github.com/angular/flex-layout/issues/122)) ([04d24d5](https://github.com/angular/flex-layout/commit/04d24d5)), closes [#120](https://github.com/angular/flex-layout/issues/120)
* **fxHide,fxShow:** fix standalone breakpoint selectors ([#121](https://github.com/angular/flex-layout/issues/121)) ([0ca7d07](https://github.com/angular/flex-layout/commit/0ca7d07)), closes [#62](https://github.com/angular/flex-layout/issues/62) [#59](https://github.com/angular/flex-layout/issues/59) [#105](https://github.com/angular/flex-layout/issues/105)
* **fxLayoutGap:** add gaps to dynamic content ([#124](https://github.com/angular/flex-layout/issues/124)) ([6482c12](https://github.com/angular/flex-layout/commit/6482c12)), closes [#95](https://github.com/angular/flex-layout/issues/95)
* **matchMediaObservable:** expose observable for rxjs operators ([#133](https://github.com/angular/flex-layout/issues/133)) ([6e46561](https://github.com/angular/flex-layout/commit/6e46561)), closes [#125](https://github.com/angular/flex-layout/issues/125)


### BREAKING CHANGES

* matchMediaObservable: * use opaque token `ObservableMediateService` to inject instance of `MediaService`
* use `MediaService::asObservable()` to get instance of observable

```js
// RxJS
import 'rxjs/add/operator/map';

@Component({ ... })
export class MyComponent {
  constructor( @Inject(ObservableMediaService) media) {
    media.asObservable()
      .map( (change:MediaChange) => change.mqAlias == 'md' )
      .subscribe((change:MediaChange) => {
        let state = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : ""
        console.log( state );
      });
  }
}
```

<a name="2.0.0-beta.3"></a>
# [2.0.0-beta.3](https://github.com/angular/flex-layout/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2017-01-17)


<a name="2.0.0-beta.2"></a>
# [2.0.0-beta.2](https://github.com/angular/flex-layout/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2017-01-13)


### Bug Fixes

* **api:** layout with layoutAlign was not responding to reverse directions ([dde6e87](https://github.com/angular/flex-layout/commit/dde6e87)), closes [#82](https://github.com/angular/flex-layout/issues/82)
* **api:** remove circular dependencies ([7bff29e](https://github.com/angular/flex-layout/commit/7bff29e)), closes [#88](https://github.com/angular/flex-layout/issues/88)
* **changelog:** fix invalid parentheses and semver checks ([96aaa78](https://github.com/angular/flex-layout/commit/96aaa78))
* **demo:** correctly use template instead of templateUrl ([#100](https://github.com/angular/flex-layout/issues/100)) ([c436824](https://github.com/angular/flex-layout/commit/c436824))
* **demo:** fix bindings for fxLayout with AoT ([#101](https://github.com/angular/flex-layout/issues/101)) ([51ea29e](https://github.com/angular/flex-layout/commit/51ea29e))
* import specific symbols from rxjs ([#99](https://github.com/angular/flex-layout/issues/99)) ([88d1b0f](https://github.com/angular/flex-layout/commit/88d1b0f))
* **flex:** add min-width to elements with flex basis using px values ([3fe5ea3](https://github.com/angular/flex-layout/commit/3fe5ea3)), closes [#68](https://github.com/angular/flex-layout/issues/68)
* **fxFlexFill, fxFlexAlign:** update selectors and wiki ([8f591c5](https://github.com/angular/flex-layout/commit/8f591c5)), closes [#93](https://github.com/angular/flex-layout/issues/93)
* **lib:** remove all uses of [@internal](https://github.com/internal) ([ca64760](https://github.com/angular/flex-layout/commit/ca64760))
* **MatchMediaObservable:** register breakpoints so observable announces properly ([3555e14](https://github.com/angular/flex-layout/commit/3555e14)), closes [#65](https://github.com/angular/flex-layout/issues/65) [#64](https://github.com/angular/flex-layout/issues/64)
* **test:** fix test for fxFlex='' ([fcf851f](https://github.com/angular/flex-layout/commit/fcf851f))
* **tests:** remove unneeded async() wrappers in karma tests ([a77de3c](https://github.com/angular/flex-layout/commit/a77de3c))



<a name"2.0.0-beta.1"></a>
## 2.0.0-beta.1 (2016-12-24)

Initial public release to NPM
