Using Flex-Layout with the the Angular CLI is easy.

## Install the CLI
 
 ```bash
# Global
npm uninstall -g @angular/cli
npm install -g @angular/cli
```

 
## Create a new project
 
```bash
 ng new my-project
```

## Or, use with existing project

```bash
rm -rf node_modules/
npm install
```

The new command creates a project with a build system for your Angular app.

## Install Flex-Layout

```bash
npm install @angular/flex-layout --save
```

>  This ^ installs the most recent npm release of Flex-Layout.

```bash
npm install https://github.com/angular/flex-layout-builds --save
```

> This installs a nightly build which provides supports for the current Angular 4.0, AOT, Universal, and CLI 1.3.0.

## Import the Angular Flex-Layout NgModule
  
**src/app/app.module.ts**
```ts
import { FlexLayoutModule } from '@angular/flex-layout';
// other imports 
@NgModule({
  imports: [FlexLayoutModule],
  ...
})
export class PizzaPartyAppModule { }
```

<br/>

## Configuring SystemJS
If your project is using SystemJS for module loading, you will need to add `@angular/flex-layout` 
to the SystemJS configuration:

```js
System.config({
  // existing configuration options
  map: {
    ...,
    '@angular/flex-layout': 'npm:@angular/flex-layout-builds/bundles/flex-layout.umd.js'
  }
});
```

## Sample Angular 2 Flex-Layout projects

Developers are encouraged to review the live demos and source for the Flex-Layout Demos:

*  [Live Demos](https://tburleson-layouts-demos.firebaseapp.com/)
*  [Demo Source Code](https://github.com/angular/flex-layout/blob/master/src/demo-app/)
