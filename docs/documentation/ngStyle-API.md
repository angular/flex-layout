The *@angular/flex-layout* [**ngStyle**][ngStyle] directive is a subclass of the *@angular/common* 
[**ngStyle**][aioNgStyle] directive. 

### ngStyle Enhancements 

* Supports merging `style` key-values into non-responsive `[ngStyle]` options
* Supports responsive `[ngStyle.<alias>]` usages; see section below


### Standard (non-responsive) Features

Traditionally **ngStyle** updates an HTML element inline styles (highest specificity):

The styles are updated according to the value of the expression evaluation:

* keys are style names with an optional `.<unit>` suffix (ie 'top.px', 'font-style.em'),
* values are the values assigned to those properties (expressed in the given unit).


```html
<some-element 
    style="color:red; font-size:12pt;"
   [ngStyle]="{'font-style': styleExp}">
 ... 
</some-element>

<some-element [ngStyle]="{'max-width.px': widthExp}">
  ...
</some-element>

<some-element [ngStyle]="objExp">
  ...
</some-element>
```


> Note: using `ngStyle` with `style` will cause the initial `style` key/values to be merged into the `ngStyle` options.

### Responsive Features

The Flex-Layout **ngClass** adds responsive features to also add/remove CSS styles for activated breakpoints.


```html
<some-element 
    style="font-size:12px; color:black; text-align:left;"
    [ngStyle.sm]="{'font-size': '16px', color: '#a63db8', 'text-align': 'center'}"
    ngStyle.md="font-size: 24px; color : #0000ff; text-align: right;">
...
</some-elment>

<some-element [ngStyle]="{'max-width.px': widthExp}">
  ...
</some-element>

<some-element [ngStyle]="objExp">
  ...
</some-element>
```

![screen shot 2017-09-15 at 6 04 16 pm](https://user-images.githubusercontent.com/210413/30506288-5adb4cc8-9a40-11e7-9701-e9973a1565f5.png)


> See [Plunkr Demo](https://plnkr.co/edit/s4ujRdD2RBkdJEYKxYtJ?p=preview)

#### Merging Styles

Note that the default styles (specified by `style=""` or `ngStyle="..."`) will be preserved (and merged) into other 
activation class lists UNLESS the breakpoint has specified that a style should be removed (using a null value)

Below the font size and colors are changed for 'sm' and 'md' breakpoints. Yet for 'md', the `text-align` style remains 
the same as the default === 'left'. Deactivations of 'sm' or 'md' breakpoints to other breakpoints will result in only 
the default styles being re-applied.

```html
<some-element 
    style="font-size:12px; color:black; text-align:left;"
    [ngStyle.sm]="{'font-size': '16px', color: '#a63db8'}"
    ngStyle.md="font-size: 24px; color : #0000ff; text-align: right;">
  ...
</some-elment>
```

![sample1](https://user-images.githubusercontent.com/210413/30512495-e974c33a-9ab6-11e7-8dec-9805219baaac.jpg)

[ngStyle]: https://github.com/angular/flex-layout/blob/master/src/lib/extended/style/style.ts#L54
[aioNgStyle]: https://github.com/angular/angular/blob/master/packages/common/src/directives/ng_style.ts#L34