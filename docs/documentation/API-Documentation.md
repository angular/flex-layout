## JavaScript API (Imperative)

Most of the **@angular/flex-layout** functionality is provided via Directives used **declaratively** in template HTML. 
There are three (3) programmatic features, however, that are published for programmatic usages:

* **[ObservableMedia](https://github.com/angular/flex-layout/wiki/ObservableMedia)**:  
Injectable Observable used to subscribe to MediaQuery activation changes.
```typescript
import {ObservableMedia} from '@angular/flex-layout';
constructor(public media: ObservableMedia ) { ... }
```

* **[BREAKPOINTS](https://github.com/angular/flex-layout/wiki/BreakPoints)**:  
Injection token used to override or extend the default breakpoints with custom MediaQuery breakpoints.
```typescript
import {BREAKPOINTS} from '@angular/flex-layout';
providers: [{provide: BREAKPOINTS, useValue: MY_CUSTOM_BREAKPOINTS }]
```

* **[BaseDirectiveAdapter](https://github.com/angular/flex-layout/wiki/BaseDirectiveAdapter)**:  
Adapter class useful to extend existing Directives with MediaQuery activation features.  
```typescript
import {NgClass} from '@angular/core';
export class ClassDirective extends NgClass { ... }
```

## HTML API (Declarative)

The features of Flex-Layout are best used declaratively in template HTML. This API has two (2) significant feature sets:

* **[Static API](https://github.com/angular/flex-layout/wiki/Declarative-API-Overview)**: Summary of static API 
features.
* **[Responsive API](https://github.com/angular/flex-layout/wiki/Responsive-API)**: Introducing Responsive API and 
BreakPoints details.

As each directive (aka API) within **@angular/flex-layout** has its own constraints and options, 
the links below should be used to navigate to the specific documentation pages for each directive


### Containers

This API set applies flexbox CSS stylings for DOM **container elements** with 1 or more nested flex children:

* [**fxLayout**](https://github.com/angular/flex-layout/wiki/fxLayout-API): 
Defines the flow order of child items within a flexbox container
```html
<div fxLayout="row" fxLayout.xs="column"></div>
```
* **[fxLayoutGap](https://github.com/angular/flex-layout/wiki/fxLayoutGap-API)**:
Defines if child items within a flexbox container should have a gap
```html
<div fxLayoutGap="10px"></div>
```
* **[fxLayoutAlign](https://github.com/angular/flex-layout/wiki/fxLayoutAlign-API)**:
Defines how flexbox items are aligned according to both the main-axis and the cross-axis, within a flexbox container
```html
<div fxLayoutAlign="start stretch"></div>
```


### Child Elements within Containers

This API set applies flexbox CSS stylings for a DOM element nested within FlexBox DOM container:

* **[fxFlex](https://github.com/angular/flex-layout/wiki/fxFlex-API)**: 
This markup specifies the resizing of its host element within a flexbox container flow
```html
<div fxFlex="1 2 calc(15em + 20px)"></div>
```
* **[fxFlexOrder](https://github.com/angular/flex-layout/wiki/fxFlexOrder-API)**: 
Defines the order of a flexbox item
```html
<div fxFlexOrder="2"></div>
```
* **[fxFlexOffset](https://github.com/angular/flex-layout/wiki/fxFlexOffset-API)**: 
Offset a flexbox item in its parent container flow layout
```html
<div fxFlexOffset="20px"></div>
```
* **[fxFlexAlign](https://github.com/angular/flex-layout/wiki/fxFlexAlign-API)**: 
Works like fxLayoutAlign, but applies only to a single flexbox item, instead of all of them
```html
<div fxFlexAlign="center"></div>
```
* **[fxFlexFill](https://github.com/angular/flex-layout/wiki/fxFlexFill-API)**:  
Maximizes width and height of element in a layout container
```html
<div fxFlexFill></div>
```


### Special Responsive Features

While the following APIs also add or remove DOM element inline styles, they are NOT FlexBox CSS specific. 

Instead these are **Responsive** APIs used to adjust specific, non-flexbox styles when a specific mediaQuery has 
activated:

* **[fxShow](https://github.com/angular/flex-layout/wiki/fxShow-API)**:
This markup specifies if its host element should be displayed (or not)
```html
<div fxShow [fxShow.xs]="isVisibleOnMobile()"></div>
```
* **[fxHide](https://github.com/angular/flex-layout/wiki/fxHide-API)**: 
This markup specifies if its host element should NOT be displayed
```html
<div fxHide [fxHide.gt-sm]="isVisibleOnDesktop()"></div>
```
* **[ngClass](https://github.com/angular/flex-layout/wiki/ngClass-API)** :
Enhances the **ngClass** directives with class changes based on mediaQuery activations
```html
<div [ngClass.sm]="{'fxClass-sm': hasStyle}"></div>
``` 
* **[ngStyle](https://github.com/angular/flex-layout/wiki/ngStyle-API)**: 
Enhances the **ngStyle** directive with style updates based on mediaQuery activations
```html
<div [ngStyle.xs]="{'font-size.px': 10, color: 'blue'}"></div>
```


