<a name="2.0.0-rc.1"></a>
# [2.0.0-rc.1](https://github.com/angular/flex-layout/compare/v2.0.0-beta.5...v2.0.0-rc.1) (2017-02-23)

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

Initial public release to NPM.
