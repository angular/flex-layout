The `core` entrypoint contains all of the common utilities to build Layout 
components. Its primary exports are the `MediaQuery` utilities (`MatchMedia`,
`ObservableMedia`) and the module that encapsulates the imports of these
providers, the `MediaQueriesModule`, and the base directive for layout
components, `BaseFxDirective`. These utilies can be imported separately
from the root module to take advantage of tree shaking.

```typescript
import {NgModule} from '@angular/core';
import {MediaQueriesModule} from '@angular/flex-layout/core';

@NgModule(({
  imports: [
    ... other imports here
    MediaQueriesModule,
  ]
}))
export class AppModule {}
```

```typescript
import {BaseFxDirective} from '@angular/flex-layout/core';

export class NewLayoutDirective extends BaseFxDirective {}
```