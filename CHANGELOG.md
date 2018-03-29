<a name="5.0.0-beta.14"></a>
# [5.0.0-beta.14](https://github.com/angular/flex-layout/compare/v2.0.0-beta.old...5.0.0-beta.14) (2018-03-29)


### BREAKING CHANGES

* **tokens:** * `fxFlex` no longer adds `display: flex; flex-direction: row` by
  default


### Bug Fixes

* **breakpoints:** add global provider for BreakPointRegistry ([7cedf6f](https://github.com/angular/flex-layout/commit/7cedf6f))
* **demo-app:** add polyfills for IE11 to demo-app ([a425035](https://github.com/angular/flex-layout/commit/a425035))
* **demo-app:** fix sizing for layout-gap demo ([0562fcc](https://github.com/angular/flex-layout/commit/0562fcc))
* **fxFlex:** apply correct flex-basis stylings ([#629](https://github.com/angular/flex-layout/issues/629)) ([1e96cea](https://github.com/angular/flex-layout/commit/1e96cea)), closes [#277](https://github.com/angular/flex-layout/issues/277) [#280](https://github.com/angular/flex-layout/issues/280) [#323](https://github.com/angular/flex-layout/issues/323) [#528](https://github.com/angular/flex-layout/issues/528) [#534](https://github.com/angular/flex-layout/issues/534)
* **fxFlex:** fix non-wrapping behavior and default fxFlex value ([3cfafd1](https://github.com/angular/flex-layout/commit/3cfafd1))
* **fxFlex:** fix wrapping in older versions of Safari ([3809608](https://github.com/angular/flex-layout/commit/3809608))
* **fxFlex:** make sure not to set width/height when flex is default ([b152998](https://github.com/angular/flex-layout/commit/b152998))
* **fxLayoutGap:** add proper gaps for reverse dir ([3a8041d](https://github.com/angular/flex-layout/commit/3a8041d))
* **layout-gap:** apply correct gaps based on flex order ([de72903](https://github.com/angular/flex-layout/commit/de72903)), closes [#608](https://github.com/angular/flex-layout/issues/608)
* **lib:** resolve RegExp Issue in older versions of Safari ([#643](https://github.com/angular/flex-layout/issues/643)) ([85e8aa2](https://github.com/angular/flex-layout/commit/85e8aa2))
* **release:** Fix release script by removing ',' of the last item in the list ([0486e85](https://github.com/angular/flex-layout/commit/0486e85))
* **ssr:** fix lazy-loading functionality ([d4f2514](https://github.com/angular/flex-layout/commit/d4f2514))


### Features

* **demo-app:** add version number to header ([c984937](https://github.com/angular/flex-layout/commit/c984937))
* **demo-app:** use Angular CLI to build demo and universal apps ([eda12c3](https://github.com/angular/flex-layout/commit/eda12c3))
* **demo-app:** use/register custom breakpoints ([0d4144c](https://github.com/angular/flex-layout/commit/0d4144c))
* **fxLayoutGap:** add gutter functionality to layout-gap ([84ca5c3](https://github.com/angular/flex-layout/commit/84ca5c3))
* **tokens:** add configuration for breakpoints and flex styles ([605f4d1](https://github.com/angular/flex-layout/commit/605f4d1))



<a name="5.0.0-beta.13"></a>
# [5.0.0-beta.13](https://github.com/angular/flex-layout/compare/v2.0.0-beta.12...5.0.0-beta.13) (2018-02-22)

This **@angular/flex-layout** release provides full support for Angular 5.x

> This release bumps the version for parity with Angular Material and latest builds of Angular.

Angular SSR support has been fixed and is now enabled properly. Developers should see [Live Demo Docs](https://github.com/angular/flex-layout/blob/master/docs/documentation/Live-Demos.md) for details on how to build and test [locally] the demo applications. 

### Features

* **apps:** use Angular CLI to build demo and universal apps ([eda12c3](https://github.com/angular/flex-layout/commit/eda12c3))
* **ssr:** enhance support for Universal and SSR with stylesheets ([cf5266a](https://github.com/angular/flex-layout/commit/cf5266a)), closes [#373](https://github.com/angular/flex-layout/issues/373) [#567](https://github.com/angular/flex-layout/issues/567)

### Bug Fixes

* **css:** add prefixed values before standard ones ([0c1bf4a](https://github.com/angular/flex-layout/commit/0c1bf4a))
* **lib:** apply correct layout gaps based on flex order ([de72903](https://github.com/angular/flex-layout/commit/de72903)), closes [#608](https://github.com/angular/flex-layout/issues/608)
* **lib:** apply correct RTL margins ([7699957](https://github.com/angular/flex-layout/commit/7699957))
* **lib:** read correct styles during SSR and add test for layout-wrap ([71e2dae](https://github.com/angular/flex-layout/commit/71e2dae))
* **lib:** remove private Angular 'getDom()' APIs ([#402](https://github.com/angular/flex-layout/pull/402)) ([703add02ad](https://github.com/angular/flex-layout/commit/703add02ad)), closes [#547](https://github.com/angular/flex-layout/issues/547)
* **ssr:** add browser check for MatchMedia ([9dd03c6](https://github.com/angular/flex-layout/commit/9dd03c6)), closes [#624](https://github.com/angular/flex-layout/issues/624)

### Documentation Fixes

* **docs:** add Universal app changes to documentation ([1cf8a810](https://github.com/angular/flex-layout/commit/1cf8a810))
* **docs:** add ability to submit PRs for docs ([39c78be](https://github.com/angular/flex-layout/commit/39c78be)), closes [#550](https://github.com/angular/flex-layout/issues/550) [#520](https://github.com/angular/flex-layout/issues/520)
* **docs:** restore images within links ([d9edab8](https://github.com/angular/flex-layout/commit/d9edab8))

### BREAKING CHANGES

* **fxLayoutWrap:** * `[fxLayoutWrap]` was deprecated in earlier betas. fxLayoutWrap has now been removed. Developers should use `fxLayout` options.

*before* 

```html
<div  fxLayout="row" fxLayoutWrap="wrap"> ... </div>
```

*current* 

```html
<div  fxLayout="row wrap"> ... </div>
```


### Contributor(s)

To succeed in OSS, you have to get the community involved. Most of all, the developer community needs to contribute solutions, fixes, and enhancements to the project's growth.

Thank you to the contributors who helped with the v5.0.0-beta.13 release:


<table>
  <thead>
  <tr>
    <th align="center"><a href="https://github.com/CaerusKaru">
      <img alt="Splaktar" src="https://avatars3.githubusercontent.com/u/416563?v=4&amp;s=117" width="117" style="max-width:100%;">
      </a>
    </th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td align="center" class="annotated">
      <a href="https://github.com/CaerusKaru">
        <span>CaerusKaru</span>
      </a>
    </td>
  </tbody>
</table>


Adam has worked tirelessly on the design and implementation of the Flex Layout SSR solution, an improved docs experience, bug fixes, and so much more. How does he find the time? We try not to ask...



<a name="2.0.0-beta.12"></a>
# [2.0.0-beta.12](https://github.com/angular/flex-layout/compare/2.0.0-beta.11...2.0.0-beta.12) (2017-12-14)

The 2.0.0-beta.10 and beta.11 releases on npm accidentally glitched-out midway, so we resolved some release scripting issues and cut 2.0.0-beta.12 instead. oops :-)

### Build Changes

Similar to those used in **@angular/material**, this release also upgrades the package dependencies to Angular ~5.1.0 and the RxJS 5.5.x. 
>  [Pipeable RxJS operators](https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md) are now used instead of prototype-patching *add* operators. 

* **packages:** update deps to Angular v5 and RxJs 5.5 ([#523](https://github.com/angular/flex-layout/pull/523)) ([62457a5972](https://github.com/angular/flex-layout/commit/62457a5972)), closes [#519](https://github.com/angular/flex-layout/issues/519)


<a name="2.0.0-beta.11"></a>
# [2.0.0-beta.11](https://github.com/angular/flex-layout/compare/v2.0.0-beta.9...2.0.0-beta.11) (2017-11-05)

This release was just to fix an issue with npm `peerDependencies` not being set correctly.


<a name="2.0.0-beta.10"></a>
# [2.0.0-beta.10](https://github.com/angular/flex-layout/compare/v2.0.0-beta.8...2.0.0-beta.10) (2017-10-31)


### Bug Fixes

* **api:** defer getComputedStyle() calls until ngOnInit phase ([#374](https://github.com/angular/flex-layout/issues/374)) ([3611003](https://github.com/angular/flex-layout/commit/3611003)), closes [#310](https://github.com/angular/flex-layout/issues/310)
* **api:** layout with layoutAlign was not responding to reverse directions ([dde6e87](https://github.com/angular/flex-layout/commit/dde6e87)), closes [#82](https://github.com/angular/flex-layout/issues/82)
* **api:** remove circular dependencies ([7bff29e](https://github.com/angular/flex-layout/commit/7bff29e)), closes [#88](https://github.com/angular/flex-layout/issues/88)
* **api:** remove use of static ngModule.forRoot() ([#167](https://github.com/angular/flex-layout/issues/167)) ([86010bf](https://github.com/angular/flex-layout/commit/86010bf))
* **api:** restore orig display mode and more... ([#143](https://github.com/angular/flex-layout/issues/143)) ([d269d73](https://github.com/angular/flex-layout/commit/d269d73)), closes [#140](https://github.com/angular/flex-layout/issues/140) [#141](https://github.com/angular/flex-layout/issues/141)
* **api:** support query children on API directives ([#290](https://github.com/angular/flex-layout/issues/290)) ([f5558de](https://github.com/angular/flex-layout/commit/f5558de))
* **api:** use only Renderer2 instances ([#391](https://github.com/angular/flex-layout/issues/391)) ([816d85a](https://github.com/angular/flex-layout/commit/816d85a))
* **api, class:** fix valid ngClass usages ([db2fd59](https://github.com/angular/flex-layout/commit/db2fd59)), closes [#428](https://github.com/angular/flex-layout/issues/428)
* **api, class:** selector [class] should be removed from ClassDirective. ([#394](https://github.com/angular/flex-layout/issues/394)) ([7a48c25](https://github.com/angular/flex-layout/commit/7a48c25)), closes [#393](https://github.com/angular/flex-layout/issues/393)
* **api, class, style:** remove deprecated selectors ([#419](https://github.com/angular/flex-layout/issues/419)) ([e461d17](https://github.com/angular/flex-layout/commit/e461d17)), closes [#410](https://github.com/angular/flex-layout/issues/410) [#408](https://github.com/angular/flex-layout/issues/408) [#273](https://github.com/angular/flex-layout/issues/273) [#418](https://github.com/angular/flex-layout/issues/418)
* **auto-prefixer:** resolve perf impacts as reported by LightHouse ([#283](https://github.com/angular/flex-layout/issues/283)) ([bc0c900](https://github.com/angular/flex-layout/commit/bc0c900)), closes [#282](https://github.com/angular/flex-layout/issues/282)
* **breakpoints:** resolve 1px hole between lg -> xl breakpoints ([#159](https://github.com/angular/flex-layout/issues/159)) ([d78527c](https://github.com/angular/flex-layout/commit/d78527c)), closes [#149](https://github.com/angular/flex-layout/issues/149)
* **breakpoints:** support print media ([#367](https://github.com/angular/flex-layout/issues/367)) ([37a0b85](https://github.com/angular/flex-layout/commit/37a0b85)), closes [#361](https://github.com/angular/flex-layout/issues/361)
* **build:** add observable-media-service to exported barrel ([#139](https://github.com/angular/flex-layout/issues/139)) ([b7dffaa](https://github.com/angular/flex-layout/commit/b7dffaa))
* **build:** angular versions are not properly inserted ([e3b7fde](https://github.com/angular/flex-layout/commit/e3b7fde)), closes [#470](https://github.com/angular/flex-layout/issues/470)
* **build:** remove use of Angular private API ([#195](https://github.com/angular/flex-layout/issues/195)) ([d95cb09](https://github.com/angular/flex-layout/commit/d95cb09)), closes [#193](https://github.com/angular/flex-layout/issues/193)
* **build:** support Angular 4 and AOT ([#255](https://github.com/angular/flex-layout/issues/255)) ([fed87fa](https://github.com/angular/flex-layout/commit/fed87fa)), closes [#254](https://github.com/angular/flex-layout/issues/254) [#236](https://github.com/angular/flex-layout/issues/236) [#227](https://github.com/angular/flex-layout/issues/227)
* **changelog:** fix invalid parentheses and semver checks ([96aaa78](https://github.com/angular/flex-layout/commit/96aaa78))
* **closure-compiler:** use Number to cast ([#289](https://github.com/angular/flex-layout/issues/289)) ([052a4a9](https://github.com/angular/flex-layout/commit/052a4a9))
* **css:** add prefixed styles before standard ones ([99eabfb](https://github.com/angular/flex-layout/commit/99eabfb)), closes [#467](https://github.com/angular/flex-layout/issues/467) [#468](https://github.com/angular/flex-layout/issues/468)
* **demo:** correctly use template instead of templateUrl ([#100](https://github.com/angular/flex-layout/issues/100)) ([c436824](https://github.com/angular/flex-layout/commit/c436824))
* **demo:** fix bindings for fxLayout with AoT ([#101](https://github.com/angular/flex-layout/issues/101)) ([51ea29e](https://github.com/angular/flex-layout/commit/51ea29e))
* **demo:** import MdCheckboxModule ([5f198a3](https://github.com/angular/flex-layout/commit/5f198a3))
* **demo:** improve use of ObservableMedia service ([#214](https://github.com/angular/flex-layout/issues/214)) ([64b122a](https://github.com/angular/flex-layout/commit/64b122a))
* **demo, media-query-status:** should use async pipe with ObservableMedia ([0e7d2e0](https://github.com/angular/flex-layout/commit/0e7d2e0))
* **flex:** add min-width to elements with flex basis using px values ([3fe5ea3](https://github.com/angular/flex-layout/commit/3fe5ea3)), closes [#68](https://github.com/angular/flex-layout/issues/68)
* **flex:** fix use of values with 'auto' ([#122](https://github.com/angular/flex-layout/issues/122)) ([04d24d5](https://github.com/angular/flex-layout/commit/04d24d5)), closes [#120](https://github.com/angular/flex-layout/issues/120)
* **flexbox:** add default display property to getDisplayStyle() ([#301](https://github.com/angular/flex-layout/issues/301)) ([771f2c9](https://github.com/angular/flex-layout/commit/771f2c9))
* **flexbox:** resolve 'renderer.setStyle()' error ([#298](https://github.com/angular/flex-layout/issues/298)) ([3e1fcbd](https://github.com/angular/flex-layout/commit/3e1fcbd)), closes [#270](https://github.com/angular/flex-layout/issues/270)
* **flexbox:** scan flex-direction in css stylesheet ([#365](https://github.com/angular/flex-layout/issues/365)) ([635c4f5](https://github.com/angular/flex-layout/commit/635c4f5)), closes [#272](https://github.com/angular/flex-layout/issues/272) [#364](https://github.com/angular/flex-layout/issues/364)
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
* **fxLayoutGap:** update gap logic when num children reduces to 1. ([43b34fa](https://github.com/angular/flex-layout/commit/43b34fa)), closes [#433](https://github.com/angular/flex-layout/issues/433) [#444](https://github.com/angular/flex-layout/issues/444)
* **fxShow, fxHide:** support fxHide+fxShow usages on same element ([#190](https://github.com/angular/flex-layout/issues/190)) ([eee20b2](https://github.com/angular/flex-layout/commit/eee20b2))
* **fxStyle:** enable raw input caching ([#173](https://github.com/angular/flex-layout/issues/173)) ([d5b283c](https://github.com/angular/flex-layout/commit/d5b283c))
* **lib:** remove all uses of [@internal](https://github.com/internal) ([ca64760](https://github.com/angular/flex-layout/commit/ca64760))
* **lib, media-query:** support angular/universal ([#353](https://github.com/angular/flex-layout/issues/353)) ([0f13b14](https://github.com/angular/flex-layout/commit/0f13b14)), closes [#187](https://github.com/angular/flex-layout/issues/187) [#354](https://github.com/angular/flex-layout/issues/354) [#346](https://github.com/angular/flex-layout/issues/346)
* **matchMediaObservable:** expose observable for rxjs operators ([#133](https://github.com/angular/flex-layout/issues/133)) ([6e46561](https://github.com/angular/flex-layout/commit/6e46561)), closes [#125](https://github.com/angular/flex-layout/issues/125)
* **MatchMediaObservable:** register breakpoints so observable announces properly ([3555e14](https://github.com/angular/flex-layout/commit/3555e14)), closes [#65](https://github.com/angular/flex-layout/issues/65) [#64](https://github.com/angular/flex-layout/issues/64)
* **ngClass:** add ngClass selector support ([#223](https://github.com/angular/flex-layout/issues/223)) ([980d412](https://github.com/angular/flex-layout/commit/980d412)), closes [#206](https://github.com/angular/flex-layout/issues/206)
* **ngClass,ngStyle:** support proper API usages and ChangeDetectionStrategy.OnPush strategies ([#228](https://github.com/angular/flex-layout/issues/228)) ([5db01e7](https://github.com/angular/flex-layout/commit/5db01e7)), closes [#206](https://github.com/angular/flex-layout/issues/206) [#215](https://github.com/angular/flex-layout/issues/215)
* **ngStyle, ngClass:** StyleDirective security fixes &  merge activated styles ([#198](https://github.com/angular/flex-layout/issues/198)) ([eb22fe5](https://github.com/angular/flex-layout/commit/eb22fe5)), closes [#197](https://github.com/angular/flex-layout/issues/197)
* **observableMedia:** consistently emit initial value ([f19bff2](https://github.com/angular/flex-layout/commit/f19bff2))
* **ObservableMedia:** properly announce 'xs' activation at startup ([#396](https://github.com/angular/flex-layout/issues/396)) ([66f3717](https://github.com/angular/flex-layout/commit/66f3717)), closes [#388](https://github.com/angular/flex-layout/issues/388)
* **ObservableMedia:** provide consistent reporting of active breakpoint ([#186](https://github.com/angular/flex-layout/issues/186)) ([aa0dab4](https://github.com/angular/flex-layout/commit/aa0dab4)), closes [#185](https://github.com/angular/flex-layout/issues/185)
* **ObservableMedia:** startup should propagate lastReplay value properly ([#313](https://github.com/angular/flex-layout/issues/313)) ([00ac57a](https://github.com/angular/flex-layout/commit/00ac57a)), closes [#245](https://github.com/angular/flex-layout/issues/245) [#275](https://github.com/angular/flex-layout/issues/275) [#303](https://github.com/angular/flex-layout/issues/303)
* import specific symbols from rxjs ([#99](https://github.com/angular/flex-layout/issues/99)) ([88d1b0f](https://github.com/angular/flex-layout/commit/88d1b0f))
* **prefixer:** improve flex css prefixes ([#276](https://github.com/angular/flex-layout/issues/276)) ([beb5ed0](https://github.com/angular/flex-layout/commit/beb5ed0))
* **release:** fix checkout CHANGELOG.md from origin/master ([e17cdc1](https://github.com/angular/flex-layout/commit/e17cdc1))
* **release:** updates to commit to version changes: ([c2463a5](https://github.com/angular/flex-layout/commit/c2463a5))
* **test:** fix test for fxFlex='' ([fcf851f](https://github.com/angular/flex-layout/commit/fcf851f))
* **tests:** remove unneeded async() wrappers in karma tests ([a77de3c](https://github.com/angular/flex-layout/commit/a77de3c))
* **universal:** remove browser check from style-utils ([8dcae02](https://github.com/angular/flex-layout/commit/8dcae02)), closes [#466](https://github.com/angular/flex-layout/issues/466)


### Features

* **api:** add responsive API for img elements ([#382](https://github.com/angular/flex-layout/issues/382)) ([45cfd2e](https://github.com/angular/flex-layout/commit/45cfd2e)), closes [#366](https://github.com/angular/flex-layout/issues/366) [#376](https://github.com/angular/flex-layout/issues/376)
* **api:** add responsive API for img elements ([#384](https://github.com/angular/flex-layout/issues/384)) ([354f54f](https://github.com/angular/flex-layout/commit/354f54f)), closes [#366](https://github.com/angular/flex-layout/issues/366) [#81](https://github.com/angular/flex-layout/issues/81) [#376](https://github.com/angular/flex-layout/issues/376)
* **flexbox:** use protected access to allow API directives to be easily extended ([#163](https://github.com/angular/flex-layout/issues/163)) ([e6bc451](https://github.com/angular/flex-layout/commit/e6bc451))
* **fxFlex:** compute immediate parent flex-direction ([#220](https://github.com/angular/flex-layout/issues/220)) ([ba0d85d](https://github.com/angular/flex-layout/commit/ba0d85d))
* **layout:** add wrap options support to fxLayout ([#207](https://github.com/angular/flex-layout/issues/207)) ([2340a19](https://github.com/angular/flex-layout/commit/2340a19))
* **ObservableMedia:** use ObservableMedia class as provider token ([#158](https://github.com/angular/flex-layout/issues/158)) ([dad69fe](https://github.com/angular/flex-layout/commit/dad69fe))


### BREAKING CHANGES

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
* **ObservableMedia:** Deprecated use of `ObservableMediaService` opaque token. Developers now simply use the ObservableMedia class to inject the service.

*before*

```js
constructor( @Inject(ObserverableMediaService) private media:any ) { ... }
```

**after**
```js
constructor(private media:ObservableMedia) { ... }
```
* **matchMediaObservable:** * use opaque token `ObservableMediateService` to inject instance of `MediaService`
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
