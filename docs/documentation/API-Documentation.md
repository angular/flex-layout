
## JavaScript API (Imperative)

Most of the **@angular/flex-layout** functionality is provided via Directives used **declaratively** in template HTML. There are three (3) programmatic features, however, that are published for programmatic usages:

* **[ObservableMedia](https://github.com/angular/flex-layout/wiki/ObservableMedia)**: <br/> Injectable Observable used to subscribe to MediaQuery activation changes.<br/>
`constructor(public media:ObservableMedia ) { ... }`

* **[BREAKPOINTS](https://github.com/angular/flex-layout/wiki/BreakPoints)**: <br/> Opaque token used to override or extend the default breakpoints with custom MediaQuery breakpoints.<br/> `providers: [{provide: BREAKPOINTS, useValue: MY_CUSTOM_BREAKPOINTS }]`

* **[BaseFxDirectiveAdapter](https://github.com/angular/flex-layout/wiki/BaseFxDirectiveAdapter)**: <br/> Adapter class useful to extend existing Directives with MediaQuery activation features. <br/> `export class ClassDirective extends NgClass { ... }` 

<br/>

## HTML API (Declarative)

The features of Flex-Layout are best used, however, declaratively in template HTML. This API has two (2) significant feature sets:

*  **[Static API](https://github.com/angular/flex-layout/wiki/Declarative-API-Overview)**: Summary of static API features.<br/>
*  **[Responsive API](https://github.com/angular/flex-layout/wiki/Responsive-API)**: Introducing Responsive API and BreakPoints details.<br/>

As each directive (aka API) within **@angular/flex-layout** has its own constraints and options, the links below should be used to navigate to the specific the documentation pages for each directive.

<br/>

### Containers

This API set applies flexbox CSS stylings for DOM **container elements** with 1 or more nested flex children:

* [**fxLayout**](https://github.com/angular/flex-layout/wiki/fxLayout-API): <br/>Defines the flow order of child items within a flexbox container.<br/>`<div fxLayout="row" fxLayout.xs="column">  </div>`<br/>&nbsp;
* **[fxLayoutWrap](https://github.com/angular/flex-layout/wiki/fxLayoutWrap-API)**  : <br/>Defines if child items appear on a single line or on multiple lines within a flexbox container.<br/>`<div fxLayoutWrap> </div>`<br/>&nbsp;
* **[fxLayoutGap](https://github.com/angular/flex-layout/wiki/fxLayoutGap-API)**:<br/>Defines if child items within a flexbox container should have a gap. <br/>`<div fxLayoutGap="10px">  </div>`<br/>&nbsp;
* **[fxLayoutAlign](https://github.com/angular/flex-layout/wiki/fxLayoutAlign-API)**:<br/>Defines how flexbox items are aligned according to both the main-axis and the cross-axis, within a flexbox container. <br/>`<div fxLayoutAlign="start stretch">  </div>`


<br/>

### Child Elements within Containers

This API set applies flexbox CSS stylings for a DOM element nested within FlexBox DOM container:

* **[fxFlex](https://github.com/angular/flex-layout/wiki/fxFlex-API)**: <br/>This markup specifies the resizing of its host element within a flexbox container flow.<br/>`<div fxFlex="1 2 calc(15em + 20px)"></div>`

* **[fxFlexOrder](https://github.com/angular/flex-layout/wiki/fxFlexOrder-API)**: <br/>Defines the order of a flexbox item. <br/>`<div fxFlexOrder="2"></div>`

* **[fxFlexOffset](https://github.com/angular/flex-layout/wiki/fxFlexOffset-API)**: <br/>Offset a flexbox item in its parent container flow layout. <br/>`<div fxFlexOffset="20px"></div>`

* **[fxFlexAlign](https://github.com/angular/flex-layout/wiki/fxFlexAlign-API)**: <br/>Works like fxLayoutAlign, but applies only to a single flexbox item, instead of all of them. <br/>`<div fxFlexAlign="center"></div>`

* **[fxFlexFill](https://github.com/angular/flex-layout/wiki/fxFlexFill-API)**: <br/> Maximizes width and height of element in a layout container <br/>`<div fxFlexFill></div>`


<br/>

### Special Responsive Features

While the following APIs also add or remove DOM element inline styles, they are NOT FlexBox CSS specific. 

Instead these are **Responsive** APIs used to adjust specific, non-flexbox styles when a specific mediaQuery has activated:

* **[fxShow](https://github.com/angular/flex-layout/wiki/fxShow-API)**: <br/>This markup specifies if its host element should be displayed (or not).<br/>`<div fxShow [fxShow.xs]="isVisibleOnMobile()"></div>`

* **[fxHide](https://github.com/angular/flex-layout/wiki/fxHide-API)**: <br/>This markup specifies if its host element should NOT be displayed.<br/>`<div fxHide [fxHide.gt-sm]="isVisibleOnDesktop()"></div>`


* **[ngClass](https://github.com/angular/flex-layout/wiki/ngClass-API)** :
<br/>Enhances the **ngClass** directives with class changes based on mediaQuery activations. <br/>`<div [ngClass.sm]="{'fxClass-sm': hasStyle}"></div>`. 

* **[ngStyle](https://github.com/angular/flex-layout/wiki/ngStyle-API)**: 
<br/>Enhances the **ngStyle** directive with style updates based on mediaQuery activations. <br/>`<div [ngStyle.xs]="{'font-size.px': 10, color: 'blue'}"></div>`


