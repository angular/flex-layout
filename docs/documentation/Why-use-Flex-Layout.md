### Why choose Flex-Layout

Other Flexbox CSS libraries are implementations of:

* pure CSS-only implementations, or 
* JS+CSS stylesheets. An implementation of this is available in AngularJS Material Layouts API.

In contrast, @angular/flex-layout is a pure-Typescript UI Layout engine with an implementation that: 

* uses HTML markup (aka Layout API) to specify the layout configurations
* is independent of Angular Material (v1 or v2).
* requires no external stylesheets.
* requires Angular v4.1.x or higher.
* is only available for Angular (v2.x or higher) Applications.

----

### Advantages 

Compared to the Layout API in AngularJS Material, this codebase is easier to maintain and debug.
And other more important benefits have also been realized:

* Independent of Angular Material 
* No external CSS requirements
* Support (future) for Handset/Tablet and Orientation breakpoints
* Support for **ANY** Layout injector value (instead of increments for 5)
* Support for raw values or interpolated values
* Support for raw, percentage or px-suffix values*  Change detection for Layout injector values
* Use provider to supply custom breakpoints
* Notifications for breakpoints changes
  * Includes workaround for MediaQuery issues with **overlapping** breakpoints
* MediaQuery Activation detection 

<br/>

----

### Issues with CSS-based Flexbox

AngularJS Material clearly demonstrated the limitations of a FlexBox-solution implemented as CSS classes. The most 
significant of these was the limitations with using parameterized values. 

Consider the **allowed values** listed in the 
[Static API tables](https://github.com/angular/flex-layout/wiki/Declarative-API-Overview#api-for-dom-containers). 
Support for even a limited set of **Allowed Value** variations lead to a combinatorial explosion of required CSS 
classes... 

* CSS specificity issues rapidly became problematic
* CSS footprint size became excessively large (>250K for flexbox CSS)
* Changes in layout direction required changes to child flexbox stylings
* No built-in support for customized media query breakpoints.
* etc.
