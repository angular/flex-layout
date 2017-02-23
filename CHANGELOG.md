<a name="2.0.0-rc.1"></a>
# [2.0.0-rc.1](https://github.com/angular/flex-layout/compare/v2.0.0-beta.5...v2.0.0-rc.1) (2017-02-23)


### Bug Fixes

* **build:** remove use of Angular private API ([#195](https://github.com/angular/flex-layout/issues/195)) ([d95cb09](https://github.com/angular/flex-layout/commit/d95cb09)), closes [#193](https://github.com/angular/flex-layout/issues/193)
* **FlexLayoutModule:** remove console.warn() conflicts with ngc+AOT ([#179](https://github.com/angular/flex-layout/issues/179)) ([0797c85](https://github.com/angular/flex-layout/commit/0797c85)), closes [#174](https://github.com/angular/flex-layout/issues/174) [#175](https://github.com/angular/flex-layout/issues/175) [#176](https://github.com/angular/flex-layout/issues/176) [#178](https://github.com/angular/flex-layout/issues/178)
* **fxFlex:** fxFlex=auto with overlapping breakpoints activated ([#183](https://github.com/angular/flex-layout/issues/183)) ([cb614ed](https://github.com/angular/flex-layout/commit/cb614ed)), closes [#135](https://github.com/angular/flex-layout/issues/135)
* **fxShow, fxHide:** support fxHide+fxShow usages on same element ([#190](https://github.com/angular/flex-layout/issues/190)) ([eee20b2](https://github.com/angular/flex-layout/commit/eee20b2))
* **ObservableMedia:** provide consistent reporting of active breakpoint ([#186](https://github.com/angular/flex-layout/issues/186)) ([aa0dab4](https://github.com/angular/flex-layout/commit/aa0dab4)), closes [#185](https://github.com/angular/flex-layout/issues/185)
* **release:** fix checkout CHANGELOG.md from origin/master ([e17cdc1](https://github.com/angular/flex-layout/commit/e17cdc1))



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
