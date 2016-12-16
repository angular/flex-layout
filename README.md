# Flex Layout

Angular Flex Layout provides a sophisticated layout API using FlexBox CSS + mediaQuery. This module provides Angular (v2.x and higher) developers with component layout features using a custom Layout API, mediaQuery observables,and injected DOM flexbox-2016 css stylings.  

The Layout engine intelligently automates the process of applying appropriate FlexBox CSS to browser view hierarchies. This automation also addresses many of the complexities and workarounds encountered with the traditional, manual, CSS-only application of Flexbox CSS. 

![css3-flexbox-model](https://cloud.githubusercontent.com/assets/210413/20034148/49a4fb62-a382-11e6-9822-42b90dec69be.jpg)

### How it works!

The Angular Flexbox Layout features enable developers to organize UI page elements in row and column structures with 
alignments, resizing, and padding. These layouts can be nested and easily used within hierarchical DOM structures.

The Layout API is simply attributes on your HTML elements. That is it! All the magic of apply the Flexbox CSS is handled under-the-hood.
 
The Layout applies/injects **Flexbox CSS** to each DOM element... and your layout and elements will fluidly update their positioning and sizes as the  viewport size changes. 

```html
<div class="flex-container" fx-layout="row" fx-layout-align="center center">
  <div class="flex-item" fx-flex="20%">  </div>
  <div class="flex-item" fx-flex>        </div>
  <div class="flex-item" fx-flex="25px"> </div>
</div> 
```
> The above Flex Layout usages do not require any external stylesheets nor any custom CSS programming. The Angular directives do all the work of *magically* setting the flexbox css.

Integrating **mediaQuery** features into the Layout engine enables the API to be **Responsive**. 

Responsive layouts have multiple layout configurations. The same show above defines default, non-responsive flows and sizing. 
Responsive layouts add extra configurations that override the default configurations. These overrides will be applied dynamically
when the viewport size changes to match a specific *responsive override*.

Show below is an HTML sample with both default configurations and *mobile* responsive overrides:



```html
<div class="flex-container" 
     fx-layout="row" 
     fx-layout.xs="column"
     fx-layout-align="center center"
     fx-layout-align.xs="start">
  <div class="flex-item" fx-flex="20%" fx-flex.xs="40%">  </div>
  <div class="flex-item" fx-flex>        </div>
  <div class="flex-item" fx-flex="25px"> </div>
</div> 
```
   
With Responsive configurations, DOM elements can be adjusted for layout-directions, visibility, and sizing constraints based on 
specific viewport sizes (desktop or mobile devices) and orientations (portrait or landscape). 

> Of course, these configuration can be specified in CSS. Flex-Layout, however, makes it super easy
and intuitive to specify these configurations as HTML attributes.
 
### Why choose Flex-Layout

While other Flexbox CSS libraries are implementations of:

* pure CSS-only implementations, or 
* the JS+CSS implementation of Angular Material v1.x Layouts.

Angular Flex Layout - in contrast - is a pure-Typescript UI Layout engine with an implementation that: 

*  uses HTML attributes (aka Layout API) to specify the layout configurations
*  is currently only available for Angular (v2.x or higher) Applications.
*  is independent of Angular Material (v1 or v2).

<br/>

----

### Useful Resources

*  [Flex-Layout Wiki](https://github.com/angular/flex-layout/wiki)
*  [Getting Started](https://github.com/angular/flex-layout/wiki/Developer-Guide)
*  [Fast Start with Local Builds](https://github.com/angular/flex-layout/wiki/Fast-Start-with-Local-Builds)
*  [Using Flex-Layout with Angular CLI](https://github.com/angular/flex-layout/wiki/Integration-with-Angular-CLI)
*  [Live Demos](https://tburleson-layouts-demos.firebaseapp.com/)
*  [Demo Source Code](https://github.com/angular/flex-layout/blob/master/src/demo-app/app/demo-app-module.ts)

----

<br/>

### Advantages 

Compared to the Layout API in Angular Material v1.x, this codebase is easier to maintain and debug.
And other more important benefits have also been realized:

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


