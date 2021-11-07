import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {DocsGridComponent} from './docs-grid/docs-grid.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DocsGridComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class RoutingModule {}
