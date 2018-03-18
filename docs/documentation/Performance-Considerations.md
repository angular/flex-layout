#### Performance considerations with Tables

**@angular/flex-layout** performs extremely well for most usage scenarios EXCEPT large tables.

Developers generating dynamic tables (using `*ngFor`) should be aware of performance impacts using Flex-Layout 
directives. 

For small number of rows (e.g. < 100), @angular/flex-layout is a excellent choice for layouts. Consider the table 
definition below were each row has column elements; each using a `fxFlex`. Since the directives apply styles inline for 
each element in each row, large tables may manifest performance impacts with dynamic inline stylings.

```html
<div *ngFor="let obj of data" fxLayout fxLayout.xs="column">
  <div fxFlex="40">{{obj.origin}}</div>
  <div fxFlex="40">{{obj.destination}}</div>
  <div fxFlex="20">{{obj.price}}</div>
</div>  
```

Note that both the **initial** and **media-query**-triggered layout phase manifest redraw-performance issues.

![screen shot 2017-08-03 at 12 46 39 pm](https://user-images.githubusercontent.com/210413/28935328-d1667e58-7849-11e7-8e2d-5983b4071a1d.png)

#### Impacts of "column" flex-direction

Dynamic-inline-styling performance impacts are especially noticeable for **column** layouts. 

Developers should note that FlexBox CSS with `flex-direction = "column"` requires significantly more webkit engine 
processing to properly adjust column heights and layout the composition.  Reduce the demo viewport size to < 600px 
(to force a column direction layout).  

#### Use Responsive Class API for large Tables

For **responsive table layouts** with large number of rows, developers should use the responsive `class` API to specify 
a flexbox CSS style class instead of inline flexbox styles. 

Below we are using the responsive `class` and `class.xs` API to specify class names. Notice that mobile devices will 
use a flow-direction == "column":

```html
    <div *ngFor="let obj of data" class="flow row" class.xs="flow column">
      <div class="item_40"> {{obj.origin}}      </div>
      <div class="item_40"> {{obj.destination}} </div>
      <div class="item_20"> {{obj.price}}       </div>
    </div>  
```

##### Custom Flexbox CSS  

```css 
.flow { 
  display: flex;  
  box-sizing: border-box;   
  -webkit-box-direction: normal;   

  .row { 
    flex-direction: row;      
    -webkit-box-orient: horizontal;   
  }

  .column { 
     flex-direction: column;   
     -webkit-box-orient: vertical;  
     height:100px;       /*  important for sizing of row heights */
     margin-bottom: 20px;   
  }
}

.item_40, .item_20 {  
  flex: 1 1 100%;   
  box-sizing: border-box;   
  -webkit-box-flex: 1; 
}

.row     .item_40 { max-width: 40%; }
.row     .item_20 { max-width: 20%; }

.column  .item_40 { max-height: 40%; }
.column  .item_20 { max-height: 20%; }
```

This **`class`-based** approach performs very well by leveraging stylesheets instead of inline-styles. Here is an 
online [StackBlitz - Flex-Layout Performance](https://stackblitz.com/edit/angular-flex-layout-seed-jmob2p) that 
demonstrates the issue (see `Use fxLayout` button) and solution (see `Use CSS` button).