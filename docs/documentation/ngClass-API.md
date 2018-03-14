The *@angular/flex-layout* [**ngClass**][ngClass] directive is a subclass of the *@angular/common* 
[**ngClass**][aioNgClass] directive. 

### Standard **`class`** Features 

Note that the default classes (specified by `class=""` and `ngClass="..."` will be preserved (and merged) into other 
activation class lists UNLESS the breakpoint has specified that a default class should be removed.

For example:

```html
<div class="class0" ngClass.xs="class1 class2"></div>
```
By default the **div** will have only the `class0` classname assigned. 

* When the **xs** breakpoint activates, then the div will have `class0 class1 class2` assigned.
* When the **xs** breakpoint deactivates, then the div will only have the `class0` name assigned.

### Standard **`ngClass`** Features 

Traditionally **ngClass** adds and removes CSS classes on an HTML element:

The CSS classes are updated as follows, depending on the type of the expression evaluation:
* `string` - the CSS classes listed in the string (space delimited) are added,
* `Array` - the CSS classes declared as Array elements are added,
* `Object` - keys are CSS classes that get added when the expression given in the value evaluates to a truthy value, 
otherwise they are removed.

```html
<some-element [ngClass]="stringExp|arrayExp|objExp">...</some-element>
<some-element  ngClass="first second"> </some-element>
<some-element [ngClass]="['first', 'second']"> </some-element>
<some-element [ngClass]="{'first': true, 'second': true, 'third': false}"> </some-element>
<some-element [ngClass]="{'class1 class2 class3' : true}"> </some-element>
```

### Responsive Features

The Flex-Layout **ngClass** adds responsive features to also add/remove CSS classes; but only for activated breakpoints.

* `ngClass.<alias>` ; where alias == `xs` | `sm` | `md` | etc.

##### Example #1:

```html
<div
   ngClass="first second" 
   [ngClass.xs]="{'first':false, 'third':true}"
   [ngClass.sm]="{'first':true, 'second':true}" >
      TESTING
</div>
```

![class](https://user-images.githubusercontent.com/210413/30512759-d3bb1e18-9abb-11e7-9dbf-4f9d8ca89ba9.jpg)

> See [Plunkr Demo](https://plnkr.co/edit/86oh19nCBIdpEi6CllmR?p=preview)


##### Example #2:

```html
<div
   [ngClass]="['first', 'second']" 
   ngClass.gt-xs="third" >
     TESTING
</div>
```

![class2](https://user-images.githubusercontent.com/210413/30512832-9232bf44-9abd-11e7-917f-07077c0a210a.jpg)

> See [Plunkr Demo](https://plnkr.co/edit/fEyAnpoFQzXiPa6HTZlt?p=preview)


#### Merging Classes

Note that the default classes (specified by `class=""` and `ngClass="..."` will be preserved (and merged) into other 
activation class lists UNLESS the breakpoint has specified that a default class should be removed:

Below the class `first` is used for all mediaQuery activations **except** for 'xs' (mobile) where it is explicitly 
removed;

```html
<some-element  
    ngClass="first" 
    [ngClass.xs]="{'first':false, 'third':true}">
</some-element>
```

[ngClass]: https://github.com/angular/flex-layout/blob/master/src/lib/extended/class/class.ts
[aioNgClass]: https://github.com/angular/angular/blob/master/packages/common/src/directives/ng_class.ts#L40