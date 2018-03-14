The [**fxFlexAlign** directive][Align] should be used on on elements within a sorted **fxLayout** container and 
dictates how the element should be aligned, overriding the container cross-axis alignment setting

```html
<div fxLayout="row">
  <div fxFlexAlign="start">1. One</div>
  <div fxFlexAlign="center">2. Two</div>
  <div fxFlexAlign="center">3. Three</div>
  <div fxFlexAlign="end">4. Four</div>
</div>
```


### fxFlexAlign Options

Shown below are the supported **fxFlexAlign** directive values and their resulting CSS stylings on the hosting element 
container

| Value | Equivalent CSS | 
| ----- | -------------- |
|  `start`    | `align-self: flex-start` |
|  `center`   | `align-self: center`     |
|  `end`      | `align-self: flex-end`   |
|  `baseline` | `align-self: baseline`   |
|  `stretch`  | `align-self: stretch`    |

**Note**: All supported values for [`align-self`](https://developer.mozilla.org/en-US/docs/Web/CSS/align-self) are
supported by this directive


[Align]: https://github.com/angular/flex-layout/blob/master/src/lib/flex/flex-align/flex-align.ts#L38