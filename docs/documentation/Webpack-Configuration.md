[WIP] - Below are instructions for integrating Flex-Layout into new or existing WebPack driven projects.

## WebPack 1.x

## WebPack 2.x
Implementation in a 2.x project should be extremely straight forward and won't require any changes to your `webpack.config.js`

> Code examples are from [Angular/Angular2-seed](https://github.com/angular/angular2-seed).

### Install the Angular Flex-Layout Library  

```bash
npm install --save @angular/flex-layout
```
**or...**
```bash
yarn add @angular/flex-layout
```

### Import the Angular Flex-Layout Module

**app.module.ts**
```ts
...
import { FlexLayoutModule } from '@angular/flex-layout';
...

@NgModule({
  imports: [
    ...
    FlexLayoutModule
  ],
  ...
})
export class AppModule { }
```

### Validate Your Configuration
Add the code below into an existing component ( or add something similar ) to verify `Angular Flex-Layout` has bee properly imported into your application.

**home.component.html**
```html
<div class="flexDemoContainer">
  <div fxLayout="row" fxLayout.xs="column" fxLayout.sm="column" fxFlex>
    <div fxFlex> I'm above on mobile, and left on larger devices. </div>
    <div fxFlex> I'm below on mobile, and right on larger devices. </div>
  </div>
</div>
```

**home.component.css**
```css
.flexDemoContainer {
  border: solid 1px #red;
  box-sizing: content-box !important;
}
```