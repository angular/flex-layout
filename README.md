# Angular Material's Layout Engine

This project represents the **re-architecture** of Angular Material's Layout flexbox features as a pure JS-only engine.

#### Summary

Angular Material's Layout features were purposed to provide syntactic ng sugar and allow developers to easily and intuitively create responsive and adaptive layouts. The public api is a simply list of HTML attributes that can be use on HTML containers and elements:

| HTML Markup API | Allowed values (raw or interpolated) |
|-----------------|----------------------------------------------------------------------------|
|  layout         | `row` , `column`                                                          |                  
|  flex           | "" , px , %                                                              |              
|  flex-order     | int                                                                        |                       
|  flex-offset    | px                                                                         |     
|  layout-fill    |                                                                            |
|  layout-wrap    |                                                                            |                   
|  layout-nowrap  |                                                                            |                   
|  layout-margin  | px , %                                                                    |                           
|  layout-padding | px , %                                                                    |        
|  layout-align   | `start|center|end|stretch|space-around` `start|center|end|stretch|baseline`|                   
|  show           | "" , `true` , `1`                                                        | 
|  hide           | "" , `true` , `1`                                                        | 

<br/>

The above API can be easily enhanced to support Responsive breakpoints as specified in Material Design:

![](http://material-design.storage.googleapis.com/publish/material_v_4/material_ext_publish/0B8olV15J7abPSGFxemFiQVRtb1k/layout_adaptive_breakpoints_01.png)

<br/>

Based on the above specifications, the Layout engine has defined the breakpoint alias that can be used as suffix extensions to the Layout API. Here are the [suffix aliases] and their associated breakpoint mediaQuery definitions:

| breakpoint | mediaQuery |
|--------|--------|
| ""    | `screen`                                                |
| xs    | `screen and (max-width: 479px)`                         |
| gt-xs | `screen and (min-width: 480px)`                         |
| sm    | `screen and (max-width: 599px)`                         |
| gt-sm | `screen and (min-width: 600px)`                         |
| md    | `screen and (min-width: 600px) and (max-width: 959px)`  |
| gt-md | `screen and (min-width: 960px)`                         |
| lg    | `screen and (min-width: 960px) and (max-width: 1279px)` |
| gt-lg | `screen and (min-width: 1280px)`                        |
| xl    | `screen and (min-width: 1280px) and (max-width: 1919px)`|
| gt-xl | `screen and (min-width: 1920px)`                        |
                      
<br/>

Below is an example usage of the Responsive Layout API:

```html
<div layout='column' class="zero">
  <div flex="33" flex-md="{{ vm.box1Width }}" class="one" ></div>
  <div flex="33" layout="{{ vm.direction }}" layout-md="row" class="two">
    <div flex="22"   flex-md="10" hide-lg                         class="two_one"></div>
    <div flex="30px" show hide-md="{{ vm.hideBox }}" flex-md="25" class="two_two"></div>
    <div flex="20"   flex-md="65"                                 class="two_three"></div>
  </div>
<div flex class="three"></div>
```

---

#### Gen1 Implementation 

Early versions used both complex SCSS rules and JS directives to dynamically map Layout DOM attributes/markup to equivalent CSS classNames... and inject those classNames into the DOM element class list. A separate SCSS file contained complex rules and nestings with `for-loops`; all to build CSS for the expected mediaQuery breakpoints and possible layout values:

```scss
@mixin flex-properties-for-name($name: null) {
  $flexName: 'flex';
  @if $name != null {
    $flexName: 'flex-#{$name}';
    $name : '-#{$name}';
  } @else {
    $name : '';
  }

  .#{$flexName}             { flex: 1;         box-sizing: border-box; }  // === flex: 1 1 0%;
  .#{$flexName}-grow        { flex: 1 1 100%;  box-sizing: border-box; }
  .#{$flexName}-initial     { flex: 0 1 auto;  box-sizing: border-box; }
  .#{$flexName}-auto        { flex: 1 1 auto;  box-sizing: border-box; }
  .#{$flexName}-none        { flex: 0 0 auto;  box-sizing: border-box; }

  // (1-20) * 5 = 0-100%
  @for $i from 0 through 20 {
    $value : #{$i * 5 + '%'};

    .#{$flexName}-#{$i * 5} {
      flex: 1 1 #{$value};
      max-width: #{$value};
      max-height: 100%;
      box-sizing: border-box;
    }

    .layout-row > .#{$flexName}-#{$i * 5},
    .layout#{$name}-row > .#{$flexName}-#{$i * 5} {
      flex: 1 1 #{$value};
      max-width: #{$value};
      max-height: 100%;
      box-sizing: border-box;
    }

    .layout-column > .#{$flexName}-#{$i * 5},
    .layout#{$name}-column > .#{$flexName}-#{$i * 5} {
      flex: 1 1 #{$value};
      max-width: 100%;
      max-height: #{$value};
      box-sizing: border-box;
    }
  }
}
```
> Additionally, CSS specificity rules required large quantities of NON-trivial Layout CSS styles.

This approach suffers from many issues:

*  Conversion of layout attributes to classnames
*  Large filesizes for the generated, external stylesheets (170K unminified)
*  CSS specificity rules impact Layout CSS and sometimes produces unexpected results
*  The CSS rules are limited to Layout values of 0 - 100 in increments of 5
*  Breakpoints are hard-coded and very difficult to modify

--- 

#### Gen2 Implementation

The revised architecture for Layouts eliminates `all` external stylesheets and SCSS files. This is a pure-JS Layout engine that is both independent of Angular Material and easily used within ngMaterial.

Layout directives are used to create Layout injectors; which inject specific flexbox css directly to the DOM element. For example, consider the use of the `layout="row"` and `layout-align="center center"` directives.

Static Markup:

```html
<div layout="{{vm.direction}}" layout-align="center center">
	<div>one</div>
	<div>two</div>
	<div>three</div>
</div>
```

is transformed to Dynamic styles:

```html
<div layout="row" layout-align="center center"
      style="display: flex; flex-direction: row; max-width: 100%; box-sizing: border-box; justify-content: center; align-content: center; align-items: center;">
  <div style="max-width: 100%; box-sizing: border-box;">one</div>
  <div style="max-width: 100%; box-sizing: border-box;">two</div>
  <div style="max-width: 100%; box-sizing: border-box;">three</div>
</div>
```

#### Demos

The **[http://material.angularjs.org](https://material.angularjs.org/latest/layout/grid)** Layout demos are also included here to quickly demonstrate matching functionality (and more) when using the Gen2 implementation.

![demos2](https://cloud.githubusercontent.com/assets/210413/11286935/cc5b325c-8edd-11e5-9723-f866ec69fd97.jpg)



#### Advantages

Not only is the codebase easier to maintain and debug, other more important benefits have been realized:

*  No external CSS requirements
*  Support for modified/additional breakpoints
*  Notifications for breakpoints changes
*  Support (future) for Handset/Tablet and Orientation breakpoints
*  Support for **ANY** Layout injector value (instead of increments for 5)
*  Watchers for Layout injector values
*  Support for raw values or interpolated values
*  Support for raw, percentage or px-suffix values

>  The code has been initially implemented with es6 and JSPM. A trans-compile process will be used to generate es5 versions and subsequent modifications will allow those files to be compiled into a `material.layout` module.

>  Efforts in 2016 will focus on quickly converting the es6 codebase to TypeScript; which may become the master version used for both ngMaterial v1.x and v2.x

#### Adaptive Layouts (future)

Different from responsive layouts where components change sizes and positions, the concepts of Adaptive layouts provide for UX where  **different components** may be used for different breakpoints. 

The Gen2 engine here uses a MediaQueryWatcher in a Publish/Subcribe architecture. Layout injectors use an adaptor to subscribe to breakpoint change notifications. This subscription pattern can be extended to easily support breakpoint notifications to trigger Adaptive UX changes.
