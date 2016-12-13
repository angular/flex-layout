Get started with Angular Material 2 using the Angular CLI.

## Install the CLI
 
 ```bash
 npm install -g angular-cli
 ```
 
## Create a new project
 
 ```bash
 ng new my-project
 ```

The new command creates a project with a build system for your Angular app.

## Install Angular Flex-Layout components 

```bash
npm install --save @angular/flex-layout
```

## Import the Angular Flex-Layout NgModule
  
**src/app/app.module.ts**
```ts
import { FlexLayoutModule } from '@angular/flex-layout';
// other imports 
@NgModule({
  imports: [FlexLayoutModule.forRoot()],
  ...
})
export class PizzaPartyAppModule { }
```


## Configuring SystemJS
If your project is using SystemJS for module loading, you will need to add `@angular/flex-layout` 
to the SystemJS configuration:

```js
System.config({
  // existing configuration options
  map: {
    ...,
    '@angular/flex-layout': 'npm:@angular/flex-layout/flex-layout.umd.js'
  }
});
```


## Sample Angular 2 Flex-Layout projects

- not yet available
