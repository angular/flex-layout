The `flex` entrypoint contains all of the flexbox APIs provided by the
Layout library. This includes directives for flexbox containers like
`fxLayout` (a.k.a. `FlexLayoutDirective`) and children like `fxFlex` 
(a.k.a. `FlexDirective`). The main export from this entrypoint is the 
`FlexModule` that encapsulates these directives, and can be 
imported separately to take advantage of tree shaking.

```typescript
import {NgModule} from '@angular/core';
import {FlexModule} from '@angular/flex-layout/flex';

@NgModule(({
  imports: [
    ... other imports here
    FlexModule,
  ]
}))
export class AppModule {}
```
