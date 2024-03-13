import {Component, ViewEncapsulation} from '@angular/core';

import {VERSION} from '@eresearchqut/flex-layout';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  version = VERSION.full;
}
