The [**fxFlex** directive][fxFlex] should be used on elements within a **fxLayout** container and identifies the 
resizing of that element within the flexbox container flow. 


![css3-flexbox-model](https://cloud.githubusercontent.com/assets/210413/20034148/49a4fb62-a382-11e6-9822-42b90dec69be.jpg)

This directive is the smartest, most powerful directive within the **flex-layout** API toolbox and is essentially the 
FlexBox API for resizing elements in horizontal or vertical stacks. 

Flexbox element resizing utilizes [three (3) parameters](http://cssreference.io/flexbox/):

* **flex-grow**:  defines how much a flexbox item should **grow** (proportional to the others) if there's space 
available. The flex-grow value overrides the width.
* **flex-shrink**: defines how much a flexbox item should **shrink** if there is **not enough** space available.
* **flex-basis**: controls the default size of an element, before it is manipulated by other Flexbox properties

[![fxFlex example](https://cloud.githubusercontent.com/assets/210413/21274996/6b640f8a-c390-11e6-87ac-ca85eb6c3983.png)](https://github.com/angular/flex-layout/blob/master/src/apps/demo-app/src/app/stack-overflow/grid-column-span/grid-column-span.component.ts#L23)

Note that the resizing occurs along the main-axis of the layout and maybe affected by the **fxLayoutAlign** options. 

> Developer's seeking details on FlexBox should 
* Review [CSS-Tricks - A Guide to FlexBox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/), or 
* Play with the online [Flex-Layout Demos](https://tburleson-layouts-demos.firebaseapp.com/#/docs).

### fxFlex Attribute Usages

The **fxFlex** directive supports two usages: short-form and long-form:

```html
<div fxFlex="<basis>"></div>
```
or
```html
<div fxFlex="<grow> <shrink> <basis>"></div>
```

* The **long-form** enables the developer to specify the grow, shrink, and basis values inline.
  * `fxFlex="1 1 52%"`
  * `fxFlex="3 3 calc(15em + 20px)"`
  * `fxFlex="1 1 auto"`


* The **short-form** enables developers to specify only the **flex-basis** and uses defaults for the shrink and grow 
options: (default values == 1).
  * `fxFlex`
  * `fxFlex=""`
  * `fxFlex="2 2 calc(10em + 10px)"`
  * `fxFlex="102px"`

Note the above examples are using static values. To use runtime expressions, developers should use the box-notation to 
specify 1-way DataBind (to an expression). E.g. `[fxFlex]="twoColumnSpan"`

### fxFlex Options

The **flex-basis** values can be pixels, percentages, calcs, em, vw, vh, or known *aliases*

* `fxFlex`
* `fxFlex=""`
* `fxFlex="2 2 calc(10em + 10px)"`
* `fxFlex="102px"`
* `fxFlex="auto"`

If no unit is specified it defaults to percentages (e.g. `fxFlex="50"` => `flex: 1 1 50%`).

Flex-basis **aliases** are accepted shorthand terms used to quickly specify Flexbox stylings. Here are the industry 
mappings of the alias to its resulting CSS styling:


| alias | Equivalent CSS | 
| ----- | -------------- |
|  `grow`     | `flex: 1 1 100%` |
|  `initial`  | `flex: 0 1 auto` |
|  `auto`     | `flex: <grow> <shrink> 100%` |
|  `none`     | `flex: 0 0 auto` |
|  `nogrow`   | `flex: 0 1 auto` |
|  `noshrink` | `flex: 1 0 auto` |


### Real Example

Shown below is an example of a non-trivial layout using various **fxFlex** options:

#### Source Code:

[![screen shot 2016-12-16 at 1 05 45 pm](https://cloud.githubusercontent.com/assets/210413/21274996/6b640f8a-c390-11e6-87ac-ca85eb6c3983.png)](https://github.com/angular/flex-layout/blob/master/src/demo-app/app/stack-overflow/columnSpan.demo.ts#L23)

#### Live Demo:

[![screen shot 2016-12-16 at 1 00 51 pm](https://cloud.githubusercontent.com/assets/210413/21274826/bc8553f2-c38f-11e6-8188-bc7fd36026c2.png)](https://tburleson-layouts-demos.firebaseapp.com/#/stackoverflow)


### Additional fxFlex Stylings

**fxFlex** also auto-assign additional stylings, dependent upon the fxFlex value used and the layout, main-axis direction:

* **box-sizing** : `border-box`
* **max-width**: when direction == `row` and use fixed sizes+shrink or `0%`
* **max-height**: when direction == `column` and use fixed sizes or `0%` 
* **min-width**: when direction == `row` and use fixed sizes+grow or `0%`
* **min-height**: when direction == `column` and use fixed sizes+grow or `0%`

When a parent **fxLayout** container changes flow-direction, the **fxFlex** directive will automatically update the 
element's inline-styling with corrected stylings.

### Default fxFlex Values

When the Angular compiler builds an instance of the [**FlexDirective**][FlexDirective], it initializes the 

```typescript
import {Input} from '@angular/core';
@Input('fxFlex')
set(val) {....} 
```

with the static value of "". `fxFlex` is the same/equivalent as `fxFlex=""`. And this empty string value is internally 
interpreted (by the FlexDirective) as an instruction to assign an inline element-styling of

```css
flex: 1 1 0.000000001px
```

Where the default values of *flew-shrink* and *flex-grow* are `1` and have not been overridden.

> Another usage (with distinct grow and shrink values) such as 
```html
<div fxFlex fxShrink="0" fxGrow="2"></div>
```
> would result in an inline styling of 
```css
flex: 2 0 0.000000001px
```

What this means to the developer is an intuitive resizing for elements:

The notation 

```html
<div fxLayout="row">
   <div fxFlex></div>
</div>
```

means 

```
Resize the div element to fill the available space along the 
horizontal, main-axis flow of its parent container!
```

The notation:

```html
<div fxLayout="row">
   <div fxFlex></div>
   <div fxFlex></div>
   <div fxFlex></div>
</div>
```

means

```
Resize the div elements to fill 1/3rd each the available space 
along horizontal main-axis. 
```

----

### Known Issues with fxFlex

While Flex-Layout makes every attempt to assign smart, valid flexbox stylings... some usages and some browsers will 
manifest layout issues.

[CanIuse.com](http://CanIuse.com) reports and tracks many browsers issues using FlexBox; especially with 
**IE browsers** and **Column** stacking layouts. 

Developers should consult the **[Known Issues](http://caniuse.com/#feat=flexbox)** and the 
[Resources](http://caniuse.com/#feat=flexbox) sections.

[![caniuse](https://cloud.githubusercontent.com/assets/210413/21288118/917e3faa-c440-11e6-9b08-28aff590c7ae.png)](http://caniuse.com/#feat=flexbox)

Developer's seeking details on FlexBox should 
* Review [CSS-Tricks - A Guide to FlexBox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/), or 
* Play with the online [Flex-Layout Demos](https://tburleson-layouts-demos.firebaseapp.com/#/docs)

[fxFlex]: https://github.com/angular/flex-layout/blob/master/src/lib/flex/flex/flex.ts
[FlexDirective]: https://github.com/angular/flex-layout/blob/master/src/lib/flex/flex/flex.ts#L65-L67
