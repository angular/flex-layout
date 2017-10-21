# Flex Layout

[![npm version](https://badge.fury.io/js/%40angular%2Fflex-layout.svg)](https://www.npmjs.com/package/%40angular%2Fflex-layout)
[![Build Status](https://travis-ci.org/angular/flex-layout.svg?branch=master)](https://travis-ci.org/angular/flex-layout)
[![Gitter](https://badges.gitter.im/angular/flex-layout.svg)](https://gitter.im/angular/flex-layout))

Angular Flex Layout provides a sophisticated layout API using FlexBox CSS + mediaQuery. 
This module provides Angular (v4.x and higher) developers with component layout features using a 
custom Layout API, mediaQuery observables,and DOM flexbox-2016 css.  

The Layout engine intelligently automates the process of applying appropriate FlexBox CSS to 
browser view hierarchies. This automation also addresses many of the complexities and workarounds 
encountered with the traditional, manual, CSS-only application of Flexbox CSS. 

##### Responsive API
The **real** power of Flex Layout, however, is its **responsive** engine. 

The [Responsive API](https://github.com/angular/flex-layout/wiki/API-Overview#responsive-features) 
enables developers to easily specify different layouts, sizing, visibilities for different 
viewport sizes and display devices.

---

#### Deprecated support 

Beta.9 provides support for Angular 4.x, AOT, Universal builds. This also means that Beta.9 (or higher) will not support Angular 2.x.

----

### Updated CHANGELOG

Please consult our [CHANGELOG](https://github.com/angular/flex-layout-builds/blob/master/CHANGELOG.md) for latest changes and new features.
  
### Why choose Flex-Layout

While other Flexbox CSS libraries are implementations of:

* pure CSS-only implementations, or 
* the JS+CSS Stylesheets implementation of Angular Material v1.x Layouts.

Angular Flex Layout - in contrast - is a pure-Typescript UI Layout engine with an implementation that: 

*  uses HTML attributes (aka Layout API) to specify the layout configurations
*  is currently only available for Angular (v4.1 or higher) Applications.
*  is independent of Angular Material (v1 or v2).
*  requires no external stylesheets.
*  requires Angular v4.1 or higher.

<br/>

### Browser Support

<a href="http://caniuse.com/#feat=flexbox" target="_blank">
<img src="https://cloud.githubusercontent.com/assets/210413/21288118/917e3faa-c440-11e6-9b08-28aff590c7ae.png">
</a>

<br/>
  

### NPM Installs

Playing with the nightly changes in [master](https://github.com/angular/flex-layout/tree/master) is also possible

```bash
npm install https://github.com/angular/flex-layout-builds.git
````

Or you can easily install the latest release from NPM using:

```bash
npm install @angular/flex-layout@latest --save
```


### Quick Links

*  [Wiki Docs](https://github.com/angular/flex-layout/wiki)
*  [License: MIT](https://raw.githubusercontent.com/angular/flex-layout-builds/master/LICENSE)

Developer Guides

* [NPM Installs](https://github.com/angular/flex-layout/wiki/NPM-Installs)
* [Developer Setup](https://github.com/angular/flex-layout/wiki/Developer-Setup)
* [Builds + Fast Starts](https://github.com/angular/flex-layout/wiki/Fast-Starts)
* [Using Angular CLI](https://github.com/angular/flex-layout/wiki/Using-Angular-CLI)
* [WebPack Configuration](https://github.com/angular/flex-layout/wiki/Webpack-Configuration)

Documentation

*  [Static API](https://github.com/angular/flex-layout/wiki/Declarative-API-Overview)
*  [Responsive API](https://github.com/angular/flex-layout/wiki/Responsive-API)
*  [API Documentation](https://github.com/angular/flex-layout/wiki/API-Documentation)
*  [Custom Breakpoints](https://github.com/angular/flex-layout/wiki/Custom-Breakpoints)
*  [Best Performance](https://github.com/angular/flex-layout/wiki/Best-Performance)

Demos 

*  [Live Online](https://tburleson-layouts-demos.firebaseapp.com/)
*  [Source Code](https://github.com/angular/flex-layout/blob/master/src/demo-app/app/demo-app-module.ts)

Templates

*  [Plunkr Template](https://plnkr.co/edit/h8hzyoEyqdCXmTBA7DfK?p=preview)

Quick Links

*  [Gitter Chat](https://gitter.im/angular/flex-layout)
*  [Discussion Forum](https://groups.google.com/forum/#!forum/angular-flex-layout)

### License

License: MIT

The sources for this package are in the [Flex-Layout](https://github.com/angular/flex-layout) repository. <br/>
Please file issues and pull requests against that repo.


