The **fxHide** directive allows developers to dynamically and/or responsively show/hide the hosting element. The fxHide 
logic defaults to **hiding** an element.


### API 

1) Flex-Layout supports **STATIC** API for responsive layouts  using the API **without** `.<xxx>` alias suffices: 
fxShow, fxHide, etc. These values of these directives are used (and styles applied) regardless of the viewport size. 
These static rules can be specifically  overridden by a registered responsive API use (see below).

2) Flex-Layout provides a **RESPONSIVE** API for dynamic adaptive layouts. This is simply using the the static API with 
mediaQuery aliase suffices.
e.g.  
* **fxHide.lg**, etc.  
* **fxShow.gt-sm**, 

### Using fxShow & fxHide

* fxHide (without a value) means "display:none"
* fxShow (without a value) means use the origin display style value
* fxHide="false" means use the original display value (should no longer be hidden)
* fxShow="false" means "display:none" and hide it.
  > fxHide is the inverse of fxShow 

### Using Responsive API

When a mediaQuery range activates, the directive instances will be notified. If the current activate mediaQuery range 
(and its associated alias) are not used, then the static API value is restored as the fallback value.

The *fallback* solution uses a **`largest_range-to-smallest_range`** search algorithm. Consider the following:

```html
<div fxShow.sm="false"  fxShow.gt-md="false" fxShow="true" ></div>
```

* When the `lg` range is activated (by viewport resizing,etc) the div is **hidden** since the `gt-md` is used as the 
closest descending fallback value.
* When the `md` range is activated, the div is **shown** since the static API is the closest descending matching 
condition.
* When the `sm` range is activated the div is **hidden**.

> Please note that there is no left-to-right precedence. This is an incorrect interpretation..

### Combine Uses of fxShow + fxHide

We can leverage the default values of these directives select specific conditions when an element is hidden or shown.

Consider:

```html
<div fxHide fxShow.gt-sm></div>
```

means the the above element will be hidden by default and ONLY shown on viewport sizes greater than mobile.


```html
<div fxShow fxHide.md ></div>
```

means the the above element will be shown by default and ONLY hidden on viewport sizes == `md` mediaQuery ranges.

