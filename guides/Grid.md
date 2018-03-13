# CSS Grid with Angular Layout

### Introduction

CSS Grid is a relatively new, powerful layout library available in all evergreen browsers. It provides
an extra level of dimensionality for constructing web layouts compared to Flexbox. We have added 11 new
directives with responsive functionality to the Angular Layout library to enable developers to easily add
the new engine to their apps.

### Usage

The new suite of directives is extensive, and covers the majority of CSS Grid functionality. The
following table shows the parity between directives and CSS properties:

| Grid Directive   | CSS Property(s)                           | Extra Inputs               |
| ---------------- |:-----------------------------------------:| --------------------------:|
| `gdAlignColumns` | `align-content` and `align-items`         | `gdInline` for inline-grid |
| `gdAlignRows`    | `justify-content` and `justify-items`     | `gdInline` for inline-grid |
| `gdArea`         | `grid-area`                               | none                       |
| `gdAreas`        | `grid-areas`                              | `gdInline` for inline-grid |
| `gdAuto`         | `grid-auto-flow`                          | `gdInline` for inline-grid |
| `gdColumn`       | `grid-column`                             | none                       |
| `gdColumns`      | `grid-template-columns`                   | `gdInline` for inline-grid<br>`!` at the end means `grid-auto-columns` |
| `gdGap`          | `grid-gap`                                | `gdInline` for inline-grid |
| `gdGridAlign`    | `justify-self` and `align-self`           | none                       |
| `gdRow`          | `grid-row`                                | none                       |
| `gdRows`         | `grid-template-rows`                      | `gdInline` for inline-grid<br>`!` at the end means `grid-auto-rows`  |

Note: unless otherwise specified, the above table represents exact parity. The inputs for the
directives will be mapped verbatim to the CSS property without sanitization

### Limitations

While CSS Grid has excellent cross-browser and mobile support, it is currently unsupported in IE11
due to an outdated spec implementation

### Using with Flexbox

The new CSS Grid directives can be used in concert with the existing Flexbox directives seamlessly.
Simply import the top-level `FlexLayoutModule`, or both `FlexModule` and `GridModule` as follows:

```typescript
import {FlexLayoutModule} from '@angular/flex-layout';
```

```typescript
import {FlexModule} from '@angular/flex-layout/flex';
import {GridModule} from '@angular/flex-layout/grid';
```

This allows you to use, for example, Flexbox inside a CSS Grid as follows:

```html
<div gdAuto>
  <div fxLayout="row">
    <div fxFlex></div>
  </div>
</div>
```

### References

The design doc for this part of the library can be found
[here](https://docs.google.com/document/d/1YjKHAV7-wh5UZd4snoyw6bVWe1X5JF-zDaUFa8-JDtE)