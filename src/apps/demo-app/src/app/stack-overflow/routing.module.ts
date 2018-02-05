import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {StackOverflowComponent} from './stack-overflow/stack-overflow.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: StackOverflowComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class RoutingModule {}
