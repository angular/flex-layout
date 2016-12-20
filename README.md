# Flex Layout

Angular Flex Layout provides a sophisticated layout API using FlexBox CSS + mediaQuery. This module provides Angular (v2.x and higher) developers with component layout features using a custom Layout API, mediaQuery observables,and injected DOM flexbox-2016 css stylings.  

The Layout engine intelligently automates the process of applying appropriate FlexBox CSS to browser view hierarchies. This automation also addresses many of the complexities and workarounds encountered with the traditional, manual, CSS-only application of Flexbox CSS. 


----

### Quick Links

*  [Wiki Docs](https://github.com/angular/flex-layout/wiki)

Developers

*  [API Overview](https://github.com/angular/flex-layout/wiki/API-Overview)
*  [Developer Setup](https://github.com/angular/flex-layout/wiki/Developer-Setup)
*  [Builds + Fast Start](https://github.com/angular/flex-layout/wiki/Fast-Starts)
*  [Integration with Angular CLI](https://github.com/angular/flex-layout/wiki/Integration-with-Angular-CLI)

Demos 

*  [Explore Online](https://tburleson-layouts-demos.firebaseapp.com/)
*  [Source Code](https://github.com/angular/flex-layout/blob/master/src/demo-app/app/demo-app-module.ts)

Templates

*  [Plunkr Template](https://plnkr.co/edit/h8hzyoEyqdCXmTBA7DfK?p=preview)

----


### Why choose Flex-Layout

While other Flexbox CSS libraries are implementations of:

* pure CSS-only implementations, or 
* the JS+CSS Stylesheets implementation of Angular Material v1.x Layouts.

Angular Flex Layout - in contrast - is a pure-Typescript UI Layout engine with an implementation that: 

*  uses HTML attributes (aka Layout API) to specify the layout configurations
*  is currently only available for Angular (v2.x or higher) Applications.
*  is independent of Angular Material (v1 or v2).
*  requires no external stylesheets.
*  requires Angular v2.x or higher.

<br/>

### Browser Support

<a href="http://caniuse.com/#feat=flexbox" target="_blank">
![caniuseflexbox](https://cloud.githubusercontent.com/assets/210413/21288118/917e3faa-c440-11e6-9b08-28aff590c7ae.png)
</a>

<br/>

----

### How it works!

The Angular Flexbox Layout features enable developers to organize UI page elements in row and column structures with 
alignments, resizing, and padding. These layouts can be nested and easily used within hierarchical DOM structures.

![css3-flexbox-model](https://cloud.githubusercontent.com/assets/210413/20034148/49a4fb62-a382-11e6-9822-42b90dec69be.jpg)


The Layout API is used *simply* as attributes on your HTML elements. That is it! 

> Technically the API is a set of Angular directives with intuitively-named selectors... 🤓

All the magic of applying the Flexbox CSS is handled under-the-hood. The Layout applies (injects) **Flexbox CSS** styles to each DOM element... and your layout and elements will fluidly update their positioning and sizes as the  viewport size changes. 

```html
<div class="flex-container" fx-layout="row" fx-layout-align="center center">
  <div class="flex-item" fx-flex="20%">  </div>
  <div class="flex-item" fx-flex>        </div>
  <div class="flex-item" fx-flex="25px"> </div>
</div> 
```

> The above Flex Layout usages do not require any external stylesheets nor any custom CSS programming. 

Flex-Layout also added mediaQuery support into the Layout engine. Integrating **mediaQuery** features enables the API and your Application's UX to be **Responsive** to changes in viewport size and orientations. 

Responsive layouts have multiple layout configurations. Responsive layouts add extra configurations that override the default configurations. These overrides will be applied dynamically
when the viewport size changes to match a specific *responsive override*.

In our previous sample (above), the Flex Layout API is used to define default, non-responsive flows and sizing. Now let's consider an HTML sample which specifies **both** default configurations and *mobile* responsive overrides:


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
   
With Responsive configurations, DOM elements can be adjusted [for layout-directions, visibility, and sizing constraints] based on specific viewport sizes (desktop or mobile devices) and orientations (portrait or landscape). 

> Of course, these configuration can be specified in the CSS. Flex-Layout, however, makes it super easy
and intuitive to specify these configurations in the HTML layer as HTML element attributes.
 
<br/>

----

### Featured Demo

One of the hardest features to implement is a grid layout with specific column spans. Our online demo shows how easy this is!

Live Demo:

<a href="https://tburleson-layouts-demos.firebaseapp.com/#/stackoverflow" target="_blank">
![screen shot 2016-12-16 at 1 00 51 pm](https://cloud.githubusercontent.com/assets/210413/21274826/bc8553f2-c38f-11e6-8188-bc7fd36026c2.png)
</a>

Source Code:

<a href="https://github.com/angular/flex-layout/blob/master/src/demo-app/app/stack-overflow/columnSpan.demo.ts#L23" target="_blank">
![screen shot 2016-12-16 at 1 05 45 pm](https://cloud.githubusercontent.com/assets/210413/21274996/6b640f8a-c390-11e6-87ac-ca85eb6c3983.png)
</a>

 
<br/>

----

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


