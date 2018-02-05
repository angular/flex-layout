import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {DocsLayoutComponent} from './docs-layout/docs-layout.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DocsLayoutComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class RoutingModule {}
