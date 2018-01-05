### Static API Overview

The Flex Layout features provide smart, syntactic directives to allow developers to easily and intuitively create responsive and adaptive layouts using Flexbox CSS. 

> The **API** outline here is considered static and provides a UX that will adjust element sizes and positions as the browser window width changes. The static API can be considered the default *desktop* layout API. <br/> <br/> Developers should use the Responsive API to support alternate layout configurations for mobile or tablet devices.

The **Flex-Layout API** is an intuitive list of HTML directives (aka attributes) that can be used on HTML containers and elements. Instead of using traditional CSS stylesheets, developers will define their layouts declaratively directly in the HTML.

An important [fundamental] concept is understanding which APIs are used on DOM **containers** versus APIs used on DOM child elements in those containers.  

<br/>

#### API for DOM containers:  

| HTML API &nbsp;&nbsp;&nbsp;    | Allowed values                                                          |
|--------------------|-------------------------------------------------------------------------|
|  [fxLayout](https://github.com/angular/flex-layout/wiki/fxLayout-API)          | `<direction>  \|  <direction> <wrap>` <br/> Use: `row \| column \| row-reverse \| column-reverse`                           |                  
|  fxLayoutAlign  | `<main-axis>  <cross-axis>` <br/> main-aixs: `start \|center \| end \| space-around \| space-between` <br/> cross-axis: `start \| center \| end \| stretch`                  |  fxLayoutWrap    | `"" \| wrap \| none \| nowrap \| reverse`                                   |                   
|  [fxLayoutGap](https://github.com/angular/flex-layout/wiki/fxLayoutGap-API)     | % \|  px \|  vw \|  vh                                                           |     

> These directives ^ affect the flow and layout children elements in the container

<br/>

#### API for DOM elements:   

| HTML API    | Allowed values                                                                 |
|--------------------|-------------------------------------------------------------------------|
|  [fxFlex](https://github.com/angular/flex-layout/wiki/fxFlex-API)           | ""  \| px  \|  % \|  vw \|  vh \|  `<grow> <shrink> <basis>`,                         |              
|  fxFlexOrder     | int                                                                     |                       
|  fxFlexOffset    | % \|  px \|  vw \|  vh                                                           |     
|  fxFlexAlign      | `start \| baseline \| center \| end`                                             |                   
|  fxFlexFill       |                                                                         |

> These directives ^ affect the layout and size of the host element. Note the API expects their host elements to be inside a DOM flexbox container [a 'block' element which is itself using the Layout API for containers].

<br/>

#### API for any element: 

| HTML API    | Allowed values                                                                 |
|--------------------|-------------------------------------------------------------------------|
|  fxHide           | TRUE \|  FALSE \|  0 \|  ""                                                      |     
|  fxShow           | TRUE \|  FALSE \|  0 \|  ""                                                      |     
|  [ngClass](https://github.com/angular/flex-layout/wiki/ngClass-API)          | @extends [ngClass](https://angular.io/docs/ts/latest/api/common/index/NgClass-directive.html) core                                                      |     
|  [ngStyle](https://github.com/angular/flex-layout/wiki/ngStyle-API)          | @extends [ngStyle](https://angular.io/docs/ts/latest/api/common/index/NgStyle-directive.html) core                                                      |      


<br/>

Shown below is sample HTML markup that uses both the container and element Static API:


```html
<div fxLayout='column' class="zero">

  <div fxFlex="33"                          class="one" ></div>
  <div fxFlex="33%" [fxLayout]="direction" class="two">

    <div fxFlex="22%"    class="two_one"></div>
    <div fxFlex="205px"  class="two_two"></div>
    <div fxFlex="30"     class="two_three"></div>

  </div>
  <div fxFlex class="three"></div>

</div>
```

Flex Layout directives **assign CSS styles** directly in-line to the host element. These in-line styles override inherited styles, **ShadowDOM** styles and even ShadowDOM tree stylings on the element  `:host`

<br/>

## Responsive API

Flex-Layout also has a huge set of responsive features that enable developers to easily change the UX layout configurations for different display devices. See the our documentation on [Responsive API](https://github.com/angular/flex-layout/wiki/Responsive-API).
