# Flex Layout  

[![npm version](https://badge.fury.io/js/%40angular%2Fflex-layout.svg)](https://www.npmjs.com/package/%40angular%2Fflex-layout)
[![Build Status](https://travis-ci.org/angular/flex-layout.svg?branch=master)](https://travis-ci.org/angular/flex-layout)
[![Gitter](https://badges.gitter.im/angular/flex-layout.svg)](https://gitter.im/angular/flex-layout)

Angular Flex Layout provides a sophisticated layout API using FlexBox CSS + mediaQuery. 
This module provides Angular (v2.4.3 and higher) developers with component layout features using a 
custom Layout API, mediaQuery observables,and injected DOM flexbox-2016 css stylings.  

The Flex Layout engine intelligently automates the process of applying appropriate 
Flexbox CSS to browser view hierarchies. This automation also addresses many of the 
complexities and workarounds encountered with the traditional, manual, CSS-only application of box CSS. 

The **real** power of Flex Layout, however, is its **responsive** engine. The [Responsive API](https://github.com/angular/flex-layout/wiki/Responsive-API) enables developers to easily specify different layouts, sizing, visibilities for different viewport sizes and display devices.

---

### License

The sources for this package are in the [Flex Layout](https://github.com/angular/flex-layout) repository. <br/>
Please file issues and pull requests against that repo.

License: MIT

---

### Quick Links

*  [ChangeLog](https://github.com/angular/flex-layout/blob/master/CHANGELOG.md)
*  [Gitter Room](https://gitter.im/angular/flex-layout)
*  [Discussion Forum](https://groups.google.com/forum/#!forum/angular-flex-layout)

Developers

*  [API Documentation](https://github.com/angular/flex-layout/wiki/API-Documentation)
*  [Developer Setup](https://github.com/angular/flex-layout/wiki/Developer-Setup)
*  [Builds + Fast Start](https://github.com/angular/flex-layout/wiki/Fast-Starts)
*  [Integration with Angular CLI](https://github.com/angular/flex-layout/wiki/Integration-with-Angular-CLI)

Demos 

*  [Explore Online](https://tburleson-layouts-demos.firebaseapp.com/)
*  [Source Code](https://github.com/angular/flex-layout/blob/master/src/demo-app/app/demo-app-module.ts)

Templates

*  [Plunkr Template](https://plnkr.co/edit/h8hzyoEyqdCXmTBA7DfK?p=preview)

----

### Browser Support

<a href="http://caniuse.com/#feat=flexbox" target="_blank">
![caniuseflexbox](https://cloud.githubusercontent.com/assets/210413/21288118/917e3faa-c440-11e6-9b08-28aff590c7ae.png)
</a>

<br/>

----

### How it works!

The Angular Flex Layout features enable developers to organize UI page elements in row and column structures with 
alignments, resizing, and padding. These layouts can be nested and easily used within hierarchical DOM structures.

![css3-flexbox-model](https://cloud.githubusercontent.com/assets/210413/20034148/49a4fb62-a382-11e6-9822-42b90dec69be.jpg)


The Flex Layout API is used *simply* as attributes on your HTML elements. That is it! 

> Technically the API is a set of Angular directives with intuitively-named selectors... 🤓

All the magic of applying the Flexbox CSS is handled under-the-hood. The Layout applies (injects) **Flexbox CSS** styles to each DOM element... and your layout and elements will fluidly update their positioning and sizes as the  viewport size changes. 

```html
<div class="flex-container" fxLayout="row" fxLayoutAlign="center center">
  <div class="flex-item" fxFlex="20%">  </div>
  <div class="flex-item" fxFlex>        </div>
  <div class="flex-item" fxFlex="25px"> </div>
</div> 
```

> The above Flex Layout usages do not require any external stylesheets nor any custom CSS programming. 

Flex Layout also added mediaQuery support into the Layout engine. Integrating **mediaQuery** features enables the API and your Application's UX to be **Responsive** to changes in viewport size and orientations. 

Responsive layouts have multiple layout configurations. Responsive layouts add extra configurations that override the default configurations. These overrides will be applied dynamically
when the viewport size changes to match a specific *responsive override*.

In our previous sample (above), the Flex Layout API is used to define default, non-responsive flows and sizing. Now let's consider an HTML sample which specifies **both** default configurations and *mobile* responsive overrides:


```html
<div class="flex-container" 
     fxLayout="row" 
     fxLayout.xs="column"
     fxLayoutAlign="center center"
     fxLayoutAlign.xs="start">
  <div class="flex-item" fxFlex="20%" fxFlex.xs="40%">  </div>


