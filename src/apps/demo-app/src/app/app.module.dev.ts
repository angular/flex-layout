import {NgModule, NgModuleFactoryLoader} from '@angular/core';

import * as routes from './routing.module';
import {AppComponent} from './app.component';
import {DocsGithubIssuesModuleNgFactory} from './github-issues/github-issues.module.ngfactory.js';
import {DocsGridModuleNgFactory} from './grid/grid.module.ngfactory.js';
import {DocsLayoutModuleNgFactory} from './layout/layout.module.ngfactory.js';
import {DocsResponsiveModuleNgFactory} from './responsive/responsive.module.ngfactory.js';
import {
  DocsStackOverflowModuleNgFactory
} from './stack-overflow/stack-overflow.module.ngfactory.js';
import {AppModule} from './app.module';

export class MyLoader extends NgModuleFactoryLoader {
  load(id: string) {
    switch (id) {
      case routes.gridModuleId:
        return Promise.resolve(DocsGridModuleNgFactory);
      case routes.issuesModuleId:
        return Promise.resolve(DocsGithubIssuesModuleNgFactory);
      case routes.docsModuleId:
        return Promise.resolve(DocsLayoutModuleNgFactory);
      case routes.responsiveModuleId:
        return Promise.resolve(DocsResponsiveModuleNgFactory);
      case routes.stackOverflowModuleId:
        return Promise.resolve(DocsStackOverflowModuleNgFactory);
      default:
        throw new Error(`Unrecognized route id ${id}`);
    }
  }
}

@NgModule({
  imports: [
    AppModule
  ],
  providers: [{provide: NgModuleFactoryLoader, useClass: MyLoader}],
  bootstrap: [AppComponent]
})
export class AppModuleDev { }
