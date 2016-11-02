# Angular Layouts

Angular Layouts provides a sophisticated layout API using FlexBox CSS + mediaQuery. This module provides Angular 
developers with component layout features using a custom Layout API, mediaQuery observables,and injected DOM 
flexbox-2016 css stylings.  

*  This implementation of Angular Layouts is independent of Angular Material (v1 or v2).
*  This implementation is currently only available for Angular applications.

The Flexbox Layout features enable developers to organize UI page elements in row and column structures with 
alignments, resizing, and padding. These layouts can be nested and easily used with hierarchical DOM structures. 
Since the Layout applies/injects **Flexbox CSS**, DOM layout will fluidly update is positioning and sizes as the 
viewport size changes.


Integrating **mediaQuery** features into the Layout engine enables the API to be responsive: DOM elements can adjust 
layout-directions, visibility, and sizing constraints based on specific viewport sizes such as desktop or mobile devices. 

----

### Live Layout Demos

![layoutdemos](https://cloud.githubusercontent.com/assets/210413/19868966/511c8eea-9f78-11e6-9692-7a23f399b502.jpg)


These static and responsive Layout Demos are based on real samples used in:

*  Layout Documentation (Angular Material v1.x)
*  GitHub Issuses
*  StackOverflow Issues
*  CodePen Issues


Use the following Terminal command(s) to start the WebPack server and launch the demo application with its 
non-responsive and responsive demos:

```
npm install
npm run start 
```

----

### Fast Start

Developers can easily install this `@angular/layouts` library using **npm** (pending feature):

```console
npm install @angular/layouts -save
```


> Note: This ^ feature is pending public release of the Github repository!


---

#### Build Instructions


Use Gulp and Rollup to build a UMD `layouts.umd.js`:

```console
gulp build:components
```

To use the bundle and the required, external AngularJS framework:

```html
<script src="/dist/@angular/layouts/layouts.umd.js"></script>


```

<br/>


----

#### Application Usages
In their application module, developers import the global Layout API directives (as shown below): 

```ts
// demo-app-module.ts

import { AngularLayouts } from '@angular/layouts';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule, HttpModule, 
    AngularLayouts.forRoot(),           // import dependency on ng2 Layouts
  ], 
)}
export class DemoAppModule { }
```

In their component templates, developers easily use the Layout API to build
complex, dynamic layouts:

```html
<div fl-layout="row">
  <div [fl-layout]="firstCol" [fl-flex]="firstColWidth" >
    <div fl-flex="27%"> First item in row  </div>
    <div fl-flex      > Second item in row </div>
  </div>
  <div [fl-layout]="secondCol" flex >
    <div fl-flex       > First item in column  </div>
    <div fl-flex="33px"> Second item in column </div>
  </div>
</div>
``` 

----

### API Overview

The Angular Layout features provide smart, syntactic directives to allow developers to easily and intuitively create 
responsive and adaptive layouts using Flexbox CSS. The public **Layout API** is a simply list of HTML attributes that 
can be used on HTML containers and elements:

| HTML Markup API | Allowed values (raw or interpolated) |
|-----------------|----------------------------------------------------------------------------|
|  fl-layout         | `row | column | row-reverse | column-reverse`                                                          |                  
|  fl-layout-wrap    | `"" | wrap | none | nowrap | reverse`                                     |                   
|  fl-layout-align   | `start|center|end|space-around|space-between` `start|center|end|stretch`|                   
|  fl-flex           | "" , px , %                                                              |              
|  fl-flex-fill      |                                                                            |
|  fl-flex-order     | int                                                                        |                       
|  fl-flex-offset    | %, px                                                                         |     
|  fl-flex-align     | `start|baseline|center|end` |                   

Static Markup Example:

```html
<div fl-layout='column' class="zero">

  <div fl-flex="33" class="one" ></div>
  <div fl-flex="33" [fl-layout]="direction" class="two">

    <div fl-flex="22"    class="two_one"></div>
    <div fl-flex="205"   class="two_two"></div>
    <div fl-flex="30px"  class="two_three"></div>

  </div>
  <div fl-flex class="three"></div>

</div>
```

### Responsive Features

And if we use Breakpoints as specified by Material Design:

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
simple markup convention: the `alias` is used as suffix extensions to the Layout API:

```html
<api>.<breakpoint alias>='<value>'
```

Below is an example usage of the Responsive Layout API:

```html
<div fl-layout='column' class="zero">

  <div fl-flex="33" [fl-flex.md]="box1Width" class="one" ></div>
  <div fl-flex="33" [fl-layout]="direction" layout.md="row" class="two">

    <div fl-flex="22"    fl-flex.md="10px" hide.lg                       class="two_one"></div>
    <div fl-flex="205"   fl-flex.md="65"                                 class="two_two"></div>
    <div fl-flex="30px"  [fl-show hide.md]="hideBox" fl-flex.md="25"     class="two_three"></div>

  </div>
  <div fl-flex class="three"></div>

</div>
```

----

#### Implementation

The Angular 2 architecture for Layouts eliminates `all` external Flexbox stylesheets and SCSS files formerly used 
in the Angular Material 1 Layout implementations.  This is pure typescript- Angular Layout engine that is 
independent of Angular Material yet can be used easily within any Material 2 application.

The Layout API directives are used to create DOM element style injectors which inject specific, custom Flexbox 
CSS directly as inline styles onto the DOM element. 

For example, consider the use of the `fl-layout="row"` and `fl-layout-align="center center"` directives.

Static Markup:

```html
<div [fl-layout]="direction" fl-layout-align="center center">
  <div>one</div>
  <div>two</div>
  <div>three</div>
</div>
```

is transformed with inline, injected styles:

```html
<div fl-layout="row" fl-layout-align="center center"
      style="display: flex; flex-direction: row; max-width: 100%; box-sizing: border-box; justify-content: center; align-content: center; align-items: center;">
  <div>one</div>
  <div>two</div>
  <div>three</div>
</div>
```


![ng2layouts_classdiagram](https://cloud.githubusercontent.com/assets/210413/19878402/04fc9e40-9fb6-11e6-9bd7-86a65862a334.png)


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

#### Adaptive Layouts (future)

Different from responsive layouts where components change sizes and positions, the concepts of Adaptive layouts 
provide for UX where  **different components** may be used for different breakpoints. 

Animations can also be extended to support MediaQuery activations: different animations will run for different viewport sizes.


  
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
