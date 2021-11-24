import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {DocsResponsiveComponent} from './docs-responsive/docs-responsive.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DocsResponsiveComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class RoutingModule {}
