The `core` entrypoint contains all of the common utilities to build Layout 
components. Its primary exports are the `MediaQuery` utility 
`MediaObserver` and the module that encapsulates the imports of these
providers, the `CoreModule`, and the base directive for layout
components, `BaseDirective2`. These utilities can be imported separately
from the root module to take advantage of tree shaking.

```typescript
import {NgModule} from '@angular/core';
import {CoreModule} from '@angular/flex-layout/core';

@NgModule(({
  imports: [
    ... other imports here
    CoreModule,
  ]
}))
export class AppModule {}
```

```typescript
import {BaseDirective2} from '@angular/flex-layout/core';

export class NewLayoutDirective extends BaseDirective2 {}
```
