`@angular/flex-layout` now supports server-side rendering (SSR). 

Developers should see the Universal Demo app source for details:

*  [main.server.ts](https://github.com/angular/flex-layout/blob/95a6e83bc9ce67a218d0b14e994ad41229b3ee75/src/apps/universal-app/src/main.server.ts)
*  [app.server.module.ts](https://github.com/angular/flex-layout/blob/95a6e83bc9ce67a218d0b14e994ad41229b3ee75/src/apps/universal-app/src/app/app.server.module.ts)

>  The `app.server.module` uses the *FlexLayoutServerModule* (instead of the FlexLayoutModule). 

The *FlexLayoutServerModule* entrypoint consolidates the logic for running Flex Layout on the server. Because SSR usings uses Node.js APIs, the FlexLayoutServerModule must be segmented into a server-only bundle. 

> This also helps avoid including server code in the browser bundle.

The `FlexLayoutServerModule`, can be imported into a server modulefile, e.g. `app.server.module.ts` as follows: 

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

This module - in addition to handling all of the style processing/rendering before the Angular app is
bootstrapped on the server - also substitutes the version of `MatchMedia` with a server-compatible
implementation called `ServerMatchMedia`.