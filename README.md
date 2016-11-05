# Flex Layout

Angular Flex Layout provides a sophisticated layout API using FlexBox CSS + mediaQuery. This module provides Angular 
developers with component layout features using a custom Layout API, mediaQuery observables,and injected DOM 
flexbox-2016 css stylings.  

The Layout engine intelligently automates the process of applying appropriate FlexBox CSS to browser view hierarchies. This automation also addresses many of the complexities and workarounds encountered with the traditional, manual, CSS-only application of Flexbox CSS. 

![css3-flexbox-model](https://cloud.githubusercontent.com/assets/210413/20034148/49a4fb62-a382-11e6-9822-42b90dec69be.jpg)


The Flexbox Layout features enable developers to organize UI page elements in row and column structures with 
alignments, resizing, and padding. These layouts can be nested and easily used with hierarchical DOM structures. 
Since the Layout applies/injects **Flexbox CSS**, DOM elements will fluidly update their positioning and sizes as the  viewport size changes.


Integrating **mediaQuery** features into the Layout engine enables the API to be **Responsive**: DOM elements can adjust 
layout-directions, visibility, and sizing constraints based on specific viewport sizes such as desktop or mobile devices. 

Angular Flex Layout is a pure-Typescript Layout engine; unlike the pure CSS-only implementations published in other Flexbox libraries   and the JS+CSS implementation of Angular Material v1.x Layouts. 

*  This implementation of Flex Layouts is independent of Angular Material (v1 or v2).
*  This implementation is currently only available for Angular applications.
----

### Background

The primary idea behind the flex layout is to give the HTML DOM containers the ability to alter its items' width/height (and order) to best fill the available space to accommodate all kind of display devices and screen sizes. A flex container expands items to fill available free space, or shrinks them to prevent overflow.


Most importantly, the flexbox layout is direction-agnostic as opposed to the regular layouts (block which is vertically-based and inline which is horizontally-based). While those work well for pages, they lack flexibility to support large or complex applications: especially when it comes to orientation changing, resizing, stretching, shrinking, etc.  Especially important are flex features that resize elements to intelligently fill available spaces. Developers can also combine the Flexbox API with CSS media queries in order to support responsive layouts. e.g.


<a href="" target="_blank">
![screen shot 2016-11-05 at 7 24 42 am](https://cloud.githubusercontent.com/assets/210413/20029960/fbbc0e62-a328-11e6-8045-c6532affc857.png)
</a>


Unfortunately, developers manually implementing Flexbox CSS must become experts at both the syntax and the workarounds to accommodate browser-specific differences in Flexbox runtime support.

Below are examples of a Material-Adaptive applications using Angular 1 and Flexbox CSS for responsive, adaptive application layouts.

![screen shot 2016-11-05 at 7 26 56 am](https://cloud.githubusercontent.com/assets/210413/20029970/44c16d64-a329-11e6-9a9a-bd00561ea936.png)

These current approaches demonstrate additional feature ideas that should be considered for the FLE:  

*  Metadata configuration
*  Distinct responsive engine (MQL with adapters)
*  Subscription process for adaptive notifications to trigger custom Layout processes


----

### Live Layout Demos

Real-world usages of Layouts (both static and responsive) are available on the [Flex-Layout Demos](https://tburleson-layouts-demos.firebaseapp.com/#/responsive) site. The samples available are curated from the following sources:

*  Layout Documentation (Angular Material v1.x)
*  GitHub Issuses
*  StackOverflow Issues
*  CodePen Issues

![layoutdemos](https://cloud.githubusercontent.com/assets/210413/19868966/511c8eea-9f78-11e6-9692-7a23f399b502.jpg)


Use the following Terminal command(s) to start the WebPack server and launch the demo application with its 
non-responsive and responsive demos:

```
npm install -g yarn
yarn install
gulp build:components
npm run start 
```

----

### Fast Start

Developers can easily install this `@angular/flex-layout` library using **npm** (pending feature):

```console
npm install @angular/flex-layout -save
```


> Note: This ^ feature is pending public release of the Github repository!


---

#### Build Instructions


Use Gulp and Rollup to build a UMD `flex-layout.umd.js`:

```console
gulp build:release
```

To use the bundle and the required, external AngularJS framework:

```html
<script src="/dist/@angular/flex-layout/flex-layout.umd.js"></script>


```

<br/>


----

#### Application Usages
In their application module, developers import the global Layout API directives (as shown below): 

```ts
// demo-app-module.ts

import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    BrowserModule, CommonModule, FormsModule, HttpModule,  // import ng2 core modules
    FlexLayoutModule.forRoot(),                            // import dependency on Flex-Layout
  ], 
)}
export class DemoAppModule { }
```

In their component templates, developers easily use the Layout API to build
complex, dynamic layouts:

```html
<div fx-layout="row">
  <div [fx-layout]="firstCol" [fx-flex]="firstColWidth" >
    <div fx-flex="27%"> First item in row  </div>
    <div fx-flex      > Second item in row </div>
  </div>
  <div [fx-layout]="secondCol" flex >
    <div fx-flex       > First item in column  </div>
    <div fx-flex="33px"> Second item in column </div>
  </div>
</div>
``` 

----

### API Overview

The Flex Layout features provide smart, syntactic directives to allow developers to easily and intuitively create 
responsive and adaptive layouts using Flexbox CSS. The public **Layout API** is a simply list of HTML attributes that 
can be used on HTML containers and elements:

| HTML Markup API    | Allowed values (raw or interpolated)                                    |
|--------------------|-------------------------------------------------------------------------|
|  fx-layout         | `row | column | row-reverse | column-reverse`                           |                  
|  fx-layout-wrap    | `"" | wrap | none | nowrap | reverse`                                   |                   
|  fx-layout-align   | `start|center|end|space-around|space-between` `start|center|end|stretch`|                   
|  fx-flex           | "" , px , %                                                             |              
|  fx-flex-fill      |                                                                         |
|  fx-flex-order     | int                                                                     |                       
|  fx-flex-offset    | %, px                                                                   |     
|  fx-flex-align     | `start|baseline|center|end`                                             |                   

Static Markup Example:

```html
<div fx-layout='column' class="zero">

  <div fx-flex="33"                          class="one" ></div>
  <div fx-flex="33%" [fx-layout]="direction" class="two">

    <div fx-flex="22%"    class="two_one"></div>
    <div fx-flex="205px"  class="two_two"></div>
    <div fx-flex="30"     class="two_three"></div>

  </div>
  <div fx-flex class="three"></div>

</div>
```
Flex Layout directives **assign CSS styles** directly in-line to the host element. These in-line styles override inherited styles, **ShadowDOM** styles and even ShadowDOM tree stylings on the element  `:host`

### Responsive Features

To extend the static API with responsive features, we first associate specific breakpoint aliases with mediaQuery values. And if we use Breakpoints as specified by Material Design:

![](http://material-design.storage.googleapis.com/publish/material_v_4/material_ext_publish/0B8olV15J7abPSGFxemFiQVRtb1k/layout_adaptive_breakpoints_01.png)

<br/>

We can associate breakpoints with mediaQuery definitions using breakpoint **alias(es)**:

| breakpoint | mediaQuery |
|--------|--------|
| ""    | 'screen'                                                |
| xs    | 'screen and (max-width: 599px)'                         |
| gt-xs | 'screen and (min-width: 600px)'                         |
| sm    | 'screen and (min-width: 600px) and (max-width: 959px)'  |
| gt-sm | 'screen and (min-width: 960px)'                         |
| md    | 'screen and (min-width: 960px) and (max-width: 1279px)' |
| gt-md | 'screen and (min-width: 1280px)'                        |
| lg    | 'screen and (min-width: 1280px) and (max-width: 1919px)'|
| gt-lg | 'screen and (min-width: 1920px)'                        |
| xl    | 'screen and (min-width: 1920px)'                        |
<br/>

If we combine the breakpoint `alias` with the Layout API we can easily support Responsive breakpoints with a 
simple markup convention: the `alias` is used as **suffix** extensions to the Layout API:

```html
<api>.<breakpoint alias>='<value>'
```

Below is an example usage of the Responsive Layout API:

```html
<div fx-layout='column' class="zero">

  <div fx-flex="33" [fx-flex.md]="box1Width" class="one" ></div>
  <div fx-flex="33" [fx-layout]="direction" layout.md="row" class="two">

    <div fx-flex="22"    fx-flex.md="10px" fx-hide.lg                       class="two_one"></div>
    <div fx-flex="205"   fx-flex.md="65"                                    class="two_two"></div>
    <div fx-flex="30px"  fx-flex.md="25"   fx-show [fx-hide.md]="hideBox"   class="two_three"></div>

  </div>
  <div fx-flex class="three"></div>

</div>
```

In the markup above the layout directives use both static values and expression bindings; where the values are expressed as raw, percentage, or pixel values.

----

#### Implementation

The Angular 2 architecture for Layouts eliminates `all` external Flexbox stylesheets and SCSS files formerly used 
in the Angular Material 1 Layout implementations.  This is pure typescript- Angular Layout engine that is 
independent of Angular Material yet can be used easily within any Material 2 application.

The Layout API directives are used to create DOM element style injectors which inject specific, custom Flexbox 
CSS directly as inline styles onto the DOM element. 

For example, consider the use of the `fx-layout="row"` and `fx-layout-align="center center"` directives.

Static Markup:

```html
<div [fx-layout]="direction" fx-layout-align="center center">
  <div>one</div>
  <div>two</div>
  <div>three</div>
</div>
```

is transformed with inline, injected styles:

```html
<div fx-layout="row" fx-layout-align="center center"
      style="display: flex; flex-direction: row; max-width: 100%; box-sizing: border-box; justify-content: center; align-content: center; align-items: center;">
  <div>one</div>
  <div>two</div>
  <div>three</div>
</div>
```


![ng2layouts_classdiagram](https://cloud.githubusercontent.com/assets/210413/19878402/04fc9e40-9fb6-11e6-9bd7-86a65862a334.png)


----

#### Adaptive Layouts (future)

Different from responsive layouts where components change sizes and positions, the concepts of Adaptive layouts 
provide for UX where  **different components** may be used for different breakpoints. 

Animations can also be extended to support MediaQuery activations: different animations will run for different viewport sizes.

Developers can use the following:

*  `fx-hide`
*  `fx-show`
*  `ngIf`

> This will be documented more before release 1.
  
----


#### Summary

Compared to the Layout API in Angular Material v1.x, this codebase easier to maintain and debug, other more important benefits have been realized:

*  Independent of Angular Material 
*  No external CSS requirements
*  Use provider to supply custom breakpoints
*  Notifications for breakpoints changes
  *  Includes workaround for MediaQuery issues with **overlapping** breakpoints
*  Support (future) for Handset/Tablet and Orientation breakpoints
*  Support for **ANY** Layout injector value (instead of increments for 5)
*  Change detection for Layout injector values
*  MediaQuery Activation detection 
*  Support for raw values or interpolated values
*  Support for raw, percentage or px-suffix values

<br/>

----

### User stories 

These user-stories will be detailed in a separate design doc (pending). The current implementation, however, provides 
features/solutions for all user stories. 

##### Non-responsive Use Cases:

*  Layout elements in rows
*  Layout elements in columns
*  Nested containers should have isolated layout constraints
*  Adjust container children sizes (flex) based on static percentages
*  Adjust container children sizes (flex) based on static pixel values
*  Adjust container children sizes (flex) based on expressions
*  Adjust alignment of container children based on static/dynamic values
*  Adjust offset of container children based on static/dynamic values
*  Adjust ordering of container children based on static/dynamic values
*  Container children resizing (flex) is dependent upon container layout directions (layout)
*  Changes in Layout directives will update nested Flex children 

##### Responsive API Use Cases:

* Change Detection: `ngOnChanges` due to Layout attribute expressions only trigger for defined activated breakpoints or used as fallback
  *  Input changes are filtered so the default input key is used if the activation key is not defined
  *  Input changes are filtered so only the current activated input change will trigger an update
* Activations: when the mediaQuery becomes active
  *  mq Activation only uses expressions for the activated breakpoint 
  *  mq Activation fallback to use to non-responsive expressions (fallback) if no breakpoint defined
* Subscription notifications: using **OnMediaQueryChanges**
  *  Components implementing `OnMediaQueryChanges` will be notified for each activation  (pending)
  *  `ngOnMediaQueryChanges()` uses **MediaQueryChanges** event arguments
  *  `MediaQueryChanges` will contain the previous activation (and expression value) and the current
* Querying: for imperative or template logic 
  *  Components can use `MediaQueries::observe()` to subscribe to all activations [for imperative actions]
  *  Component templates can use `$mdMedia.isActive(<query_alias>)`
* Breakpoint Customization:
  * Custom set of breakpoints can be defined as a Provider
  * Custom breakpoints will override ALL default breakpoints (no merging)
  

----
