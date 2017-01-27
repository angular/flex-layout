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
