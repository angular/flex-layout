Several AngularJS Material applications: **[Material-Adaptive](https://github.com/angular/material-adaptive/tree/master/shrine)**
have been implemented using custom Flexbox CSS. These efforts illustrated the needs and features
within a responsive, adaptive application.

* [Pesto](https://material-adaptive.firebaseapp.com/pesto/app/dist.html#/home)
* [Shrine](https://material-adaptive.firebaseapp.com/shrine/app/dist.html)

![Shrine and Pesto landing pages](https://cloud.githubusercontent.com/assets/210413/20029970/44c16d64-a329-11e6-9a9a-bd00561ea936.png)

Different from responsive layouts where components change sizes and positions, the concepts of Adaptive layouts
provide for UX where  **different components** may be used for different breakpoints.

Animations can also be extended to support MediaQuery activations: different animations will run
for different viewport sizes.

Developers can use the following directives to achieve some Adaptive UX goals:

* `fxHide`
* `fxShow`
* `ngIf`

For examples of `fxHide` usages in Adaptive layouts, please review the demo **Show & Hide Directives**:

* [Demo](https://tburleson-layouts-demos.firebaseapp.com/#/responsive)
* [Source](https://github.com/angular/flex-layout/blob/master/src/apps/demo-app/src/app/responsive/responsive-show-hide/responsive-show-hide.component.ts#L15)

----

#### Core Directives + Responsive Features

Responsive features for core Angular directives:

* `[ngStyle.<alias>]=""`
* `[ngClass.<alias>]=""`

Here is the current solution to enable responsive/adaptive features with **`*ngIf`**:

```typescript
import { Component } from '@angular/core';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';

@Component({
  selector: 'my-mobile-component',
  template: `
      <div *ngIf="media.isActive('xs')">
         This content is only shown on Mobile devices
      </div>
      <footer>
         Current state: {{ }}
      </footer>
  `
})
export class MyMobileComponent {
  public state = '';
  constructor(public media: ObservableMedia) {
    media.asObservable()
      .subscribe((change: MediaChange) => {
        this.state = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
    });
  }
}
```
