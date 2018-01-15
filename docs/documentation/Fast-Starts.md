### NPM Install

```terminal
npm install https://github.com/angular/flex-layout-builds --save
```

> Note: this installs a nightly build required for Angular 4.x; until Beta.9 is released.

Next, modify your `app.module.ts` to use the `FlexLayoutModule`:

```js
import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { FlexLayoutModule } from "@angular/flex-layout";

import { DemoApp }          from './demo-app/demo-app';

@NgModule({
  declarations    : [ DemoApp ],
  bootstrap       : [ DemoApp ],
  imports         : [
    BrowserModule,
    FlexLayoutModule
  ]
})
export class DemoAppModule { }
```

<br/>

### SystemJS + UMD

If your approach follows those shown on the tutorials at **angular.io**, then use the npm-installed file `@angular/flex-layout/bundles/flex-layout.umd.js` to easily add **Flex Layout** API features to your application 
(which uses SystemJS to load modules and transcompile).

Here is a Plunkr [Flex-Layout Template](https://plnkr.co/edit/h8hzyoEyqdCXmTBA7DfK?p=preview):

<a href="https://plnkr.co/edit/h8hzyoEyqdCXmTBA7DfK?p=preview" target="_blank">
<img src="https://cloud.githubusercontent.com/assets/210413/21197851/9bb2de6c-c202-11e6-9165-53c08663d788.png"></img>
</a>

<br/>

```js
System.config({
  transpiler: 'typescript',
  typescriptOptions: {
      // Copy of compiler options in standard tsconfig.json
      "target": "es5",
      "sourceMap": true,
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      "suppressImplicitAnyIndexErrors": true
  },
  paths: {
    'npm:': 'https://unpkg.com/'
  },
  map: {    
    'app': './src',
    '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
    '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
    '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
    '@angular/animations': 'npm:@angular/animations/bundles/animations.umd.js',
    '@angular/animations/browser': 'npm:@angular/animations/bundles/animations-browser.umd.js',
    '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
    '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
    '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser/animations': 'npm:@angular/platform-browser/bundles/platform-browser-animations.umd.js',
    '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    '@angular/flex-layout' : 'https://rawgit.com/angular/flex-layout-builds/master/bundles/flex-layout.umd.js',

    // [optional] need to use Angular Material components
    '@angular/material' : 'npm:@angular/material/bundles/material.umd.js',
    '@angular/cdk' : 'npm:@angular/cdk/bundles/cdk.umd.js',
    
    // other libraries
    'rxjs':                      'npm:rxjs',
  },
  //packages defines our app package
  packages: {
    app: {
      main: './boot.ts',
      defaultExtension: 'ts'
    },
    rxjs: {
      defaultExtension: 'js'
    }
  }
});
```
----

<br/>

### 1) Angular CLI + **yarn** + `@angular/flex-layout`

If you are using the Angular CLI to bundle and serve your application (using `ng serve`). 

```terminal
yarn add @angular/flex-layout-builds --save
```

Next, modify your `app.module.ts` to use the `FlexLayoutModule`:

```js
import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { FlexLayoutModule } from "@angular/flex-layout";

import { DemoApp }          from './demo-app/demo-app';

@NgModule({
  declarations    : [ DemoApp ],
  bootstrap       : [ DemoApp ],
  imports         : [
    BrowserModule,
    FlexLayoutModule
  ]
})
export class DemoAppModule { }
```

<br/>

### 2) UMD + `<script>`

Use Gulp and Rollup to build `flex-layout.umd.js` UMD:

```console
gulp :publish:build-releases
cp ./dist/bundles/flex-layout.umd.js  <yourProjectPath>/scripts/flex-layout.umd.js
```

Use the bundle with an external script tag in the index.html of your Angular 2 application shell:

```html
<script src="/scripts/flex-layout.umd.js"></script>

```

<br/>

### Local Builds

Developers can, however, easily install this `@angular/flex-layout` library using a **local repository build** 
and a directory copy:

```console
gulp :publish:build-releases
ditto ./dist/packages/flex-layout <projectPath>/node_modules/@angular/flex-layout
```

