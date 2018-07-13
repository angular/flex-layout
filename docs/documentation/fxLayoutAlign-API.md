The [**fxLayoutAlign** directive][Layout] should be used on DOM containers whose children should be aligned on the main
and cross-axis (optional)

```html
<div fxLayout="row" fxLayoutAlign="center center">
  <div>1. One</div> <div>2. Two</div> <div>3. Three</div> <div>4. Four</div>
</div>
```


### fxLayoutAlign Options

Shown below are the supported **fxLayoutAlign** directive values and their resulting CSS stylings on the hosting element 
container

**Main Axis**

| Value | Equivalent CSS | 
| ----- | -------------- |
|  '' (default)    | `justify-content: flex-start`    |
|  `start`         | `justify-content: flex-start`    |
|  `center`        | `justify-content: center`        |
|  `end`           | `justify-content: flex-end`      |
|  `space-around`  | `justify-content: space-around`  |
|  `space-between` | `justify-content: space-between` |
|  `space-evenly`  | `justify-content: space-evenly`  |

**Cross Axis (optional)**

| Value | Equivalent CSS | 
| ----- | -------------- |
|  `(default)`     | `align-items: flex-start; align-content: flex-start`               |
|  `start`         | `align-items: flex-start; align-content: flex-start`               |
|  `center`        | `align-items: center; align-content: center`                       |
|  `end`           | `align-items: flex-end; align-content: flex-end`                   |
|  `space-around`  | `align-items: space-around; align-content: space-around`           |
|  `space-between` | `align-items: space-between; align-content: space-between`         |
|  `space-evenly`  | `align-items: space-evenly; align-content: space-evenly`           |
|  `stretch`       | `max-width: 100% if flex-direction: column; else max-height: 100%` |


[Layout]: https://github.com/angular/flex-layout/blob/master/src/lib/flex/layout-align/layout-align.ts#L47