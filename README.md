# Flex Layout

Angular Flex Layout provides a sophisticated layout API using FlexBox CSS + mediaQuery. This module provides Angular (v2.x and higher) developers with component layout features using a custom Layout API, mediaQuery observables,and injected DOM flexbox-2016 css stylings.  

The Layout engine intelligently automates the process of applying appropriate FlexBox CSS to browser view hierarchies. This automation also addresses many of the complexities and workarounds encountered with the traditional, manual, CSS-only application of Flexbox CSS. 

![css3-flexbox-model](https://cloud.githubusercontent.com/assets/210413/20034148/49a4fb62-a382-11e6-9822-42b90dec69be.jpg)


The Angular Flexbox Layout features enable developers to organize UI page elements in row and column structures with 
alignments, resizing, and padding. These layouts can be nested and easily used with hierarchical DOM structures. 
Since the Layout applies/injects **Flexbox CSS**, DOM elements will fluidly update their positioning and sizes as the  viewport size changes. 

```html
<div class="flex-container" fx-layout="row" fx-layout-align="center center">
  <div class="flex-item"></div>
  <div class="flex-item"></div>
  <div class="flex-item"></div>
</div> 
```
> The above Flex Layout usages do not require any external stylesheets nor any custom CSS programming. The Angular directives do all the work of *magically* setting the flexbox css.

Integrating **mediaQuery** features into the Layout engine enables the API to be **Responsive**: DOM elements can adjust 
layout-directions, visibility, and sizing constraints based on specific viewport sizes such as desktop or mobile devices. 

Angular Flex Layout is a pure-Typescript Layout engine; unlike the pure CSS-only implementations published in other Flexbox libraries   and the JS+CSS implementation of Angular Material v1.x Layouts. 

*  This implementation of Flex Layouts is independent of Angular Material (v1 or v2).
*  This implementation is currently only available for Angular applications.

<br/>

----

### Useful Resources

*  [Flex-Layout Wiki](https://github.com/angular/flex-layout/wiki/Code-reviews)
*  [Getting Started](https://github.com/angular/flex-layout/wiki/Developer-Guide)
*  [Fast Start with Local Builds](https://github.com/angular/flex-layout/wiki/Fast-Start-with-Local-Builds)
*  [Using Flex-Layout with Angular CLI](https://github.com/angular/flex-layout/wiki/Integration-with-Angular-CLI)
*  [Live Demos](https://tburleson-layouts-demos.firebaseapp.com/)
*  [Demo Source Code](https://github.com/angular/flex-layout/blob/master/src/demo-app/app/demo-app-module.ts)

----

<br/>


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


