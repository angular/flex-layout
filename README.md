# ng-flex-layout

*** 
  - Updated to Angular 17.*
  - Migrated from tslint to eslint
***

[![npm version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=js&r=r&ts=1683906897&type=6e&v=17.0.1-beta.1&x2=0)](https://www.npmjs.com/package/ng-flex-layout)

Angular Flex Layout provides a sophisticated layout API using Flexbox CSS + mediaQuery.
This module provides Angular developers with component layout features using a
custom Layout API, mediaQuery observables, and injected DOM flexbox-2016 CSS stylings.

The Flex Layout engine intelligently automates the process of applying appropriate
Flexbox CSS to browser view hierarchies. This automation also addresses many of the
complexities and workarounds encountered with the traditional, manual, CSS-only application of box CSS.

The **real** power of Flex Layout, however, is its **responsive** engine. The
[Responsive API](https://github.com/alessiobianchini/flex-layout/wiki/Responsive-API) enables developers to easily specify
different layouts, sizing, visibilities for different viewport sizes and display devices.

---
### Getting Started

Start by installing the Angular Layout library from `npm`

`npm i -s ng-flex-layout @angular/cdk`

Next, you'll need to import the Layout module in your app's module.

**app.module.ts**

```ts

import { FlexLayoutModule } from 'ng-flex-layout';
...

@NgModule({
    ...
    imports: [ FlexLayoutModule ],
    ...
});
```

After that is configured, you can use the Angular Layout attributes in your HTML tags for flex layout:
```html
<div fxLayout="row" fxLayoutAlign="space-between">
</div>
```

Check out [all of the available options](https://github.com/alessiobianchini/flex-layout/wiki/Declarative-API-Overview) for using Angular Layout in your application.

---

### Quick Links

*  [ChangeLog](https://github.com/alessiobianchini/flex-layout/blob/master/CHANGELOG.md)
*  [Wiki Documentation](https://github.com/alessiobianchini/flex-layout/wiki)

### Demos

*  [Explore Examples Online](https://tburleson-layouts-demos.firebaseapp.com/)
*  [Demo Source Code](https://github.com/alessiobianchini/flex-layout/blob/master/src/apps/demo-app/src/app/app.module.ts)

### StackBlitz Templates

  *  [Flex-Layout Template](https://stackblitz.com/edit/flex-layout-seed)
  *  [Flex-Layout + Material](https://stackblitz.com/edit/flex-layout-material-seed)

### Developers

*  [API Documentation](https://github.com/alessiobianchini/flex-layout/wiki/API-Documentation)
*  [Developer Setup](https://github.com/alessiobianchini/flex-layout/wiki/Developer-Setup)
*  [Builds + Fast Start](https://github.com/alessiobianchini/flex-layout/wiki/Fast-Starts)
*  [Integration with Angular CLI](https://github.com/alessiobianchini/flex-layout/wiki/Using-Angular-CLI)


----

### Browser Support
&nbsp;
<a href="http://caniuse.com/#feat=flexbox" target="_blank">
![caniuseflexbox](https://cloud.githubusercontent.com/assets/210413/21288118/917e3faa-c440-11e6-9b08-28aff590c7ae.png)
</a>

<br/>

---

### License

The sources for this package are in the [Flex Layout](https://github.com/alessiobianchini/flex-layout) repository. <br/>
Please file issues and pull requests against that repo.

License: MIT
