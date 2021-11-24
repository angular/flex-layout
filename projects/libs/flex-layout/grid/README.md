The `grid` entrypoint contains all of the CSS Grid APIs provided by the
Layout library. This includes directives for flexbox containers like
`gdArea` (a.k.a. `GridAreaDirective`) and children like `gdRow` 
(a.k.a. `GdRowDirective`). The main export from this entrypoint is the 
`GridModule` that encapsulates these directives, and can be 
imported separately to take advantage of tree shaking.

```typescript
import {NgModule} from '@angular/core';
import {GridModule} from '@angular/flex-layout/grid';

@NgModule(({
  imports: [
    ... other imports here
    GridModule,
  ]
}))
export class AppModule {}
```
