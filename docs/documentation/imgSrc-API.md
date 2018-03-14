The [**imgSrc** directive][imgSrc] is a responsive extension of the HTML <img> `src` attribute and can be used on any
<img> tag in the markup


```html
<div>
  <img src="default.png" src.xs="xsmall.png"/>
</div>
```

### imgSrc Options

**imgSrc** takes one string argument, and alters its host's `src` attribute as necessary when breakpoints are activated.
The initial value will be used as the default and fallback when a responsive alias is not defined


[imgSrc]: https://github.com/angular/flex-layout/blob/master/src/lib/extended/img-src/img-src.ts#L38