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
```typescript
...
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
...

@NgModule({
  imports: [
    ...
    FlexLayoutModule
  ],
  ...
})
export class AppModule {}
```

### Validate Your Configuration
Add the code below into an existing component (or add something similar) to verify `Angular Flex-Layout` has been 
properly imported into your application.

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