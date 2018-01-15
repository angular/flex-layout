The [**fxLayout** directive](https://github.com/angular/flex-layout/blob/master/src/lib/flexbox/api/layout.ts#L60-L69) should be used on DOM containers whose children should layout or flow as the text direction along the main-axis or the cross-axis. 

```html
<div fxLayout="row">
  <div>1. One</div> <div>2. Two</div> <div>3. Three</div> <div>4. Four</div>
</div>
```

or


```html
<div fxLayout="column">
  <div>1. One</div> <div>2. Two</div> <div>3. Three</div> <div>4. Four</div>
</div>
```

![fxlayout](https://cloud.githubusercontent.com/assets/210413/23197582/eda570ee-f886-11e6-95ff-d25736d3dfdb.png)

<br/>

### fxLayout Options

Shown below are the supported **fxLayout** directive values and their resulting CSS stylings on the hosting element container:

| Value | Equivalent CSS | 
| ----- | -------------- |
|  '' (default)    | `{flex-direction: row}` |
|  `row`     | `{flex-direction: row}` |
|  `row-reverse`  | `{flex-direction: row-reverse}` |
|  `column`     | `{flex-direction: column}` |
|  `column-reverse`     | `{flex-direction: column-reverse}` |

<br/>

### fxLayout Side-Effects

Changes to the fxLayout value will cause the following directives to update and modify their element stylings:

*  **fxLayoutGap**
*  **fxFlex**
*  **fxLayoutAlign**
