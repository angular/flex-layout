This entrypoint consolidates the logic for running Flex Layout on the server. Because it uses Node.js
APIs, it must be segmented into the server bundle. This also helps avoid including server code in the
browser bundle.

The main export for this entrypoint, the `FlexLayoutServerModule`, can be imported into a server module
file, e.g. `app.server.module.ts` as follows: 

```typescript
import {NgModule} from '@angular/core';
import {FlexLayoutServerModule} from '@angular/flex-layout/server';

@NgModule(({
  imports: [
    ... other imports here
    FlexLayoutServerModule,
  ]
}))
export class AppServerModule {}
```

This module, in addition to handling all of the style processing/rendering before the Angular app is
bootstrapped on the server, also substitutes the version of `MatchMedia` with a server-compatible
implementation called `ServerMatchMedia`.