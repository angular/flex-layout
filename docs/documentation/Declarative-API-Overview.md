### Static API Overview

The Flex Layout features provide smart, syntactic directives to allow developers to easily and intuitively create 
responsive and adaptive layouts using Flexbox CSS. 

> The **API** outline here is considered static and provides a UX that will adjust element sizes and positions as the 
browser window width changes. The static API can be considered the default *desktop* layout API. <br/> <br/> Developers 
should use the Responsive API to support alternate layout configurations for mobile or tablet devices

The **Flex-Layout API** is an intuitive list of HTML directives (aka attributes) that can be used on HTML containers 
and elements. Instead of using traditional CSS stylesheets, developers will define their layouts declaratively directly 
in the HTML.

An important, *fundamental* concept is understanding which APIs are used on DOM **containers** versus APIs used on DOM 
child elements in those containers.  

#### API for DOM containers:  

| HTML  | API | Allowed values                                                          |
|--------------------|-----------------------------------|--------------------------------------|
|  [`fxLayout`][fxLayout]          | `<direction> [wrap]` | `row \| column \| row-reverse \| column-reverse`                           |                  
|  [`fxLayoutAlign`][fxLayoutAlign]  | `<main-axis>  <cross-axis>` | main-axis: `start \| center \| end \| space-around \| space-between`; cross-axis: `start \| center \| end \| stretch`  |                   
|  [`fxLayoutGap`][fxLayoutGap]     | % \|  px \|  vw \|  vh                            |                               |     

> These directives affect the flow and layout children elements in the container

#### API for DOM elements:   

| HTML    | Allowed values                                                                 |
|--------------------|-------------------------------------------------------------------------|
|  [`fxFlex`][fxFlex]           | ""  \| px  \|  % \|  vw \|  vh \|  `<grow> <shrink> <basis>`,                         |              
|  [`fxFlexOrder`][fxFlexOrder]     | int                                                                     |                       
|  [`fxFlexOffset`][fxFlexOffset]    | % \|  px \|  vw \|  vh                                                           |     
|  [`fxFlexAlign`][fxFlexAlign]      | `start \| baseline \| center \| end`                                             |                   
|  [`fxFlexFill, fxFill`][fxFlexFill]       |                                                                         |

> These directives affect the layout and size of the host element. Note the API expects their host elements to be 
inside a DOM flexbox container (a 'block' element which is itself using the Layout API for containers).

#### API for any element: 

| HTML API    | Allowed values                                                                 |
|--------------------|-------------------------------------------------------------------------|
|  [`fxHide`][fxHide]           | TRUE \|  FALSE \|  0 \|  ""          |     
|  [`fxShow`][fxShow]           | TRUE \|  FALSE \|  0 \|  ""          |     
|  [`ngClass`][ngClass]         | @extends [ngClass][aioNgClass] core  |     
|  [`ngStyle`][ngStyle]         | @extends [ngStyle][aioNgStyle] core  |      
|  [`imgSrc`][imgSrc]           | @extends <img> `src` attribute       |

Shown below is sample HTML markup that uses both the container and element Static API:


```html
<div fxLayout='column' class="zero">

  <div fxFlex="33" class="one" ></div>
  <div fxFlex="33%" [fxLayout]="direction" class="two">

    <div fxFlex="22%"    class="two_one"></div>
    <div fxFlex="205px"  class="two_two"></div>
    <div fxFlex="30"     class="two_three"></div>

  </div>
  <div fxFlex class="three"></div>

</div>
```

Flex Layout directives **assign CSS styles** directly in-line to the host element. These in-line styles override 
inherited styles, **ShadowDOM** styles and even ShadowDOM tree stylings on the element `:host`

## Responsive API

Flex-Layout also has a huge set of responsive features that enable developers to easily change the UX layout 
configurations for different display devices. See the our documentation on the [Responsive API page][Responsive].

[fxLayout]: https://github.com/angular/flex-layout/wiki/fxLayout-API
[fxLayoutAlign]: https://github.com/angular/flex-layout/wiki/fxLayoutAlign-API
[fxLayoutGap]: https://github.com/angular/flex-layout/wiki/fxLayoutGap-API
[fxFlex]: https://github.com/angular/flex-layout/wiki/fxFlex-API
[fxFlexOrder]: https://github.com/angular/flex-layout/wiki/fxFlexOrder-API
[fxFlexOffset]: https://github.com/angular/flex-layout/wiki/fxFlexOffset-API
[fxFlexAlign]: https://github.com/angular/flex-layout/wiki/fxFlexAlign-API
[fxFlexFill]: https://github.com/angular/flex-layout/wiki/fxFlexFill-API
[fxHide]: https://github.com/angular/flex-layout/wiki/fxHide-API
[fxShow]: https://github.com/angular/flex-layout/wiki/fxShow-API
[ngClass]: https://github.com/angular/flex-layout/wiki/ngClass-API
[ngStyle]: https://github.com/angular/flex-layout/wiki/ngStyle-API
[aioNgClass]: https://angular.io/api/common/NgClass
[aioNgStyle]: https://angular.io/api/common/NgStyle
[Responsive]: https://github.com/angular/flex-layout/wiki/Responsive-API
[imgSrc]: https://github.com/angular/flex-layout/wiki/imgSrc-API