The `extended` entrypoint contains all of the extended APIs provided by the
Layout library. This includes extensions for Angular directives like NgClass
and NgStyle, and HTML elements like `<img>`. The main export from this
entrypoint is the `ExtendedModule` that encapsulates these directives, and
can be imported separately to take advantage of tree shaking.

```typescript
import {NgModule} from '@angular/core';
import {ExtendedModule} from '@angular/flex-layout/extended';

@NgModule(({
  imports: [
    ... other imports here
    ExtendedModule,
  ]
}))
export class AppModule {}
```
